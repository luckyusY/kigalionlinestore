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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block bg-white/20 backdrop-blur-sm text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              🇷🇼 Kigali, Rwanda
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
              Shop Smart,<br />
              <span className="text-amber-200">Live Better</span>
            </h1>
            <p className="text-orange-100 text-lg mb-8 max-w-lg mx-auto lg:mx-0">
              Quality home, kitchen, fitness & lifestyle products delivered right to your door in Kigali.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/products"
                className="bg-white text-orange-600 font-bold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors shadow-lg"
              >
                Shop Now
              </Link>
              <a
                href="https://wa.me/250784734956"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                💬 WhatsApp Us
              </a>
            </div>
            {/* Stats */}
            <div className="flex gap-8 mt-10 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-extrabold">{products.length}+</div>
                <div className="text-orange-200 text-sm">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold">🚀</div>
                <div className="text-orange-200 text-sm">Fast Delivery</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-extrabold">⭐</div>
                <div className="text-orange-200 text-sm">Top Quality</div>
              </div>
            </div>
          </div>
          {/* Hero image collage */}
          <div className="flex-1 max-w-sm lg:max-w-md w-full">
            <div className="grid grid-cols-2 gap-3">
              {featured.slice(0, 4).map((p, i) => (
                <div
                  key={p.id}
                  className={`relative rounded-2xl overflow-hidden shadow-xl ${i === 0 ? "row-span-2 h-56" : "h-26"}`}
                  style={{ height: i === 0 ? "240px" : "112px" }}
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-10 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Shop by Category</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {allCategories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-medium px-5 py-2.5 rounded-full transition-colors"
              >
                <span>{categoryIcons[cat] || "📦"}</span>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
              <p className="text-gray-500 text-sm mt-1">Our most popular picks</p>
            </div>
            <Link
              href="/products"
              className="text-orange-600 font-semibold text-sm hover:text-orange-700 transition-colors"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA Banner */}
      <section className="bg-green-500 py-12 px-4 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">💬</div>
          <h2 className="text-3xl font-bold mb-3">Order via WhatsApp</h2>
          <p className="text-green-100 mb-6 text-lg">
            See something you like? Send us a message and we'll arrange delivery!
          </p>
          <a
            href="https://wa.me/250784734956?text=Hello%21%20I%27d%20like%20to%20order%20from%20Kigali%20Online%20Store."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-green-600 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition-colors shadow-lg text-lg"
          >
            <span>💬</span> Chat with us: 0784 734 956
          </a>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">All Products</h2>
              <p className="text-gray-500 text-sm mt-1">{products.length} items available</p>
            </div>
            <Link
              href="/products"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm px-5 py-2 rounded-full transition-colors"
            >
              Browse All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">Why Shop With Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🚚", title: "Fast Delivery", desc: "Quick delivery across Kigali and surrounding areas" },
              { icon: "✅", title: "Quality Products", desc: "Carefully selected products that meet your needs" },
              { icon: "💬", title: "Easy Ordering", desc: "Just WhatsApp us to order — simple and convenient" },
              { icon: "💰", title: "Best Prices", desc: "Competitive prices in Rwandan Francs with no hidden fees" },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl bg-orange-50">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
