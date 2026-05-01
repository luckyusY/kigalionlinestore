"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Product } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

function productStats(product: Product) {
  const oldPrice = product.price ? Math.round(product.price * 1.42) : null;

  return {
    oldPrice,
  };
}

function starFill(index: number, averageRating: number) {
  return index < Math.round(averageRating) ? "#111" : "transparent";
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const waMsg = encodeURIComponent(
    `Hi! I'd like to order: ${product.name}\nPrice: ${product.priceDisplay}\nDescription: ${product.description}\nPlease confirm availability and delivery.`
  );
  const stats = productStats(product);
  const reviewCount = product.reviewCount ?? 0;
  const averageRating = product.averageRating ?? 0;

  return (
    <article className="temu-product-card">
      <Link href={`/products/${product.slug}`} className="temu-product-image">
        <Image
          src={product.image}
          alt={product.name}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 180px"
        />
        {product.featured && <span className="temu-quick-badge">Quick look</span>}
      </Link>

      <div className="temu-product-body">
        <div className="temu-card-flags">
          <span>Local</span>
          {product.inStock && <span>Sale</span>}
        </div>

        <Link href={`/products/${product.slug}`} className="temu-product-title">
          {product.name}
        </Link>

        <div className="temu-price-row">
          <strong>{product.priceDisplay}</strong>
          {stats.oldPrice && <span>RRP {stats.oldPrice.toLocaleString()} RWF</span>}
        </div>

        <Link
          href={`/products/${product.slug}#reviews`}
          className="temu-rating-row"
          aria-label={reviewCount ? `${averageRating.toFixed(1)} stars from ${reviewCount} reviews` : "No reviews yet"}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} size={10} fill={starFill(index, averageRating)} strokeWidth={1.8} />
          ))}
          <span>{reviewCount ? reviewCount : "No reviews"}</span>
        </Link>

        <div className="temu-view-row">
          {(product.viewCount ?? 0).toLocaleString("en-US")} views
        </div>

        <div className="temu-card-actions">
          <button
            type="button"
            className="temu-cart-button"
            onClick={() => {
              addItem(product);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1400);
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={14} />
            {added ? "Added" : "Add to cart"}
          </button>
          <div className="temu-contact-actions">
            <a
              href={`https://wa.me/250784734956?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="temu-order-button"
              aria-label={`Order ${product.name} on WhatsApp`}
            >
              <MessageCircle size={15} />
              WhatsApp
            </a>
            <a
              href="tel:+250784734956"
              className="temu-call-button"
              aria-label={`Call to order ${product.name}`}
            >
              <Phone size={14} />
              Call
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
