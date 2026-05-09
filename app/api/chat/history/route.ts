import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ChatSession from '@/lib/models/ChatSession';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      const session = await ChatSession.findOne({ _id: sessionId, userId: payload.userId });
      if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      return NextResponse.json({ session });
    }

    // Return all sessions
    const sessions = await ChatSession.find({ userId: payload.userId })
      .select('title messages createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(20);

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json({ error: 'Failed to fetch chat history' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      await ChatSession.findOneAndDelete({ _id: sessionId, userId: payload.userId });
      return NextResponse.json({ message: 'Session deleted' });
    }

    // Clear all sessions
    await ChatSession.deleteMany({ userId: payload.userId });
    return NextResponse.json({ message: 'All chat history cleared' });
  } catch (error) {
    console.error('Chat delete error:', error);
    return NextResponse.json({ error: 'Failed to clear chat history' }, { status: 500 });
  }
}
