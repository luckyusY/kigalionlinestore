"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Product } from "@/lib/products";

const categoryColors: Record<string, { bg: string; text: string }> = {
  Kitchen:     { bg: "#fef3c7", text: "#92400e" },
  Bathroom:    { bg: "#dbeafe", text: "#1e40af" },
  Home:        { bg: "#dcfce7", text: "#166534" },
  Fitness:     { bg: "#fce7f3", text: "#9d174d" },
  Office:      { bg: "#ede9fe", text: "#5b21b6" },
  Garden:      { bg: "#d1fae5", text: "#065f46" },
  Clothing:    { bg: "#fef9c3", text: "#713f12" },
  Accessories: { bg: "#f3e8ff", text: "#6b21a8" },
};

export default function ProductCard({ product }: { product: Product }) {
  const waMsg = encodeURIComponent(`Hi! I'd like to order: ${product.name} (${product.priceDisplay})`);
  const catStyle = categoryColors[product.category] ?? { bg: "#f3f4f6", text: "#374151" };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #f1f5f9",
        transition: "box-shadow 0.3s, transform 0.3s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} style={{ display: "block", textDecoration: "none" }}>
        <div className="product-img-wrap" style={{ height: 196 }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />

          {/* Category badge */}
          <span style={{
            position: "absolute", top: 10, left: 10, zIndex: 2,
            background: catStyle.bg, color: catStyle.text,
            fontSize: 11, fontWeight: 700,
            padding: "3px 9px", borderRadius: 999,
          }}>
            {product.category}
          </span>

          {/* Stock badge */}
          {product.inStock && (
            <span style={{
              position: "absolute", top: 10, right: 10, zIndex: 2,
              background: "rgba(220,252,231,0.95)", color: "#15803d",
              fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 999,
              display: "flex", alignItems: "center", gap: 3,
            }}>
              ✓ In Stock
            </span>
          )}

          {/* Quick-view overlay */}
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.25s", zIndex: 1,
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.18)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0)"; }}
          >
            <div style={{
              background: "#fff", borderRadius: 999, padding: "7px 14px",
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 12, fontWeight: 700, color: "#111",
              opacity: 0, transition: "opacity 0.2s",
              pointerEvents: "none",
            }}
              className="card-view-btn"
            >
              <ArrowUpRight size={13} /> Quick View
            </div>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
          <h3 className="line-clamp-2" style={{
            fontWeight: 700, fontSize: 14, color: "#111827",
            lineHeight: 1.4, marginBottom: 6,
            transition: "color 0.15s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLHeadingElement).style.color = "#f97316"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLHeadingElement).style.color = "#111827"; }}
          >
            {product.name}
          </h3>
        </Link>

        <p className="line-clamp-2" style={{
          fontSize: 12, color: "#9ca3af", lineHeight: 1.55,
          marginBottom: 14, flex: 1,
        }}>
          {product.description}
        </p>

        {/* Price + CTA row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#ea580c", lineHeight: 1 }}>
              {product.priceDisplay}
            </div>
          </div>

          <a
            href={`https://wa.me/250784734956?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "#16a34a", color: "#fff",
              fontSize: 12, fontWeight: 700,
              padding: "8px 13px", borderRadius: 10,
              textDecoration: "none", transition: "background 0.15s, transform 0.15s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#15803d";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.04)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#16a34a";
              (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
            }}
          >
            <MessageCircle size={12} strokeWidth={2.5} /> Order
          </a>
        </div>
      </div>
    </div>
  );
}
