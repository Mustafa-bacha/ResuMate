import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/lib/models/Resume';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const resumes = await Resume.find({ userId: payload.userId })
      .select('-rawText')
      .sort({ createdAt: -1 });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error('Resume list error:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
  }
}
