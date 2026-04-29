import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
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
  const lightningDeals = allProducts.slice(0, 6);
  const clearanceDeals = allProducts.slice(6, 12);

  return (
    <div className="temu-page">
      <section className="temu-deal-rails">
        <div className="temu-deal-panel">
          <Link href="/products?sort=best-selling" className="temu-deal-title">
            <span>LIGHTNING DEALS</span>
            <ChevronRight size={18} />
          </Link>
          <div className="temu-mini-rail">
            {lightningDeals.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="temu-mini-deal">
                <Image src={product.image} alt={product.name} width={170} height={170} unoptimized />
                <strong>{product.priceDisplay}</strong>
              </Link>
            ))}
          </div>
        </div>

        <div className="temu-deal-panel">
          <Link href="/products?sort=new" className="temu-deal-title clearance">
            <span>CLEARANCE DEALS</span>
            <ChevronRight size={18} />
          </Link>
          <div className="temu-mini-rail">
            {clearanceDeals.map((product) => (
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
