import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';

export async function POST(request: NextRequest) {
  await dbConnect();

  const { name, email, password, role, verificationToken } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // require successful email verification
  if (!verificationToken) {
    return NextResponse.json({ error: 'Email not verified' }, { status: 400 });
  }

  const v = await Verification.findOne({ email, verificationToken, verified: true });
  if (!v) return NextResponse.json({ error: 'Invalid or expired verification token' }, { status: 400 });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: role || 'buyer',
  });

  await user.save();

  // optionally remove verification record
  await Verification.deleteOne({ _id: v._id });

  return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
}