import Image from "next/image";
import Link from "next/link";
import { getFeaturedProducts, categories, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

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

  return (
    <div>
      {/* ── Hero ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #f59e0b 100%)",
          color: "#fff",
          padding: "60px 16px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 40,
          }}
          className="lg:flex-row"
        >
          {/* Text side */}
          <div style={{ flex: 1, textAlign: "center" }} className="lg:text-left">
            <div
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.2)",
                padding: "6px 16px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              🇷🇼 Kigali, Rwanda
            </div>

            <h1
              style={{
                fontSize: "clamp(2rem, 5vw, 3.25rem)",
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              Shop Smart,{" "}
              <span style={{ color: "#fde68a" }}>Live Better</span>
            </h1>

            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.9)", marginBottom: 28, maxWidth: 500 }}>
              Quality home, kitchen, fitness &amp; lifestyle products delivered right to your door in Kigali.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }} className="lg:justify-start">
              <Link
                href="/products"
                style={{
                  background: "#fff",
                  color: "#ea580c",
                  fontWeight: 800,
                  padding: "12px 28px",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontSize: 15,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                Shop Now
              </Link>
              <a
                href="https://wa.me/250784734956"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "#22c55e",
                  color: "#fff",
                  fontWeight: 800,
                  padding: "12px 28px",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontSize: 15,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                }}
              >
                💬 WhatsApp Us
              </a>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 32, marginTop: 36, justifyContent: "center" }} className="lg:justify-start">
              {[
                { value: `${products.length}+`, label: "Products" },
                { value: "🚀", label: "Fast Delivery" },
                { value: "⭐", label: "Top Quality" },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 900 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image collage — fixed grid with explicit heights */}
          <div style={{ width: "100%", maxWidth: 380 }}>
            <div className="hero-img-grid">
              {/* Large image — spans 2 rows */}
              {featured[0] && (
                <div className="hero-img-main" style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
                  <Image
                    src={featured[0].image}
                    alt={featured[0].name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="190px"
                  />
                </div>
              )}
              {/* Small images */}
              {featured.slice(1, 3).map((p) => (
                <div
                  key={p.id}
                  className="hero-img-sm"
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="140px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section style={{ background: "#fff", padding: "40px 16px", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1f2937", textAlign: "center", marginBottom: 20 }}>
            Shop by Category
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {allCategories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "#fff7ed",
                  border: "1.5px solid #fed7aa",
                  color: "#c2410c",
                  fontWeight: 700,
                  padding: "10px 20px",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
              >
                <span>{categoryIcons[cat] || "📦"}</span>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{ padding: "48px 16px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1f2937" }}>Featured Products</h2>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Our most popular picks</p>
            </div>
            <Link
              href="/products"
              style={{ color: "#ea580c", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
            >
              View All →
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
      <section style={{ background: "#16a34a", color: "#fff", padding: "56px 16px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>💬</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 10 }}>Order via WhatsApp</h2>
        <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: 24, fontSize: 16 }}>
          See something you like? Send us a message and we&apos;ll arrange delivery!
        </p>
        <a
          href="https://wa.me/250784734956?text=Hello%21%20I%27d%20like%20to%20order%20from%20Kigali%20Online%20Store."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            color: "#16a34a",
            fontWeight: 800,
            padding: "14px 32px",
            borderRadius: 999,
            textDecoration: "none",
            fontSize: 16,
            boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
          }}
        >
          💬 Chat with us: 0784 734 956
        </a>
      </section>

      {/* ── All Products preview ── */}
      <section style={{ padding: "48px 16px", background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1f2937" }}>All Products</h2>
              <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{products.length} items available</p>
            </div>
            <Link
              href="/products"
              style={{
                background: "#ea580c",
                color: "#fff",
                fontWeight: 700,
                padding: "9px 20px",
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
        </div>
      </section>

      {/* ── Why Us ── */}
      <section style={{ padding: "48px 16px", background: "#f9fafb" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1f2937", textAlign: "center", marginBottom: 32 }}>
            Why Shop With Us?
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {[
              { icon: "🚚", title: "Fast Delivery", desc: "Quick delivery across Kigali and surrounding areas" },
              { icon: "✅", title: "Quality Products", desc: "Carefully selected products that meet your needs" },
              { icon: "💬", title: "Easy Ordering", desc: "Just WhatsApp us to order — simple and convenient" },
              { icon: "💰", title: "Best Prices", desc: "Competitive prices in Rwandan Francs, no hidden fees" },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "#fff7ed",
                  borderRadius: 20,
                  padding: "28px 20px",
                  textAlign: "center",
                  border: "1px solid #fed7aa",
                }}
              >
                <div style={{ fontSize: 36, marginBottom: 10 }}>{item.icon}</div>
                <h3 style={{ fontWeight: 800, color: "#1f2937", marginBottom: 6, fontSize: 15 }}>{item.title}</h3>
                <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
