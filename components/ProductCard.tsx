import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const whatsappMessage = encodeURIComponent(
    `Hello! I'm interested in ordering: ${product.name} (${product.priceDisplay})`
  );

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.25s, transform 0.25s",
      }}
      className="product-card-hover"
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} style={{ display: "block", textDecoration: "none" }}>
        <div className="product-img-wrap" style={{ height: 200 }}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: "cover", transition: "transform 0.4s" }}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
          />
          {/* Category badge */}
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "rgba(255,237,213,0.95)",
              color: "#c2410c",
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 999,
              zIndex: 1,
            }}
          >
            {product.category}
          </span>
          {product.inStock && (
            <span
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "rgba(220,252,231,0.95)",
                color: "#15803d",
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 999,
                zIndex: 1,
              }}
            >
              In Stock
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
        <Link href={`/products/${product.slug}`} style={{ textDecoration: "none" }}>
          <h3
            className="line-clamp-2"
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: "#1f2937",
              lineHeight: 1.4,
              marginBottom: 6,
            }}
          >
            {product.name}
          </h3>
        </Link>
        <p
          className="line-clamp-2"
          style={{ fontSize: 12, color: "#6b7280", marginBottom: 12, lineHeight: 1.5, flex: 1 }}
        >
          {product.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 800, fontSize: 15, color: "#ea580c" }}>{product.priceDisplay}</span>
          <a
            href={`https://wa.me/250784734956?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#22c55e",
              color: "#fff",
              fontSize: 12,
              fontWeight: 700,
              padding: "7px 14px",
              borderRadius: 10,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 4,
              whiteSpace: "nowrap",
            }}
          >
            💬 Order
          </a>
        </div>
      </div>
    </div>
  );
}
