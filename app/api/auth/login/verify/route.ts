import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Verification from '@/lib/models/Verification';

export async function POST(request: NextRequest) {
  await dbConnect();

  const { email, code } = await request.json();

  if (!email || !code) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const verification = await Verification.findOne({ email, code });

  if (!verification) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 401 });
  }

  if (new Date() > verification.expiresAt) {
    return NextResponse.json({ error: 'Code expired' }, { status: 401 });
  }

  // Код верный, возвращаем токен для следующего этапа
  const verificationToken = verification._id.toString();

  return NextResponse.json({ verificationToken, message: 'Code verified' });
}
