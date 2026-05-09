import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import JobMatch from '@/lib/models/JobMatch';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const match = await JobMatch.findOne({ _id: id, userId: payload.userId }).populate('resumeId', 'fileName');
    if (!match) return NextResponse.json({ error: 'Job match not found' }, { status: 404 });

    return NextResponse.json({ match });
  } catch (error) {
    console.error('Job match get error:', error);
    return NextResponse.json({ error: 'Failed to fetch job match' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const match = await JobMatch.findOneAndDelete({ _id: id, userId: payload.userId });
    if (!match) return NextResponse.json({ error: 'Job match not found' }, { status: 404 });

    return NextResponse.json({ message: 'Job match deleted' });
  } catch (error) {
    console.error('Job match delete error:', error);
    return NextResponse.json({ error: 'Failed to delete job match' }, { status: 500 });
  }
}
