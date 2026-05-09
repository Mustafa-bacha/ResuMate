import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import JobMatch from '@/lib/models/JobMatch';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const matches = await JobMatch.find({ userId: payload.userId })
      .populate('resumeId', 'fileName')
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Job matches error:', error);
    return NextResponse.json({ error: 'Failed to fetch job matches' }, { status: 500 });
  }
}
