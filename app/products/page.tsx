"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const cat = searchParams.get("category") || "All";
    setSelectedCategory(cat);
  }, [searchParams]);

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Our Products</h1>
          <p className="text-orange-100">
            {products.length} quality products available in Kigali, Rwanda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-5 py-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-700"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              <span>{categoryIcons[cat] || "📦"}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-gray-500 text-sm mb-6">
          Showing {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" ? ` in ${selectedCategory}` : ""}
          {searchQuery && ` for "${searchQuery}"`}
        </p>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try a different search or category</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
