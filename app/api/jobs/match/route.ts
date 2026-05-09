import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/lib/models/Resume';
import JobMatch from '@/lib/models/JobMatch';
import { getUserFromRequest } from '@/lib/auth';
import { analyzeJobMatch } from '@/lib/groq';

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const { jobTitle, jobDescription, resumeId } = await req.json();

    if (!jobTitle || !jobDescription) {
      return NextResponse.json({ error: 'Job title and description are required' }, { status: 400 });
    }

    // Get resume
    let resume;
    if (resumeId) {
      resume = await Resume.findOne({ _id: resumeId, userId: payload.userId });
    } else {
      resume = await Resume.findOne({ userId: payload.userId, isPrimary: true });
    }

    if (!resume) {
      return NextResponse.json({ error: 'Please upload a resume first' }, { status: 404 });
    }

    // Prepare resume data for analysis
    const resumeData = {
      summary: resume.extractedData?.summary,
      skills: resume.extractedData?.skills?.map((s: { name: string; category: string; proficiency: string }) => ({
        name: s.name,
        category: s.category,
        proficiency: s.proficiency,
      })),
      experience: resume.extractedData?.experience?.map((e: { jobTitle: string; company: string; duration: string; description: string }) => ({
        jobTitle: e.jobTitle,
        company: e.company,
        duration: e.duration,
        description: e.description,
      })),
      education: resume.extractedData?.education,
    };

    // Run AI analysis
    const analysis = await analyzeJobMatch(resumeData, jobDescription);

    // Save the match
    const jobMatch = await JobMatch.create({
      userId: payload.userId,
      resumeId: resume._id,
      jobTitle,
      jobDescription,
      jobSource: 'manual',
      analysis: {
        matchScore: analysis.matchScore || 0,
        matchedSkills: analysis.matchedSkills || [],
        missingSkills: analysis.missingSkills || [],
        keyRecommendations: analysis.keyRecommendations || [],
        resumeOptimizations: analysis.resumeOptimizations || [],
        learningPath: analysis.learningPath || [],
        summary: analysis.summary || '',
      },
      savedAt: new Date(),
    });

    return NextResponse.json({ jobMatch, message: 'Job match analysis complete' }, { status: 201 });
  } catch (error) {
    console.error('Job match error:', error);
    return NextResponse.json({ error: 'Failed to analyze job match' }, { status: 500 });
  }
}
