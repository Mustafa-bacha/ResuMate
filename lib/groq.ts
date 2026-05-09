import Groq from 'groq-sdk';

// ── Key pool ─────────────────────────────────────────────────────────────────
// Collect all GROQ_API_KEY_* env vars (1, 2, 3 …) plus legacy GROQ_API_KEY
const GROQ_KEYS: string[] = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY, // legacy single key fallback
]
  .filter((k): k is string => !!k && k !== 'your_groq_api_key_here')
  .filter((k, i, arr) => arr.indexOf(k) === i); // deduplicate

if (GROQ_KEYS.length === 0) {
  console.error('[Groq] No valid API keys found. Add GROQ_API_KEY_1/2/3 to .env.local');
}

// Round-robin state (module-level so it persists across requests in one process)
let currentKeyIndex = 0;

function getNextClient(): Groq {
  if (GROQ_KEYS.length === 0) {
    throw new Error('No Groq API keys configured. Add GROQ_API_KEY_1/2/3 to .env.local');
  }
  const key = GROQ_KEYS[currentKeyIndex % GROQ_KEYS.length];
  currentKeyIndex = (currentKeyIndex + 1) % GROQ_KEYS.length;
  return new Groq({ apiKey: key });
}

/** Run fn with automatic key rotation on 429 rate-limit errors. */
async function withKeyRotation<T>(fn: (client: Groq) => Promise<T>): Promise<T> {
  let lastError: unknown;
  // Try every key once
  for (let attempt = 0; attempt < GROQ_KEYS.length; attempt++) {
    const client = getNextClient();
    try {
      return await fn(client);
    } catch (err: unknown) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      if (status === 429) {
        console.warn(`[Groq] Rate limit hit on key attempt ${attempt + 1}. Rotating to next key…`);
        continue; // try next key
      }
      throw err; // non-rate-limit error — re-throw immediately
    }
  }
  throw lastError; // all keys exhausted
}

// ── Model ─────────────────────────────────────────────────────────────────────
export const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ── API functions ─────────────────────────────────────────────────────────────

export async function parseResume(resumeText: string) {
  return withKeyRotation(async (client) => {
    const prompt = `Analyze the following resume text and extract structured information.

RESUME TEXT:
${resumeText}

Please extract and return ONLY valid JSON with the following structure (no other text):
{
  "summary": "Professional summary or objective statement",
  "experience": [
    {
      "jobTitle": "Job title",
      "company": "Company name",
      "startDate": "Start date",
      "endDate": "End date or Present",
      "duration": "Duration",
      "description": "Role description",
      "responsibilities": ["Key responsibility 1", "Key responsibility 2"]
    }
  ],
  "education": [
    {
      "institution": "University/School name",
      "degree": "Degree type",
      "field": "Field of study",
      "graduationDate": "Graduation year",
      "gpa": "GPA if mentioned"
    }
  ],
  "skills": [
    {
      "name": "Skill name",
      "category": "Technical/Soft Skills/Languages/Frameworks/Tools/Databases/Cloud",
      "proficiency": "Beginner/Intermediate/Advanced/Expert"
    }
  ],
  "certifications": [
    {
      "name": "Certification name",
      "issuingOrganization": "Issuer",
      "issueDate": "Date"
    }
  ]
}

Return ONLY the JSON object, no other text or markdown.`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.3,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to parse resume: Invalid JSON response');
    return JSON.parse(jsonMatch[0]);
  });
}

export async function analyzeJobMatch(resumeData: object, jobDescription: string) {
  return withKeyRotation(async (client) => {
    const prompt = `You are an expert career advisor and resume analyst. Analyze the resume and job description provided.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

JOB DESCRIPTION:
${jobDescription}

Provide a comprehensive analysis in ONLY valid JSON format (no other text):
{
  "matchScore": 75,
  "matchedSkills": [
    {
      "skill": "Skill name",
      "level": "match",
      "importance": "high"
    }
  ],
  "missingSkills": [
    {
      "skill": "Missing skill",
      "category": "Technical",
      "priority": "high",
      "estimatedWeeks": 4
    }
  ],
  "keyRecommendations": [
    "Specific, actionable advice to improve match"
  ],
  "resumeOptimizations": [
    "Specific changes to make in the resume"
  ],
  "learningPath": [
    {
      "skill": "Skill to learn",
      "estimatedWeeks": 4,
      "resources": ["Resource 1", "Resource 2"]
    }
  ],
  "summary": "A 2-3 sentence paragraph summary of the analysis"
}

Return ONLY valid JSON.`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.5,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to analyze job match');
    return JSON.parse(jsonMatch[0]);
  });
}

export async function chatWithAssistant(
  userMessage: string,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  resumeContext?: object,
  jobContext?: object,
  customSystemPrompt?: string
) {
  return withKeyRotation(async (client) => {
    // Use the caller-provided system prompt if given (allows per-request personalisation)
    const systemPrompt = customSystemPrompt ?? `You are ResuMate AI, an expert career coach. Help users with career advice, resume optimisation, interview prep, and skill development.

${resumeContext ? `User Resume Context:\n${JSON.stringify(resumeContext, null, 2)}` : ''}
${jobContext ? `\nJob Context:\n${JSON.stringify(jobContext, null, 2)}` : ''}

Keep responses concise, specific and actionable. Use markdown formatting.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...chatHistory.slice(-10),
      { role: 'user' as const, content: userMessage },
    ];

    const completion = await client.chat.completions.create({
      messages,
      model: GROQ_MODEL,
      temperature: 0.85,   // higher = more natural variation per response
      max_tokens: 600,     // keep replies concise
    });

    return {
      content: completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
      tokens: {
        prompt: completion.usage?.prompt_tokens || 0,
        completion: completion.usage?.completion_tokens || 0,
      },
    };
  });
}

export async function optimizeResume(resumeData: object, jobDescription: string) {
  return withKeyRotation(async (client) => {
    const prompt = `You are an expert resume writer. Optimize the following resume for the given job description.

CURRENT RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

TARGET JOB DESCRIPTION:
${jobDescription}

Provide specific optimizations in ONLY valid JSON format:
{
  "optimizedSummary": "Rewritten professional summary tailored for this job",
  "experienceOptimizations": [
    {
      "originalTitle": "Original job title",
      "suggestions": ["Improved bullet point 1", "Improved bullet point 2"]
    }
  ],
  "skillsToHighlight": ["Skill 1", "Skill 2"],
  "keywordsToAdd": ["ATS keyword 1", "ATS keyword 2"],
  "formattingTips": ["Formatting tip 1", "Formatting tip 2"],
  "overallScore": 85,
  "improvements": ["Improvement suggestion 1", "Improvement suggestion 2"]
}

Return ONLY valid JSON.`;

    const completion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: GROQ_MODEL,
      temperature: 0.6,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Failed to optimize resume');
    return JSON.parse(jsonMatch[0]);
  });
}
