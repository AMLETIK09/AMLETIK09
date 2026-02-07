'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  count: number;
  addToCart: (productId: string, qty?: number) => void;
  updateQuantity: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  function addToCart(productId: string, qty = 1) {
    setItems((prev) => {
      const idx = prev.findIndex(i => i.productId === productId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return copy;
      }
      return [...prev, { productId, quantity: qty }];
    });
  }

  function updateQuantity(productId: string, qty: number) {
    setItems((prev) => {
      if (qty <= 0) return prev.filter(i => i.productId !== productId);
      const idx = prev.findIndex(i => i.productId === productId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: qty };
        return copy;
      }
      return [...prev, { productId, quantity: qty }];
    });
  }

  function removeFromCart(productId: string) {
    setItems((prev) => prev.filter(i => i.productId !== productId));
  }

  const count = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
