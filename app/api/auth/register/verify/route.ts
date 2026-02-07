import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Verification from '@/lib/models/Verification';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  await dbConnect();
  const { email, code } = await req.json();
  if (!email || !code) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const v = await Verification.findOne({ email });
  if (!v) return NextResponse.json({ error: 'No code requested' }, { status: 400 });
  if (v.expiresAt < new Date()) return NextResponse.json({ error: 'Code expired' }, { status: 400 });
  if (v.verified) return NextResponse.json({ error: 'Already verified' }, { status: 400 });
  if (v.code !== String(code)) return NextResponse.json({ error: 'Invalid code' }, { status: 400 });

  // mark verified and create a one-time token for final registration
  const verificationToken = crypto.randomBytes(24).toString('hex');
  v.verified = true;
  v.verificationToken = verificationToken;
  await v.save();

  return NextResponse.json({ message: 'Verified', verificationToken });
}
