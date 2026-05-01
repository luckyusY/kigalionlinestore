"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export type CartItem = {
  slug: string;
  name: string;
  priceDisplay: string;
  price: number | null;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  addItem: (product: Product) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "kigali-cart-v1";

function toCartItem(product: Product): CartItem {
  return {
    slug: product.slug,
    name: product.name,
    priceDisplay: product.priceDisplay,
    price: product.price,
    image: product.image,
    quantity: 1,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = window.localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) as CartItem[] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    addItem(product) {
      setItems((current) => {
        const existing = current.find((item) => item.slug === product.slug);
        if (existing) {
          return current.map((item) =>
            item.slug === product.slug ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...current, toCartItem(product)];
      });
    },
    updateQuantity(slug, quantity) {
      setItems((current) =>
        current
          .map((item) => item.slug === slug ? { ...item, quantity: Math.max(1, quantity) } : item)
          .filter((item) => item.quantity > 0)
      );
    },
    removeItem(slug) {
      setItems((current) => current.filter((item) => item.slug !== slug));
    },
    clearCart() {
      setItems([]);
    },
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
