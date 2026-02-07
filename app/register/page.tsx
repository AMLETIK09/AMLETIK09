'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const requestCode = async () => {
    if (!email) return setMessage('Введите email');
    setMessage(null);
    const res = await fetch('/api/auth/register/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) setMessage('Код отправлен на почту (проверьте спам)');
    else setMessage('Не удалось отправить код');
  };

  const verifyCode = async () => {
    setMessage(null);
    const res = await fetch('/api/auth/register/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    const data = await res.json();
    if (res.ok && data.verificationToken) {
      setVerificationToken(data.verificationToken);
      setIsVerified(true);
      setMessage('Email подтверждён, можно завершить регистрацию');
    } else {
      setMessage(data.error || 'Неверный код');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified || !verificationToken) return setMessage('Подтвердите email перед регистрацией');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, verificationToken }),
    });
    if (res.ok) {
      router.push('/login');
    } else {
      const data = await res.json();
      setMessage(data.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 max-w-md">
        <h1 className="text-3xl font-bold mb-8">Регистрация</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
              <button type="button" onClick={requestCode} className="bg-blue-600 text-white px-3 rounded">Получить код</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Код из письма</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2 border rounded"
              />
              <button type="button" onClick={verifyCode} className="bg-green-600 text-white px-3 rounded">Подтвердить код</button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Имя</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Роль</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="buyer">Покупатель</option>
              <option value="seller">Продавец</option>
            </select>
          </div>
          <div>
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Зарегистрироваться
            </button>
          </div>
          {message && <div className="text-sm text-gray-700">{message}</div>}
        </form>
      </main>
      <Footer />
    </div>
  );
}