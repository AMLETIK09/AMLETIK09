import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  await dbConnect();

  const body = await request.json();
  const { token, chatId } = body;
  if (!token || !chatId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const user = await User.findOne({ telegramLinkToken: token });
  if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 400 });

  if (!user.telegramLinkExpires || new Date() > user.telegramLinkExpires) {
    return NextResponse.json({ error: 'Token expired' }, { status: 400 });
  }

  user.telegramId = String(chatId);
  user.telegramLinkToken = undefined as any;
  user.telegramLinkExpires = undefined as any;
  await user.save();

  return NextResponse.json({ success: true });
}
