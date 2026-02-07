'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FarmerCard from '@/components/FarmerCard';

interface Farmer {
  id: string;
  name: string;
  location?: string;
  description?: string;
  image?: string;
}

export default function FarmersPage() {
  const farmers: Farmer[] = [
    {
      id: '1',
      name: 'Ферма «Зеленая Долина»',
      location: 'Анапа',
      description: 'Свежие овощи и фрукты с собственной фермы.',
      image: '',
    },
    {
      id: '2',
      name: 'Семейная Ферма Ивановых',
      location: 'Краснодар',
      description: 'Молочные продукты и сыры ручной работы.',
      image: '',
    },
    {
      id: '3',
      name: 'Овощная Лавка',
      location: 'Темрюк',
      description: 'Органические овощи без пестицидов.',
      image: '',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Фермеры</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map(f => (
            <FarmerCard key={f.id} farmer={f} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
