 'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  seller: {
    name: string;
    email: string;
  };
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams?.get('search') ?? '';
  const category = searchParams?.get('category') ?? '';

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (search) qs.set('search', search);
        if (category) qs.set('category', category);
        const url = `/api/products${qs.toString() ? `?${qs.toString()}` : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [search, category]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Товары</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}