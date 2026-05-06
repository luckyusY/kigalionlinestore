"use client";

import { MessageCircle, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

export default function AddToCartButton({ product, className }: { product: Product; className?: string }) {
  const { addItem } = useCart();
  const waMsg = encodeURIComponent(
    `Hi! I'd like to request this product when available: ${product.name}\nPrice: ${product.priceDisplay}\nPlease notify me when it is back in stock.`
  );

  if (product.inStock === false) {
    return (
      <a
        href={`https://wa.me/250784734956?text=${waMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        <MessageCircle size={18} strokeWidth={2.5} />
        Request product
      </a>
    );
  }

  return (
    <button type="button" className={className} onClick={() => addItem(product)}>
      <ShoppingCart size={18} strokeWidth={2.5} />
      Add to cart
    </button>
  );
}
