 'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/components/CartProvider';
import { useAuth } from '@/components/AuthProvider';
import { formatPrice } from '@/lib/formatPrice';

export default function CartPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { items, count, updateQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const ids = items.map(i => i.productId);
        if (!ids.length) {
          setProducts({});
          setLoading(false);
          return;
        }

        // Try batch API first
        const res = await fetch('/api/products/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        });

        if (res.ok) {
          const body = await res.json();
          // body.products is map id->product
          setProducts(body.products || {});
        } else {
          // Fallback to individual fetches
          const map: Record<string, any> = {};
          await Promise.all(items.map(async (it) => {
            try {
              const r = await fetch(`/api/products/${it.productId}`);
              if (!r.ok) return;
              const data = await r.json();
              // accept both { product } and direct product
              map[it.productId] = data.product ?? data;
            } catch (e) {
              // ignore
            }
          }));
          setProducts(map);
        }
      } catch (e) {
        setProducts({});
      } finally {
        setLoading(false);
      }
    }

    if (items.length) load();
    else setProducts({});
  }, [items]);

  const total = items.reduce((s, it) => s + (products[it.productId]?.price ?? 0) * it.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Корзина</h1>

        {items.length === 0 && (
          <div className="p-8 bg-white rounded-lg shadow text-center">
            <p className="text-lg">Ваша корзина пуста.</p>
            <a href="/products" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded">Перейти к покупкам</a>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map(it => {
                  const p = products[it.productId];
                  return (
                    <div key={it.productId} className="flex gap-4 items-center bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
                      <div className="w-28 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        {p?.image ? <img src={p.image} alt={p.title} className="w-full h-full object-cover" /> : <div className="text-sm text-gray-400">Фото</div>}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{p?.title ?? 'Загрузка...'}</div>
                            <div className="text-sm text-gray-500">{p?.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">{p ? `${formatPrice(p.price)} руб.` : '—'}</div>
                            <div className="text-sm text-gray-500">Итого: {p ? `${formatPrice(p.price * it.quantity)} руб.` : '—'}</div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2">
                          <button onClick={() => updateQuantity(it.productId, Math.max(1, it.quantity - 1))} className="w-8 h-8 bg-gray-100 rounded">-</button>
                          <div className="w-12 text-center">{it.quantity}</div>
                          <button onClick={() => updateQuantity(it.productId, it.quantity + 1)} className="w-8 h-8 bg-gray-100 rounded">+</button>

                          <button onClick={() => removeFromCart(it.productId)} className="ml-4 text-sm text-red-600">Удалить</button>
                          <a href={`/products/${it.productId}`} className="ml-4 text-sm text-blue-600">Посмотреть</a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className="p-6 bg-white rounded-lg shadow">
              <div className="text-sm text-gray-600 mb-2">Товаров: <span className="font-semibold">{count}</span></div>
              <div className="text-2xl font-bold mb-4">Итого: {formatPrice(total)} руб.</div>
              <button className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700">Оформить заказ</button>
              <button onClick={() => router.push('/products')} className="w-full mt-3 bg-white border py-2 rounded">Продолжить покупки</button>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
