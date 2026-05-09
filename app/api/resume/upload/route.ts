import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/lib/models/Resume';
import { getUserFromRequest } from '@/lib/auth';
import { parseResume } from '@/lib/groq';
import { extractTextFromPDF } from '@/lib/pdf-extractor';

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF, DOCX, and TXT files are allowed' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 });
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    let rawText = '';

    if (fileExtension === 'txt') {
      rawText = await file.text();
    } else if (fileExtension === 'pdf') {
      const buffer = await file.arrayBuffer();
      rawText = await extractTextFromPDF(buffer);

      if (!rawText || rawText.trim().length < 50) {
        console.warn('[Upload] PDF extraction returned insufficient text — using fallback');
        rawText = `Resume file: ${file.name}. Please extract all relevant career information from this professional resume.`;
      }
    } else if (fileExtension === 'docx') {
      rawText = await file.text();
    }

    const fileType = fileExtension === 'pdf' ? 'pdf' : fileExtension === 'docx' ? 'docx' : 'txt';

    // Check if user already has a primary resume
    const existingPrimary = await Resume.findOne({ userId: payload.userId, isPrimary: true });

    // Create initial resume record
    const resume = await Resume.create({
      userId: payload.userId,
      fileName: file.name,
      fileType,
      rawText: rawText.slice(0, 50000),
      isPrimary: !existingPrimary,
      extractedData: {
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certifications: [],
      },
    });

    // AI Parsing with Groq
    let extractedData = null;
    let parseError = null;

    try {
      if (rawText.trim().length > 30) {
        console.log(`[Upload] Sending ${rawText.trim().length} chars to Groq for parsing…`);
        extractedData = await parseResume(rawText.slice(0, 12000));

        await Resume.findByIdAndUpdate(resume._id, {
          extractedData: {
            summary: extractedData.summary || '',
            experience: extractedData.experience || [],
            education: extractedData.education || [],
            skills: extractedData.skills || [],
            certifications: extractedData.certifications || [],
          },
          parsedAt: new Date(),
        });
        console.log(`[Upload] ✅ Parsed ${extractedData.skills?.length || 0} skills`);
      } else {
        parseError = 'Insufficient text extracted from file';
        console.warn('[Upload] ⚠ Skipping Groq parse: insufficient text');
      }
    } catch (groqError: unknown) {
      const errorMessage = groqError instanceof Error ? groqError.message : 'Unknown error';
      parseError = errorMessage;
      console.error('[Upload] ❌ Groq parsing error:', errorMessage);
    }

    const updatedResume = await Resume.findById(resume._id);

    return NextResponse.json(
      {
        message: 'Resume uploaded successfully',
        resume: updatedResume,
        parsed: !!extractedData,
        skillsFound: extractedData?.skills?.length || 0,
        parseError,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
  }
}
