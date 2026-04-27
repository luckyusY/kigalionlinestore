import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Phone, Truck, ChevronRight, CheckCircle, Tag } from "lucide-react";
import { getProductBySlug, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/FadeIn";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Kigali Online Store`,
    description: product.description,
  };
}

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

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const waMsg = encodeURIComponent(
    `Hi! I'd like to order: ${product.name}\nPrice: ${product.priceDisplay}\nPlease confirm availability and delivery details.`
  );

  const catStyle = categoryColors[product.category] ?? { bg: "#f3f4f6", text: "#374151" };

  return (
    <div style={{ background: "#f8fafc", minHeight: "60vh" }}>
      {/* ── Breadcrumb bar ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "12px 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Home</Link>
          <ChevronRight size={13} strokeWidth={2} />
          <Link href="/products" style={{ color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Products</Link>
          <ChevronRight size={13} strokeWidth={2} />
          <Link href={`/products?category=${product.category}`} style={{ color: "#64748b", textDecoration: "none", fontWeight: 500 }}>{product.category}</Link>
          <ChevronRight size={13} strokeWidth={2} />
          <span style={{ color: "#111827", fontWeight: 600 }} className="line-clamp-1">{product.name}</span>
        </div>
      </div>

      {/* ── Main card ── */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "32px 24px" }}>
        <FadeIn>
          <div style={{ background: "#fff", borderRadius: 24, overflow: "hidden", border: "1px solid #f1f5f9", boxShadow: "0 4px 32px rgba(0,0,0,0.06)", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="product-detail-grid">

            {/* ── Image panel ── */}
            <div style={{ position: "relative", minHeight: 420, background: "#f8fafc" }}>
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Badges */}
              <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8, zIndex: 2 }}>
                <span style={{ background: catStyle.bg, color: catStyle.text, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4 }}>
                  <Tag size={11} strokeWidth={2.5} />
                  {product.category}
                </span>
                {product.inStock && (
                  <span style={{ background: "#dcfce7", color: "#15803d", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4 }}>
                    <CheckCircle size={11} strokeWidth={2.5} />
                    In Stock
                  </span>
                )}
              </div>
            </div>

            {/* ── Info panel ── */}
            <div style={{ padding: "40px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>

              <h1 style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 900, color: "#111827", lineHeight: 1.15, marginBottom: 10, letterSpacing: "-0.02em" }}>
                {product.name}
              </h1>

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 18 }}>
                <span style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 900, color: "#ea580c", letterSpacing: "-0.02em" }}>
                  {product.priceDisplay}
                </span>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "#f1f5f9", marginBottom: 18 }} />

              {/* Description */}
              <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.75, marginBottom: 28 }}>
                {product.description}
              </p>

              {/* CTA buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
                <a
                  href={`https://wa.me/250784734956?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#16a34a", color: "#fff", fontWeight: 800, padding: "15px 24px", borderRadius: 14, textDecoration: "none", fontSize: 16, boxShadow: "0 4px 18px rgba(22,163,74,0.3)" }}
                >
                  <MessageCircle size={19} strokeWidth={2.5} />
                  Order on WhatsApp
                </a>
                <a
                  href="tel:+250784734956"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#fff", color: "#111827", fontWeight: 700, padding: "14px 24px", borderRadius: 14, textDecoration: "none", fontSize: 15, border: "1.5px solid #e5e7eb" }}
                >
                  <Phone size={17} strokeWidth={2.5} />
                  Call to Order · 0784 734 956
                </a>
              </div>

              {/* Delivery note */}
              <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 14, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Truck size={17} color="#16a34a" strokeWidth={2.5} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#15803d" }}>
                  Fast delivery available across Kigali and surrounding areas
                </span>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <section style={{ marginTop: 52 }}>
            <FadeIn>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <div className="section-label" style={{ display: "inline-flex" }}>More like this</div>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: "#111827", marginTop: 6 }}>
                    More in {product.category}
                  </h2>
                </div>
                <Link href={`/products?category=${product.category}`} style={{ color: "#f97316", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  See all →
                </Link>
              </div>
            </FadeIn>

            <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {related.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </section>
        )}
      </div>
    </div>
  );
}
