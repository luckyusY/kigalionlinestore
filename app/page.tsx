import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import PayweekHero from "@/components/PayweekHero";
import { categories, products as staticProducts, Product } from "@/lib/products";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const categoryLabels: Record<string, string> = {
  Kitchen: "Home & Kitchen",
  Bathroom: "Beauty & Health",
  Home: "Home & Living",
  Fitness: "Sports & Outdoors",
  Office: "Office & School Supplies",
  Garden: "Garden & Outdoor",
  Clothing: "Women's Clothing",
  Accessories: "Tech Accessories",
};

async function getMergedProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    const docs = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    const dbProducts = docs.map(({ _id, ...p }) => ({ ...p, id: _id.toString() })) as Product[];
    const dbSlugs = new Set(dbProducts.map((p) => p.slug));
    return [...dbProducts, ...staticProducts.filter((p) => !dbSlugs.has(p.slug))];
  } catch {
    return staticProducts;
  }
}

export default async function HomePage() {
  const allProducts = await getMergedProducts();
  const featured = allProducts.filter((p) => p.featured);
  const flashDeals = allProducts.slice(0, 6);

  return (
    <div className="temu-page">
      <PayweekHero products={[...featured, ...allProducts.filter((product) => !product.featured)]} />

      <section className="jumia-flash-section">
        <div className="jumia-flash-header">
          <span>Flash Sales</span>
          <strong>Time Left: 09h : 32m : 39s</strong>
          <Link href="/products?sort=best-selling">
            See All <ChevronRight size={17} />
          </Link>
        </div>
        <div className="jumia-flash-row">
          {flashDeals.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="jumia-flash-card">
              <span className="jumia-flash-image">
                <Image src={product.image} alt={product.name} fill sizes="180px" unoptimized />
              </span>
              <span className="jumia-flash-name">{product.name}</span>
              <span className="jumia-flash-price">{product.priceDisplay}</span>
              {product.price ? (
                <span className="jumia-flash-old">{Math.round(product.price * 1.25).toLocaleString()} RWF</span>
              ) : null}
              <span className="jumia-flash-stock">
                <span />
                <small>20 items left</small>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="temu-deal-rails">
        <div className="temu-deal-panel">
          <Link href="/products?sort=best-selling" className="temu-deal-title">
            <span>Top selling items</span>
            <ChevronRight size={18} />
          </Link>
          <div className="temu-mini-rail">
            {allProducts.slice(6, 12).map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="temu-mini-deal">
                <Image src={product.image} alt={product.name} width={170} height={170} unoptimized />
                <strong>{product.priceDisplay}</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Link href="/products" className="temu-delivery-banner">
        <strong>KIGALI x EVRI</strong>
        <span>Together for faster delivery</span>
        <ChevronRight size={20} />
      </Link>

      <section className="temu-bank-picks">
        <div className="temu-bank-label">Bank Holiday Picks</div>
        <h1>EXPLORE YOUR INTERESTS</h1>
        <div className="temu-category-strip">
          <Link href="/products">Recommended</Link>
          {categories.filter((category) => category !== "All").map((category) => (
            <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
              {categoryLabels[category] || category}
            </Link>
          ))}
        </div>
      </section>

      <section className="temu-product-grid">
        {[...featured, ...allProducts.filter((product) => !product.featured)].slice(0, 36).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>

      <div className="temu-see-more-wrap">
        <Link href="/products" className="temu-see-more">See more</Link>
      </div>
    </div>
  );
}
