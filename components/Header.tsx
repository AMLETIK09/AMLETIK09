'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useCart } from './CartProvider';

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState('');
  const { count: cartCount } = useCart();

  function submitSearch(e?: React.FormEvent) {
    e?.preventDefault();
    const qs = q.trim();
    if (qs) router.push(`/products?search=${encodeURIComponent(qs)}`);
    else router.push('/products');
  }

  useEffect(() => {
    const s = searchParams?.get('search') ?? '';
    setQ(s);
  }, [searchParams]);

  return (
    <>
      <header className="bg-gradient-to-r from-pink-500 via-purple-600 to-violet-700 text-white">
        <div className="container mx-auto px-4">
          <div className="py-3 relative flex items-center">
            {/* back button */}
            <div className="mr-3">
              <button
                onClick={() => router.back()}
                aria-label="Назад"
                className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* left: menu icon + logo */}
            <CatalogMenu />

            {/* centered search - desktop only */}
            <div className="absolute inset-x-0 flex justify-center pointer-events-none">
              <div className="w-1/2 max-w-2xl pointer-events-auto hidden md:block">
                <form onSubmit={submitSearch} className="relative">
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Найти на Marketplace"
                    className="w-full bg-white rounded-full py-3 px-6 pr-16 text-gray-700 placeholder-gray-400 outline-none shadow-md"
                  />
                  {/* camera icon inside input on the right */}
                  <button type="button" onClick={() => submitSearch()} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21h-14a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3l1-2h6l1 2h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2z" stroke="#6b21a8" strokeWidth="1" fill="#fff" />
                      <circle cx="12" cy="13" r="3" stroke="#6b21a8" strokeWidth="1" fill="#fff" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>

            {/* right actions */}
            <div className="ml-auto flex items-center gap-4">
              <ActionButton href="#" label="Заказы" count={0} />
              <ActionButton href="/favorites" label="Избранное" count={1} />
              <ActionButton href="/profile" label="Профиль" count={0} />
              <ActionButton href="/cart" label="Корзина" count={cartCount} highlight />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

function ActionButton({ href, label, count = 0, highlight = false }: { href: string; label: string; count?: number; highlight?: boolean }) {
  return (
    <Link href={href} className={`flex flex-col items-center text-sm px-3 py-1 rounded-md ${highlight ? 'bg-white/10' : 'hover:bg-white/5'}`}>
      <div className="relative">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <circle cx="12" cy="8" r="3" stroke="white" strokeWidth="1.2" />
          <path d="M5 20c0-3 3-5 7-5s7 2 7 5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {/* notification badge removed per design request */}
      </div>
      <span className="mt-1 text-white/90">{label}</span>
    </Link>
  );
}

function CatalogMenu() {
  const [catalogOpen, setCatalogOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const catalogs = [
    { slug: 'zerno', label: 'Зёрна и крупы' },
    { slug: 'semena', label: 'Семена' },
    { slug: 'zelen', label: 'Зелень и овощи' },
    { slug: 'udobrenia', label: 'Удобрения' },
    { slug: 'korm', label: 'Корма' },
    { slug: 'tehnika', label: 'Сельхозтехника' },
    { slug: 'instrum', label: 'Инвентарь и инструменты' },
    { slug: 'sad-ogorod', label: 'Сад и огород' },
  ];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setCatalogOpen(false);
      }
    }
    if (catalogOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [catalogOpen]);

  return (
    <div className="flex items-center gap-3 relative" ref={menuRef}>
      <button
        aria-expanded={catalogOpen}
        onClick={() => setCatalogOpen((s) => !s)}
        className="w-10 h-10 rounded-md bg-white/20 flex items-center justify-center"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 6h18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        </svg>
      </button>

      <Link href="/" className="flex items-center gap-3">
        <span className="text-xl font-extrabold tracking-tight">Marketplace</span>
      </Link>

      {catalogOpen && (
        <div className="absolute left-0 top-full mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg z-50">
          <ul>
            {catalogs.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products?category=${encodeURIComponent(c.slug)}`}
                  onClick={() => setCatalogOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}