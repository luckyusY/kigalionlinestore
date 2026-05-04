"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categories, numericId, products as staticProducts, Product } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";

const categoryLabels: Record<string, string> = {
  All: "Recommended",
  Kitchen: "Home & Kitchen",
  Bathroom: "Beauty & Health",
  Home: "Home & Living",
  Fitness: "Sports & Outdoors",
  Office: "Office & School Supplies",
  Garden: "Garden & Outdoor",
  Clothing: "Women's Clothing",
  Accessories: "Tech Accessories",
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data.products)) setAllProducts(data.products); })
      .catch(() => setAllProducts(staticProducts))
      .finally(() => setProductsLoading(false));
  }, []);

  const selectedCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";
  const rating = searchParams.get("rating") || "";

  const filtered = allProducts
    .filter((product) => {
      const matchCat = selectedCategory === "All" || product.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      const matchRating = rating === "5" ? numericId(product.id) % 3 !== 0 : true;
      return matchCat && matchSearch && matchRating;
    })
    .sort((a, b) => {
      if (sort === "new") {
        if (typeof a.id === "string" && typeof b.id === "string") return 0;
        if (typeof a.id === "string") return -1;
        if (typeof b.id === "string") return 1;
        return (b.id as number) - (a.id as number);
      }
      if (sort === "top-viewed") return (b.viewCount ?? 0) - (a.viewCount ?? 0);
      if (sort === "best-selling") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return 0;
    });

  function applyFilter(category: string, query: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") params.delete("category");
    else params.set("category", category);
    if (query) params.set("search", query);
    else params.delete("search");
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="temu-page">
      <section className="temu-feed-header">
        <div>
          <h1>Explore Your Interests</h1>
          <p>{filtered.length} finds available in Kigali with WhatsApp ordering</p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            applyFilter(selectedCategory, String(formData.get("search") || ""));
          }}
        >
          <input
            key={searchQuery}
            name="search"
            defaultValue={searchQuery}
            placeholder="Search products"
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className="temu-category-strip" aria-label="Product categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={selectedCategory === category ? "active" : ""}
            onClick={() => applyFilter(category, searchQuery)}
          >
            {categoryLabels[category] || category}
          </button>
        ))}
      </section>

      {(searchQuery || selectedCategory !== "All" || sort || rating) && (
        <div className="temu-filter-summary">
          <span>
            Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
            {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
            {searchQuery ? ` for "${searchQuery}"` : ""}
          </span>
          <button type="button" onClick={() => router.push("/products")}>Clear filters</button>
        </div>
      )}

      {productsLoading ? (
        <ProductGridSkeleton count={18} />
      ) : filtered.length > 0 ? (
        <section className="temu-product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <section className="temu-empty">
          <h2>No products found</h2>
          <p>Try a different search term or browse all categories.</p>
          <button type="button" onClick={() => router.push("/products")}>Show all products</button>
        </section>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="temu-page"><ProductGridSkeleton count={18} /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
