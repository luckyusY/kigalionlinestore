"use client";

import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

export default function AddToCartButton({ product, className }: { product: Product; className?: string }) {
  const { addItem } = useCart();

  return (
    <button type="button" className={className} onClick={() => addItem(product)}>
      <ShoppingCart size={18} strokeWidth={2.5} />
      Add to cart
    </button>
  );
}
