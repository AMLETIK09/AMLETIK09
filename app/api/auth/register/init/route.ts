import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Verification from '@/lib/models/Verification';
import { sendMail } from '@/lib/mailer';

function generateCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  const code = generateCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  await Verification.findOneAndUpdate(
    { email },
    { code, verified: false, expiresAt, verificationToken: null, createdAt: new Date() },
    { upsert: true, new: true }
  );

  await sendMail(email, code);

  return NextResponse.json({ message: 'Code sent' });
}
