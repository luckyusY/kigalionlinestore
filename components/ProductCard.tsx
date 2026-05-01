"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Phone, Star } from "lucide-react";
import { numericId, Product } from "@/lib/products";

function productStats(product: Product) {
  const n = numericId(product.id);
  const sold = 39 + ((n * 137) % 8300);
  const oldPrice = product.price ? Math.round(product.price * 1.42) : null;

  return {
    sold: sold > 999 ? `${(sold / 1000).toFixed(1)}K` : String(sold),
    oldPrice,
  };
}

function starFill(index: number, averageRating: number) {
  return index < Math.round(averageRating) ? "#111" : "transparent";
}

export default function ProductCard({ product }: { product: Product }) {
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

        <div className="temu-sold-row">
          <span>{stats.sold} sold</span>
        </div>

        <div className="temu-delivery">Confirm delivery by call or WhatsApp</div>

        <div className="temu-card-actions">
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
    </article>
  );
}
