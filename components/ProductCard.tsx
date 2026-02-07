import { formatPrice } from '@/lib/formatPrice';

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 transform transition hover:-translate-y-2 hover:shadow-lg">
      <img src={product.image} alt={product.title} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
      <p className="text-gray-600 line-clamp-2">{product.description}</p>
      <p className="text-xl font-bold text-green-600 mt-2">{formatPrice(product.price)} руб.</p>
      <p className="text-sm text-gray-500">Категория: {product.category}</p>
      <p className="text-sm text-gray-500">Продавец: {product.seller.name}</p>

      <div className="mt-4 flex gap-3">
        <a href={`/products/${product._id}`} className="flex-1 text-center bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-50">Посмотреть подробнее</a>
        <AddToCartButton productId={product._id} />
      </div>
    </div>
  );
}

import { useCart } from './CartProvider';
import { useState } from 'react';

function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  async function onAdd() {
    setAdding(true);
    try {
      addToCart(productId, 1);
    } finally {
      setAdding(false);
    }
  }

  return (
    <button onClick={onAdd} disabled={adding} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
      {adding ? 'Добавление...' : 'Добавить в корзину'}
    </button>
  );
}