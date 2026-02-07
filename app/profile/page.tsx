"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';

export default function ProfilePage() {
  const router = useRouter();
  const { isLoggedIn, logout } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linked, setLinked] = useState<string | null>(null);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  async function loadMe() {
    try {
      const tokenLocal = localStorage.getItem('token');
      if (!tokenLocal) return;
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${tokenLocal}` } });
      const data = await res.json();
      if (res.ok && data.user) {
        setLinked(data.user.telegramId || null);
      }
    } catch (e) {
      // ignore
    }
  }

  // load on mount
  useEffect(() => { loadMe(); }, []);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const tokenLocal = localStorage.getItem('token');
      const res = await fetch('/api/auth/telegram/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenLocal}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setToken(data.token);
    } catch (e: any) {
      setError(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Профиль</h1>
          <div className="flex gap-3">
            <Link href="/sell" className="bg-green-600 text-white px-4 py-2 rounded">Добавить товар</Link>
            <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">Выйти из аккаунта</button>
          </div>
        </div>
        <div className="mb-4">
          <button onClick={generate} className="bg-blue-600 text-white px-4 py-2 rounded">Подключить Telegram</button>
        </div>
        {loading && <div>Генерация токена...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {linked && (
          <div className="mb-4">Текущий Telegram ID: <strong>{linked}</strong></div>
        )}
        {token && (
          <div className="bg-gray-100 p-4 rounded">
            <p>Отправьте этот код вашему Telegram-боту:</p>
            <pre className="font-mono bg-white p-2 mt-2">{token}</pre>
            <p className="mt-2">Или используйте t.me ссылку бота и отправьте код вручную.</p>
          </div>
        )}
      </main>
    </div>
  );
}
