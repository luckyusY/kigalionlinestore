import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import PayweekHero from "@/components/PayweekHero";
import FlashCountdown from "@/components/FlashCountdown";
import { categories, products as staticProducts, Product } from "@/lib/products";
import { heroSlides as defaultHeroSlides, HeroSlide } from "@/lib/hero-slides";
import { getDb } from "@/lib/mongodb";
import { getReviewSummaries } from "@/lib/reviews";
import { getViewCounts } from "@/lib/views";

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

type StorefrontSettings = {
  flashTitle: string;
  flashEnabled: boolean;
  flashEndsAt: string;
  flashLink: string;
  flashProductSlugs: string;
};

const defaultStorefrontSettings: StorefrontSettings = {
  flashTitle: "Flash Sales",
  flashEnabled: true,
  flashEndsAt: "",
  flashLink: "/products?sort=best-selling",
  flashProductSlugs: "",
};

function isFlashSaleLive(endsAt: string) {
  if (!endsAt) return true;
  const end = new Date(endsAt).getTime();
  return Number.isFinite(end) && end > Date.now();
}

async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const db = await getDb();
    const doc = await db.collection("hero_slides").findOne({});
    return (doc?.slides as HeroSlide[]) ?? defaultHeroSlides;
  } catch {
    return defaultHeroSlides;
  }
}

async function getMergedProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    const docs = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    const dbProducts = docs.map(({ _id, ...p }) => ({ ...p, id: _id.toString() })) as Product[];
    const dbSlugs = new Set(dbProducts.map((p) => p.slug));
    const deletedStaticSlugs = new Set(
      (await db.collection<{ slug: string }>("deleted_static_slugs").find({}).toArray()).map(
        (entry) => entry.slug
      )
    );
    const merged = [...dbProducts, ...staticProducts.filter((p) => !dbSlugs.has(p.slug))]
      .filter((product) => !deletedStaticSlugs.has(product.slug))
      .filter((product) => product.inStock !== false);
    const slugs = merged.map((product) => product.slug);
    const [reviewSummaries, viewCounts] = await Promise.all([getReviewSummaries(slugs), getViewCounts(slugs)]);
    return merged.map((product) => ({
      ...product,
      ...(reviewSummaries[product.slug] ?? { averageRating: 0, reviewCount: 0 }),
      ...(viewCounts[product.slug] ?? { viewCount: 0 }),
    }));
  } catch {
    return staticProducts;
  }
}

async function getStorefrontSettings(): Promise<StorefrontSettings> {
  try {
    const db = await getDb();
    const doc = await db.collection("settings").findOne({ key: "site" });
    return { ...defaultStorefrontSettings, ...(doc?.value as Partial<StorefrontSettings> | undefined) };
  } catch {
    return defaultStorefrontSettings;
  }
}

export default async function HomePage() {
  const [allProducts, slides, settings] = await Promise.all([getMergedProducts(), getHeroSlides(), getStorefrontSettings()]);
  const featured = allProducts.filter((p) => p.featured);
  const selectedFlashSlugs = settings.flashProductSlugs
    .split(/[\n,]+/)
    .map((slug) => slug.trim())
    .filter(Boolean);
  const flashDeals = selectedFlashSlugs.length
    ? selectedFlashSlugs
        .map((slug) => allProducts.find((product) => product.slug === slug))
        .filter((product): product is Product => Boolean(product))
        .slice(0, 6)
    : allProducts.slice(0, 6);
  const showFlashSales = settings.flashEnabled && isFlashSaleLive(settings.flashEndsAt) && flashDeals.length > 0;

  return (
    <div className="temu-page">
      <PayweekHero slides={slides} recentProducts={allProducts.slice(0, 8)} />

      {showFlashSales && (
        <section className="jumia-flash-section">
          <div className="jumia-flash-header">
            <span>{settings.flashTitle}</span>
            {settings.flashEndsAt ? <FlashCountdown endsAt={settings.flashEndsAt} /> : <strong>Limited time deals</strong>}
            <Link href={settings.flashLink || "/products?sort=best-selling"}>
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
                <span className="jumia-flash-badge">Flash deal</span>
                <span className="jumia-flash-stock">
                  <span />
                  <small>Deal available now</small>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

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
        <strong>KOS FAST DELIVERY</strong>
        <span>Kigali orders delivered quickly</span>
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
