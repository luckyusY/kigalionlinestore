import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, Phone, Truck, ChevronRight, CheckCircle, Tag, ShieldCheck } from "lucide-react";
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

      {/* ── Breadcrumb ── */}
      <div style={{ background: "#fff", borderBottom: "1px solid #f1f5f9", padding: "11px 20px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#94a3b8", flexWrap: "wrap" }}>
          <Link href="/" style={{ color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Home</Link>
          <ChevronRight size={12} strokeWidth={2} />
          <Link href="/products" style={{ color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Products</Link>
          <ChevronRight size={12} strokeWidth={2} />
          <Link href={`/products?category=${product.category}`} style={{ color: "#64748b", textDecoration: "none", fontWeight: 500 }}>
            {product.category}
          </Link>
          <ChevronRight size={12} strokeWidth={2} />
          <span style={{ color: "#111827", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
            {product.name}
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "24px 16px 48px" }}>
        <FadeIn>
          {/* ── Card: image top on mobile, side by side on desktop ── */}
          <div className="product-detail-card">

            {/* Image */}
            <div className="product-detail-img">
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {/* Badges top-left */}
              <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6, zIndex: 2, flexWrap: "wrap" }}>
                <span style={{ background: catStyle.bg, color: catStyle.text, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 3, backdropFilter: "blur(4px)" }}>
                  <Tag size={10} strokeWidth={2.5} /> {product.category}
                </span>
                {product.inStock && (
                  <span style={{ background: "rgba(220,252,231,0.95)", color: "#15803d", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 3 }}>
                    <CheckCircle size={10} strokeWidth={2.5} /> In Stock
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="product-detail-info">

              <h1 style={{ fontSize: "clamp(1.35rem, 3vw, 1.9rem)", fontWeight: 900, color: "#111827", lineHeight: 1.2, marginBottom: 8, letterSpacing: "-0.02em" }}>
                {product.name}
              </h1>

              {/* Price */}
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: "clamp(1.7rem, 4vw, 2.4rem)", fontWeight: 900, color: "#ea580c", letterSpacing: "-0.02em" }}>
                  {product.priceDisplay}
                </span>
              </div>

              <div style={{ height: 1, background: "#f1f5f9", marginBottom: 16 }} />

              {/* Description */}
              <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, marginBottom: 24 }}>
                {product.description}
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
                <a
                  href={`https://wa.me/250784734956?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "#16a34a", color: "#fff", fontWeight: 800,
                    padding: "15px 20px", borderRadius: 14, textDecoration: "none",
                    fontSize: 15, boxShadow: "0 4px 16px rgba(22,163,74,0.28)",
                  }}
                >
                  <MessageCircle size={18} strokeWidth={2.5} />
                  Order on WhatsApp
                </a>
                <a
                  href="tel:+250784734956"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "#fff", color: "#111827", fontWeight: 700,
                    padding: "13px 20px", borderRadius: 14, textDecoration: "none",
                    fontSize: 14, border: "1.5px solid #e5e7eb",
                  }}
                >
                  <Phone size={16} strokeWidth={2.5} />
                  Call: 0784 734 956
                </a>
              </div>

              {/* Trust chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {[
                  { Icon: Truck,       text: "Fast Kigali delivery",  color: "#16a34a" },
                  { Icon: ShieldCheck, text: "Quality guaranteed",    color: "#2563eb" },
                  { Icon: MessageCircle,text: "Easy WhatsApp order",  color: "#ea580c" },
                ].map(({ Icon, text, color }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 5, background: "#f8fafc", border: "1px solid #e5e7eb", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#374151" }}>
                    <Icon size={12} color={color} strokeWidth={2.5} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ── Related ── */}
        {related.length > 0 && (
          <section style={{ marginTop: 48 }}>
            <FadeIn>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
                <div>
                  <div className="section-label" style={{ display: "inline-flex" }}>More like this</div>
                  <h2 style={{ fontSize: 19, fontWeight: 900, color: "#111827", marginTop: 5 }}>
                    More in {product.category}
                  </h2>
                </div>
                <Link href={`/products?category=${product.category}`} style={{ color: "#f97316", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                  See all →
                </Link>
              </div>
            </FadeIn>
            <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
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
