"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { products, categories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Suspense } from "react";

const categoryIcons: Record<string, string> = {
  All: "🛍️",
  Kitchen: "🍳",
  Bathroom: "🚿",
  Home: "🏠",
  Fitness: "💪",
  Office: "💻",
  Garden: "🌿",
  Clothing: "👗",
  Accessories: "🎒",
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [inputValue, setInputValue] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "All");
    const s = searchParams.get("search") || "";
    setSearchQuery(s);
    setInputValue(s);
  }, [searchParams]);

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  function applyFilter(cat: string, q: string) {
    const params = new URLSearchParams();
    if (cat !== "All") params.set("category", cat);
    if (q) params.set("search", q);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      {/* Page header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e1e2e 0%, #2d1f3d 100%)",
          color: "#fff",
          padding: "36px 20px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 4 }}>
            🛍️ All Products
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14 }}>
            {products.length} quality products available · Kigali, Rwanda
          </p>

          {/* In-page search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchQuery(inputValue);
              applyFilter(selectedCategory, inputValue);
            }}
            style={{ marginTop: 18, display: "flex", maxWidth: 520 }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                background: "rgba(255,255,255,0.1)",
                border: "1.5px solid rgba(255,255,255,0.18)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search products…"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  padding: "12px 16px",
                  fontSize: 14,
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#f97316",
                  color: "#fff",
                  border: "none",
                  padding: "0 20px",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </div>
            {(searchQuery || selectedCategory !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setInputValue("");
                  setSearchQuery("");
                  setSelectedCategory("All");
                  router.push("/products");
                }}
                style={{
                  marginLeft: 10,
                  background: "rgba(255,255,255,0.12)",
                  border: "1.5px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "0 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Clear
              </button>
            )}
          </form>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 20px" }}>
        {/* Category filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                applyFilter(cat, searchQuery);
              }}
              className={`cat-pill${selectedCategory === cat ? " active" : ""}`}
            >
              <span>{categoryIcons[cat] || "📦"}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Results meta */}
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 20,
            }}
          >
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1f2937", marginBottom: 8 }}>
              No products found
            </h3>
            <p style={{ color: "#6b7280", marginBottom: 20 }}>
              Try a different search term or browse all categories
            </p>
            <button
              onClick={() => {
                setInputValue("");
                setSearchQuery("");
                setSelectedCategory("All");
                router.push("/products");
              }}
              style={{
                background: "#f97316",
                color: "#fff",
                border: "none",
                padding: "11px 28px",
                borderRadius: 999,
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              Show all products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: "center", padding: "80px 20px", color: "#9ca3af" }}>
        Loading products…
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
