import Link from "next/link";
import { Truck, CheckCircle, MessageCircle, Tag, ArrowRight } from "lucide-react";
import { products, categories, getFeaturedProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import HeroCarousel from "@/components/HeroCarousel";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/FadeIn";

const categoryMeta: Record<string, { icon: string; color: string }> = {
  Kitchen:     { icon: "🍳", color: "#fef3c7" },
  Bathroom:    { icon: "🚿", color: "#dbeafe" },
  Home:        { icon: "🏠", color: "#dcfce7" },
  Fitness:     { icon: "💪", color: "#fce7f3" },
  Office:      { icon: "💻", color: "#ede9fe" },
  Garden:      { icon: "🌿", color: "#d1fae5" },
  Clothing:    { icon: "👗", color: "#fef9c3" },
  Accessories: { icon: "🎒", color: "#f3e8ff" },
};

export default function HomePage() {
  const featured  = getFeaturedProducts();
  const allCats   = categories.filter(c => c !== "All");
  const carouselSlides = featured.length >= 4 ? featured : products.slice(0, 10);

  return (
    <div>
      {/* ── Hero ── */}
      <HeroCarousel slides={carouselSlides} />

      {/* ── Marquee trust strip ── */}
      <div style={{ background: "#0f0f1a", color: "rgba(255,255,255,0.55)", overflow: "hidden", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="marquee-track">
          {Array.from({ length: 2 }, (_, set) =>
            ["🚚 Fast delivery in Kigali", "💬 Order via WhatsApp", "✅ Quality guaranteed", "🇷🇼 Rwanda&apos;s trusted shop", "💰 Best prices in RWF", "📦 27+ products", "📞 0784 734 956", "🚀 Same-day delivery"].map((t, i) => (
              <span key={`${set}-${i}`} style={{ padding: "0 32px", flexShrink: 0 }}>{t}</span>
            ))
          )}
        </div>
      </div>

      {/* ── Categories ── */}
      <section style={{ background: "#fff", padding: "52px 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div className="section-label" style={{ justifyContent: "center", display: "inline-flex" }}>
                <Tag size={11} strokeWidth={3} /> Browse Categories
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "#111827", marginTop: 6 }}>
                What are you looking for?
              </h2>
            </div>
          </FadeIn>

          <StaggerGrid style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }} staggerDelay={0.05}>
            {allCats.map(cat => {
              const meta = categoryMeta[cat] ?? { icon: "📦", color: "#f3f4f6" };
              return (
                <StaggerItem key={cat}>
                  <Link href={`/products?category=${cat}`} className="cat-pill">
                    <span style={{ fontSize: 16 }}>{meta.icon}</span>
                    {cat}
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerGrid>
        </div>
      </section>

      {/* ── Featured ── */}
      <section style={{ background: "#f8fafc", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div className="section-label" style={{ display: "inline-flex" }}>
                  ⭐ Top Picks
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: "#111827", marginTop: 6 }}>Featured Products</h2>
                <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Handpicked favourites loved by our customers</p>
              </div>
              <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "#f97316", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                View All <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
            </div>
          </FadeIn>

          <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {featured.map(p => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ── WhatsApp CTA ── */}
      <FadeIn>
        <section style={{ background: "linear-gradient(135deg, #14532d 0%, #16a34a 100%)", color: "#fff", padding: "64px 24px" }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
            <div style={{ width: 68, height: 68, background: "rgba(255,255,255,0.15)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <MessageCircle size={32} color="#fff" strokeWidth={2} />
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 12, letterSpacing: "-0.02em" }}>Order via WhatsApp</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: 30, fontSize: 16, lineHeight: 1.65, maxWidth: 480, margin: "0 auto 30px" }}>
              Tap <strong>&ldquo;Order&rdquo;</strong> on any product and a message opens instantly in WhatsApp. We confirm availability, then deliver to your door.
            </p>
            <a
              href="https://wa.me/250784734956?text=Hello!%20I'd%20like%20to%20order%20from%20Kigali%20Online%20Store."
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#fff", color: "#15803d", fontWeight: 900, padding: "15px 34px", borderRadius: 999, textDecoration: "none", fontSize: 16, boxShadow: "0 8px 28px rgba(0,0,0,0.18)" }}
            >
              <MessageCircle size={18} strokeWidth={2.5} />
              0784 734 956
            </a>
          </div>
        </section>
      </FadeIn>

      {/* ── All Products ── */}
      <section style={{ background: "#fff", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div className="section-label" style={{ display: "inline-flex" }}>🆕 Full Catalogue</div>
                <h2 style={{ fontSize: 24, fontWeight: 900, color: "#111827", marginTop: 6 }}>All Products</h2>
                <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{products.length} items always in stock</p>
              </div>
              <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#111827", color: "#fff", fontWeight: 700, padding: "10px 20px", borderRadius: 999, textDecoration: "none", fontSize: 13 }}>
                Browse All <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          </FadeIn>

          <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
            {products.slice(0, 8).map(p => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerGrid>

          <FadeIn delay={0.1}>
            <div style={{ textAlign: "center", marginTop: 40 }}>
              <Link href="/products" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#f97316", color: "#fff", fontWeight: 800, padding: "14px 36px", borderRadius: 999, textDecoration: "none", fontSize: 15, boxShadow: "0 6px 20px rgba(249,115,22,0.35)" }}>
                See all {products.length} products <ArrowRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section style={{ background: "#f8fafc", padding: "56px 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div className="section-label" style={{ display: "inline-flex", justifyContent: "center" }}>💡 Why Choose Us</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, color: "#111827", marginTop: 6 }}>Why shop with us?</h2>
            </div>
          </FadeIn>

          <StaggerGrid style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 16 }}>
            {[
              { Icon: Truck,        title: "Fast Delivery",      desc: "Same-day delivery across Kigali and nearby areas",        bg: "#eff6ff", border: "#bfdbfe", iconColor: "#2563eb" },
              { Icon: CheckCircle,  title: "Quality Products",   desc: "Every item carefully selected — we only sell what works",  bg: "#f0fdf4", border: "#bbf7d0", iconColor: "#16a34a" },
              { Icon: MessageCircle,title: "WhatsApp Ordering",  desc: "Order in 10 seconds — no app, no account, no hassle",     bg: "#fefce8", border: "#fde68a", iconColor: "#ca8a04" },
              { Icon: Tag,          title: "Best Prices in RWF", desc: "Honest prices in Rwandan Francs — no hidden fees ever",   bg: "#fff7ed", border: "#fed7aa", iconColor: "#ea580c" },
            ].map(({ Icon, title, desc, bg, border, iconColor }) => (
              <StaggerItem key={title}>
                <div style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 20, padding: "28px 22px" }}>
                  <div style={{ width: 44, height: 44, background: "#fff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, boxShadow: `0 2px 8px ${border}` }}>
                    <Icon size={20} color={iconColor} strokeWidth={2} />
                  </div>
                  <h3 style={{ fontWeight: 800, color: "#111827", fontSize: 15, marginBottom: 6 }}>{title}</h3>
                  <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.55 }}>{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>
    </div>
  );
}
