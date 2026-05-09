import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Resume from '@/lib/models/Resume';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const resume = await Resume.findOne({ _id: id, userId: payload.userId });
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Resume get error:', error);
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const body = await req.json();
    
    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId: payload.userId },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Resume update error:', error);
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { id } = await params;
    const resume = await Resume.findOneAndDelete({ _id: id, userId: payload.userId });
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    return NextResponse.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Resume delete error:', error);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
