'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';

export default function Login() {
  const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setMessage('Введите email');
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setMessage('Код отправлен на почту (проверьте спам)');
        setStep('code');
      } else {
        const data = await res.json();
        setMessage(data.error || 'Не удалось отправить код');
      }
    } catch (error) {
      setMessage('Ошибка сервера');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return setMessage('Введите код');
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (res.ok && data.verificationToken) {
        setVerificationToken(data.verificationToken);
        setMessage('Email подтверждён, введите пароль');
        setStep('password');
      } else {
        setMessage(data.error || 'Неверный код');
      }
    } catch (error) {
      setMessage('Ошибка сервера');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return setMessage('Введите пароль');
    if (!verificationToken) return setMessage('Пройдите верификацию email');
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, verificationToken }),
      });
      if (res.ok) {
        const data = await res.json();
        login(data.token);
        router.push('/products');
      } else {
        const data = await res.json();
        setMessage(data.error || 'Ошибка входа');
      }
    } catch (error) {
      setMessage('Ошибка сервера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 max-w-md">
        <h1 className="text-3xl font-bold mb-8">Вход</h1>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('Ошибка') || message.includes('Неверный') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        {step === 'email' && (
          <form onSubmit={requestCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Отправка...' : 'Получить код подтверждения'}
            </button>
          </form>
        )}

        {step === 'code' && (
          <form onSubmit={verifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={email} disabled className="w-full p-2 border rounded bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Код из письма</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Введите 6-значный код"
                maxLength={6}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Проверка...' : 'Подтвердить код'}
            </button>
            <button type="button" onClick={() => setStep('email')} className="w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400">
              Вернуться
            </button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={email} disabled className="w-full p-2 border rounded bg-gray-100" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Вход...' : 'Войти'}
            </button>
            <button type="button" onClick={() => setStep('email')} className="w-full bg-gray-300 text-gray-800 p-2 rounded hover:bg-gray-400">
              Вернуться
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Нет аккаунта?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Зарегистрироваться
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}