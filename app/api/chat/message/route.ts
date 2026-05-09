import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatSession from '@/lib/models/ChatSession';
import Resume from '@/lib/models/Resume';
import { getUserFromRequest } from '@/lib/auth';
import { chatWithAssistant } from '@/lib/groq';

// Random tone for natural response variation
const TONES = [
  'Be direct and confident.',
  'Be encouraging and motivating.',
  'Be concise and practical.',
  'Be insightful and strategic.',
  'Be friendly and conversational.',
];

function buildResumeContextString(ctx: {
  summary?: string;
  skills?: Array<{ name: string; category: string; proficiency: string }>;
  experience?: Array<{ jobTitle: string; company: string; duration?: string }>;
  education?: Array<{ institution: string; degree: string; field?: string; graduationDate?: string }>;
} | undefined): string {
  if (!ctx) return '';
  const parts: string[] = [];
  if (ctx.summary) parts.push(`Summary: ${ctx.summary}`);
  if (ctx.skills?.length) {
    parts.push(`Skills (${ctx.skills.length}): ${ctx.skills.map(s => `${s.name} [${s.proficiency}]`).join(', ')}`);
  }
  if (ctx.experience?.length) {
    parts.push(`Experience: ${ctx.experience.map(e => `${e.jobTitle} at ${e.company}${e.duration ? ` (${e.duration})` : ''}`).join(' | ')}`);
  }
  if (ctx.education?.length) {
    parts.push(`Education: ${ctx.education.map(e => `${e.degree}${e.field ? ' in ' + e.field : ''} — ${e.institution}${e.graduationDate ? ` (${e.graduationDate})` : ''}`).join(' | ')}`);
  }
  return parts.join('\n');
}

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const { message, sessionId, resumeId, jobMatchId } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get or create chat session
    let session;
    if (sessionId) {
      session = await ChatSession.findOne({ _id: sessionId, userId: payload.userId });
    }
    if (!session) {
      session = await ChatSession.create({
        userId: payload.userId,
        resumeId: resumeId || undefined,
        jobMatchId: jobMatchId || undefined,
        title: message.slice(0, 50),
        messages: [],
        context: { type: 'general' },
      });
    }

    // Get resume context — prefer explicit resumeId, fall back to primary
    let resumeContext;
    if (session.resumeId || resumeId) {
      const resume = await Resume.findOne({
        _id: session.resumeId || resumeId,
        userId: payload.userId,
      }).select('extractedData');
      if (resume) resumeContext = resume.extractedData;
    } else {
      const primary = await Resume.findOne({ userId: payload.userId, isPrimary: true }).select('extractedData');
      if (primary) resumeContext = primary.extractedData;
    }

    // Build personalized system prompt
    const randomTone = TONES[Math.floor(Math.random() * TONES.length)];
    const resumeStr = buildResumeContextString(resumeContext as Parameters<typeof buildResumeContextString>[0]);

    const systemPrompt = `You are ResuMate AI, a sharp career coach. ${randomTone}

${resumeStr
  ? `USER RESUME DATA:\n${resumeStr}\n\nIMPORTANT: Reference their ACTUAL skills, companies, and background specifically. Never give generic advice.`
  : 'No resume uploaded yet. Encourage the user to upload their resume for personalized advice.'
}

STRICT RESPONSE RULES:
- Output ONLY clean HTML — no markdown, no triple backticks, no raw asterisks
- Max 100–130 words
- Use only: <p>, <ul>, <li>, <strong>, <span> tags
- Highlight key terms with <strong>
- For lists use <ul><li>
- End every response with: <p><strong>💡 Tip:</strong> [one sharp actionable next step]</p>`;

    // Build chat history
    const chatHistory = session.messages.slice(-10).map((m: { role: 'user' | 'assistant'; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    // Call Groq with custom system prompt
    const response = await chatWithAssistant(message, chatHistory, undefined, undefined, systemPrompt);

    // Save to session
    session.messages.push(
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: response.content, timestamp: new Date(), tokens: response.tokens }
    );
    await session.save();

    return NextResponse.json({
      message: response.content,
      sessionId: session._id,
      tokens: response.tokens,
    });
  } catch (error) {
    console.error('Chat message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
