import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import Verification from '@/lib/models/Verification';
import crypto from 'crypto';
import { sendMail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  await dbConnect();

  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Генерируем код подтверждения
  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 минут

  await Verification.updateOne(
    { email },
    { email, code, expiresAt },
    { upsert: true }
  );

  // Отправляем код на почту
  try {
    await sendMail(email, code);
  } catch (error) {
    console.error('Email send error:', error);
    // Продолжаем выполнение даже если email не отправился
    // Код всё равно сохранён в базе и может быть проверен
  }

  return NextResponse.json({ message: 'Code sent to email' });
}
