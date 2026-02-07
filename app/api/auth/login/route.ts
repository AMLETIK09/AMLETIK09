import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';

export async function POST(request: NextRequest) {
  await dbConnect();

  const { email, password, verificationToken } = await request.json();

  if (!email || !password || !verificationToken) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Проверяем верификационный токен
  const verification = await Verification.findById(verificationToken);
  if (!verification || verification.email !== email) {
    return NextResponse.json({ error: 'Email verification required' }, { status: 401 });
  }

  // Проверяем код подтверждения
  if (new Date() > verification.expiresAt) {
    return NextResponse.json({ error: 'Verification expired' }, { status: 401 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Удаляем использованный верификационный код
  await Verification.deleteOne({ _id: verificationToken });

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1d' });

  return NextResponse.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}