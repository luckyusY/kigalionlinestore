import Link from "next/link";
import { products, categories, getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";

const categoryIcons: Record<string, string> = {
  Kitchen: "🍳",
  Bathroom: "🚿",
  Home: "🏠",
  Fitness: "💪",
  Office: "💻",
  Garden: "🌿",
  Clothing: "👗",
  Accessories: "🎒",
};

export default function HomePage() {
  const featured = getFeaturedProducts();
  const allCategories = categories.filter((c) => c !== "All");

  // Use all products in carousel (more variety), capped at 10
  const carouselSlides = featured.length >= 3 ? featured : products.slice(0, 10);

  return (
    <div>
      {/* ── Hero Carousel ── */}
      <HeroCarousel slides={carouselSlides} />

      {/* ── Scrolling trust banner ── */}
      <div
        style={{
          background: "#1e1e2e",
          color: "rgba(255,255,255,0.7)",
          overflow: "hidden",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.04em",
          padding: "10px 0",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="marquee-track">
          {[
            "🚚 Fast delivery in Kigali",
            "💬 Order via WhatsApp",
            "✅ Quality guaranteed",
            "🇷🇼 Rwanda's trusted shop",
            "💰 Best prices in RWF",
            "📦 27+ products available",
            "📞 Call: 0784 734 956",
            "🚀 Same-day delivery",
            "🚚 Fast delivery in Kigali",
            "💬 Order via WhatsApp",
            "✅ Quality guaranteed",
            "🇷🇼 Rwanda's trusted shop",
            "💰 Best prices in RWF",
            "📦 27+ products available",
            "📞 Call: 0784 734 956",
            "🚀 Same-day delivery",
          ].map((item, i) => (
            <span key={i} style={{ padding: "0 28px", flexShrink: 0 }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── Shop by Category ── */}
      <section style={{ background: "#fff", padding: "44px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#111827" }}>
              Shop by Category
            </h2>
            <p style={{ fontSize: 14, color: "#6b7280", marginTop: 6 }}>
              Browse our full range across {allCategories.length} categories
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {allCategories.map((cat) => (
              <Link key={cat} href={`/products?category=${cat}`} className="cat-pill">
                <span style={{ fontSize: 18 }}>{categoryIcons[cat] || "📦"}</span>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{ background: "#f9fafb", padding: "48px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 28,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111827" }}>
                ⭐ Featured Products
              </h2>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                Our most popular picks — handpicked for you
              </p>
            </div>
            <Link
              href="/products"
              style={{
                color: "#f97316",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              View All Products →
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #15803d 0%, #22c55e 100%)",
          color: "#fff",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>💬</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>
            Order via WhatsApp
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.85)",
              marginBottom: 28,
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            Tap any product&#39;s <strong>&ldquo;Order&rdquo;</strong> button and a pre-filled
            WhatsApp message opens instantly. We confirm, you pay on delivery.
          </p>
          <a
            href="https://wa.me/250784734956?text=Hello%21%20I%27d%20like%20to%20order%20from%20Kigali%20Online%20Store."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#fff",
              color: "#15803d",
              fontWeight: 900,
              padding: "15px 36px",
              borderRadius: 999,
              textDecoration: "none",
              fontSize: 16,
              boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
            }}
          >
            💬 Chat: 0784 734 956
          </a>
        </div>
      </section>

      {/* ── New Arrivals / All Products grid ── */}
      <section style={{ background: "#fff", padding: "48px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 28,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#111827" }}>
                🆕 All Products
              </h2>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                {products.length} products · always in stock
              </p>
            </div>
            <Link
              href="/products"
              style={{
                background: "#1e1e2e",
                color: "#fff",
                fontWeight: 700,
                padding: "10px 22px",
                borderRadius: 999,
                textDecoration: "none",
                fontSize: 13,
              }}
            >
              Browse All
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link
              href="/products"
              style={{
                display: "inline-block",
                background: "#f97316",
                color: "#fff",
                fontWeight: 800,
                padding: "14px 40px",
                borderRadius: 999,
                textDecoration: "none",
                fontSize: 15,
                boxShadow: "0 4px 16px rgba(249,115,22,0.35)",
              }}
            >
              See all {products.length} products →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section style={{ background: "#f9fafb", padding: "48px 20px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "#111827",
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            Why Shop With Us?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 18,
            }}
          >
            {[
              { icon: "🚚", title: "Fast Delivery", desc: "Quick delivery across Kigali and nearby areas", color: "#eff6ff", border: "#bfdbfe" },
              { icon: "✅", title: "Quality Products", desc: "Every product carefully selected for your needs", color: "#f0fdf4", border: "#bbf7d0" },
              { icon: "💬", title: "WhatsApp Ordering", desc: "Order in seconds — no app, no signup needed", color: "#fefce8", border: "#fde68a" },
              { icon: "💰", title: "Best Prices", desc: "Competitive RWF prices with no hidden fees ever", color: "#fff7ed", border: "#fed7aa" },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: item.color,
                  border: `1.5px solid ${item.border}`,
                  borderRadius: 20,
                  padding: "28px 20px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 38, marginBottom: 12 }}>{item.icon}</div>
                <h3 style={{ fontWeight: 800, color: "#1f2937", marginBottom: 6, fontSize: 15 }}>
                  {item.title}
                </h3>
                <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
