"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/components/CartProvider';
import { formatPrice } from '@/lib/formatPrice';

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [specs, setSpecs] = useState<Record<string, any> | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data.product);
        setReviews(data.reviews || []);
        setSpecs(data.specs ?? null);

        // related products by category
        if (data.product?.category) {
          const r = await fetch(`/api/products?category=${encodeURIComponent(data.product.category)}`);
          if (r.ok) {
            const list = await r.json();
            const others = Array.isArray(list) ? list.filter((p: any) => p._id !== id).slice(0, 4) : [];
            setRelated(others);
          }
        }
      } catch (e) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  function showToast(text: string) {
    setToast(text);
    setTimeout(() => setToast(null), 2500);
  }

  async function handleAddToCart() {
    addToCart(product._id, 1);
    showToast('Товар добавлен в корзину');
  }

  if (loading) return (<div className="min-h-screen"><Header /><main className="container mx-auto p-4">Загрузка...</main><Footer /></div>);
  if (!product) return (<div className="min-h-screen"><Header /><main className="container mx-auto p-4">Товар не найден</main><Footer /></div>);

  // calculate average rating
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto p-6">
        <nav className="text-sm text-gray-500 mb-4">
          <a href="/">Главная</a> / <a href="/products">Товары</a> / <span className="text-gray-700">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="w-full h-96 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                    {product.images && product.images.length ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      product.image ? <img src={product.image} alt={product.title} className="w-full h-full object-cover" /> : <div className="text-gray-400">Фото товара</div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-3">
                    {(product.images ?? [product.image]).slice(0,4).map((src: string, i: number) => (
                      <div key={i} className="h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        {src ? <img src={src} alt={`img-${i}`} className="w-full h-full object-cover" /> : <div className="text-gray-400">Фото фрагмент</div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-80">
                  <div className="sticky top-24 space-y-4">
                    <div>
                      <h1 className="text-2xl font-bold">{product.title}</h1>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="text-3xl font-extrabold text-green-600">{formatPrice(product.price)} руб.</div>
                        {avgRating && <div className="text-sm text-yellow-600">★ {avgRating} · {reviews.length} отзыв{reviews.length === 1 ? '' : 'ов'}</div>}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">Категория: {product.category}</div>
                    </div>

                    <div className="p-4 border rounded">
                      <div className="text-sm text-gray-600">Доступность</div>
                      <div className="font-semibold mt-1">В наличии</div>
                      <div className="text-sm text-gray-500 mt-2">Доставка по договорённости</div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={handleAddToCart} className="flex-1 bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700">Добавить в корзину</button>
                      <button onClick={() => router.push('/cart')} className="flex-1 bg-white border py-3 rounded">Перейти в корзину</button>
                    </div>

                    <div className="text-sm text-gray-500">
                      <div>Оплата: наличными/картой</div>
                      <div className="mt-2">Гарантия возврата 14 дней</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold">Описание</h2>
                <div className="mt-2 text-gray-700 leading-relaxed">{product.description}</div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Характеристики</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li><span className="text-gray-500">Вес:</span> {specs?.weight ?? product.specs?.weight ?? '—'}</li>
                    <li><span className="text-gray-500">Происхождение:</span> {specs?.origin ?? product.specs?.origin ?? '—'}</li>
                    <li><span className="text-gray-500">Категория:</span> {product.category}</li>
                    <li><span className="text-gray-500">Артикул:</span> {product._id}</li>
                  </ul>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <h3 className="font-semibold mb-2">Отзывы покупателей</h3>
                  {reviews.length === 0 ? (
                    <div className="text-sm text-gray-500">Пока нет отзывов.</div>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map(r => (
                        <div key={r.id} className="p-3 bg-white rounded border">
                          <div className="flex justify-between items-center">
                            <div className="font-medium">{r.author}</div>
                            <div className="text-sm text-yellow-600">{r.rating}★</div>
                          </div>
                          <div className="text-sm text-gray-700 mt-1">{r.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Похожие товары</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {related.map(rp => (
                    <a key={rp._id} href={`/products/${rp._id}`} className="block p-3 bg-white rounded shadow hover:shadow-md">
                      <div className="h-28 bg-gray-100 mb-2 overflow-hidden rounded">{rp.image ? <img src={rp.image} alt={rp.title} className="w-full h-full object-cover" /> : <div className="text-gray-400 p-6">Фото</div>}</div>
                      <div className="text-sm font-medium">{rp.title}</div>
                      <div className="text-sm text-green-600">{formatPrice(rp.price)} руб.</div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>

          <aside className="p-4">
            <div className="bg-white p-4 rounded shadow sticky top-24">
              <div className="text-sm text-gray-500">Продавец</div>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">{product.seller?.name?.[0] ?? 'Ф'}</div>
                <div>
                  <div className="font-semibold">{product.seller?.name}</div>
                  <div className="text-sm text-gray-500">На Marketplace с 2023</div>
                </div>
              </div>

              {product.seller?.email && (
                <a href={`mailto:${product.seller.email}`} className="mt-3 block text-sm text-blue-600">Написать продавцу</a>
              )}

              <div className="mt-4 border-t pt-4">
                <div className="text-sm text-gray-500">Рейтинг продавца</div>
                <div className="font-semibold mt-1">4.8 ★ — 24 отзыва</div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      {toast && (
        <div className="fixed right-6 bottom-6 bg-black/80 text-white px-4 py-2 rounded shadow">{toast}</div>
      )}
    </div>
  );
}
