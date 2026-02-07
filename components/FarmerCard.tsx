import React from 'react';

interface Farmer {
  id: string;
  name: string;
  location?: string;
  description?: string;
  image?: string;
}

export default function FarmerCard({ farmer }: { farmer: Farmer }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <div className="h-40 bg-gray-100 flex items-center justify-center">
        {farmer.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={farmer.image} alt={farmer.name} className="object-cover w-full h-full" />
        ) : (
          <div className="text-gray-400">Фото фермера</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{farmer.name}</h3>
        {farmer.location && <div className="text-sm text-gray-500 mb-2">{farmer.location}</div>}
        <p className="text-sm text-gray-700">{farmer.description ?? 'Описание отсутствует.'}</p>

        <div className="mt-4 flex gap-2">
          <a href={`/farmers/${farmer.id}`} className="flex-1 text-center bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-50">Посмотреть подробнее</a>
          <a href={`mailto:${farmer.email ?? ''}`} className="text-sm text-blue-600 px-3 py-2">Связаться</a>
        </div>
      </div>
    </div>
  );
}
