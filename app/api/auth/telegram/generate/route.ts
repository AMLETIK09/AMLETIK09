import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

async function getUserFromAuth(req: NextRequest) {
  const auth = req.headers.get('authorization') || '';
  const m = auth.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const token = m[1];
  try {
    const payload: any = jwt.verify(token, process.env.JWT_SECRET!);
    return payload.userId;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();

  const userId = await getUserFromAuth(request);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // create short token
  const token = crypto.randomBytes(4).toString('hex');
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await User.findById(userId);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  user.telegramLinkToken = token;
  user.telegramLinkExpires = expires;
  await user.save();

  return NextResponse.json({ token, expires: expires.toISOString() });
}
