import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/lib/models/Resume';
import { getUserFromRequest } from '@/lib/auth';
import { parseResume } from '@/lib/groq';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const resume = await Resume.findOne({ _id: id, userId: payload.userId });
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    // If rawText is missing/too short, we cannot re-parse — user must re-upload
    if (!resume.rawText || resume.rawText.trim().length < 30) {
      return NextResponse.json(
        {
          error:
            'This resume has no extractable text stored. Please delete it and re-upload the file to enable AI analysis.',
        },
        { status: 400 }
      );
    }

    console.log(`[Parse] Re-parsing resume ${id}. Text length: ${resume.rawText.length}`);
    const extractedData = await parseResume(resume.rawText.slice(0, 12000));

    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      {
        extractedData: {
          summary: extractedData.summary || '',
          experience: extractedData.experience || [],
          education: extractedData.education || [],
          skills: extractedData.skills || [],
          certifications: extractedData.certifications || [],
        },
        parsedAt: new Date(),
      },
      { new: true }
    );

    console.log(`[Parse] Done. ${extractedData.skills?.length || 0} skills extracted.`);

    return NextResponse.json({
      resume: updatedResume,
      message: `Resume parsed successfully. Found ${extractedData.skills?.length || 0} skills.`,
      skillsFound: extractedData.skills?.length || 0,
    });
  } catch (error) {
    console.error('Resume parse error:', error);
    return NextResponse.json({ error: 'Failed to parse resume. Please try again.' }, { status: 500 });
  }
}
