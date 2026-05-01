import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle,
  ChevronRight,
  MessageCircle,
  PackageCheck,
  Phone,
  ShieldCheck,
  Star,
  Tag,
  Truck,
} from "lucide-react";
import { getDb } from "@/lib/mongodb";
import { getProductBySlug, numericId, Product, products as staticProducts } from "@/lib/products";
import { getReviewSummary } from "@/lib/reviews";
import ProductCard from "@/components/ProductCard";
import ProductReviews from "@/components/ProductReviews";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/FadeIn";

export const dynamic = "force-dynamic";

async function getProduct(slug: string): Promise<Product | undefined> {
  try {
    const db = await getDb();
    const doc = await db.collection("products").findOne({ slug });
    if (doc) {
      const { _id, ...rest } = doc;
      return { ...rest, id: _id.toString() } as Product;
    }
  } catch {}

  return getProductBySlug(slug);
}

async function getMergedProducts(): Promise<Product[]> {
  try {
    const db = await getDb();
    const docs = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    const dbProducts = docs.map(({ _id, ...product }) => ({
      ...product,
      id: _id.toString(),
    })) as Product[];
    const dbSlugs = new Set(dbProducts.map((product) => product.slug));
    return [...dbProducts, ...staticProducts.filter((product) => !dbSlugs.has(product.slug))];
  } catch {
    return staticProducts;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};

  return {
    title: `${product.name} | Kigali Online Store`,
    description: product.description,
  };
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  Kitchen: { bg: "#fef3c7", text: "#92400e" },
  Bathroom: { bg: "#dbeafe", text: "#1e40af" },
  Home: { bg: "#dcfce7", text: "#166534" },
  Fitness: { bg: "#fce7f3", text: "#9d174d" },
  Office: { bg: "#ede9fe", text: "#5b21b6" },
  Garden: { bg: "#d1fae5", text: "#065f46" },
  Clothing: { bg: "#fef9c3", text: "#713f12" },
  Accessories: { bg: "#f3e8ff", text: "#6b21a8" },
};

function productStats(product: Product) {
  const id = numericId(product.id);
  const sold = 39 + ((id * 137) % 8300);
  const oldPrice = product.price ? Math.round(product.price * 1.42) : null;

  return {
    sold: sold > 999 ? `${(sold / 1000).toFixed(1)}K` : String(sold),
    oldPrice,
  };
}

function starFill(index: number, averageRating: number) {
  return index < Math.round(averageRating) ? "#111827" : "transparent";
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const allProducts = await getMergedProducts();
  const related = allProducts
    .filter((item) => item.category === product.category && item.slug !== product.slug)
    .slice(0, 4);

  const galleryImages = Array.from(new Set([product.image, ...(product.images ?? [])].filter(Boolean)));
  const catStyle = categoryColors[product.category] ?? { bg: "#f3f4f6", text: "#374151" };
  const stats = productStats(product);
  const reviewSummary = await getReviewSummary(product.slug);
  const waMsg = encodeURIComponent(
    `Hi! I'd like to order: ${product.name}\nPrice: ${product.priceDisplay}\nPlease confirm availability and delivery details.`
  );

  return (
    <div className="product-detail-page">
      <div className="product-breadcrumb-wrap">
        <div className="product-breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={12} strokeWidth={2} />
          <Link href="/products">Products</Link>
          <ChevronRight size={12} strokeWidth={2} />
          <Link href={`/products?category=${product.category}`}>{product.category}</Link>
          <ChevronRight size={12} strokeWidth={2} />
          <span>{product.name}</span>
        </div>
      </div>

      <div className="product-detail-shell">
        <FadeIn>
          <div className="product-detail-card">
            <div className="product-media-panel">
              <div className="product-detail-img">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="product-photo-badges">
                  <span style={{ background: catStyle.bg, color: catStyle.text }}>
                    <Tag size={10} strokeWidth={2.5} /> {product.category}
                  </span>
                  {product.inStock && (
                    <span style={{ background: "rgba(220,252,231,0.95)", color: "#15803d" }}>
                      <CheckCircle size={10} strokeWidth={2.5} /> In Stock
                    </span>
                  )}
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="product-thumb-strip">
                  {galleryImages.slice(0, 5).map((image, index) => (
                    <div key={image} className="product-thumb">
                      <Image
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        unoptimized
                        style={{ objectFit: "cover" }}
                        sizes="76px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="product-detail-info">
              <div className="product-detail-meta">
                <span><PackageCheck size={14} /> Kigali delivery</span>
                <span><ShieldCheck size={14} /> Quality checked</span>
              </div>

              <h1 className="product-detail-title">{product.name}</h1>

              <div className="product-rating-row">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} size={13} fill={starFill(index, reviewSummary.averageRating)} strokeWidth={1.8} />
                ))}
                <a href="#reviews">
                  {reviewSummary.reviewCount
                    ? `${reviewSummary.averageRating.toFixed(1)} (${reviewSummary.reviewCount} reviews)`
                    : "No reviews yet"}
                </a>
                <span>{stats.sold} sold</span>
              </div>

              <div className="product-price-card">
                <div>
                  <strong>{product.priceDisplay}</strong>
                  {stats.oldPrice && <span>RRP {stats.oldPrice.toLocaleString()} RWF</span>}
                </div>
                <small>Confirm final availability on WhatsApp</small>
              </div>

              <div
                className="product-description"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />

              <div className="product-cta-stack">
                <a
                  href={`https://wa.me/250784734956?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-whatsapp-button"
                >
                  <MessageCircle size={18} strokeWidth={2.5} />
                  Order on WhatsApp
                </a>
                <a href="tel:+250784734956" className="product-call-button">
                  <Phone size={16} strokeWidth={2.5} />
                  Call: 0784 734 956
                </a>
              </div>

              <div className="product-trust-grid">
                {[
                  { Icon: Truck, text: "Fast Kigali delivery", color: "#16a34a" },
                  { Icon: ShieldCheck, text: "Quality guaranteed", color: "#2563eb" },
                  { Icon: MessageCircle, text: "Easy WhatsApp order", color: "#ea580c" },
                ].map(({ Icon, text, color }) => (
                  <div key={text}>
                    <Icon size={12} color={color} strokeWidth={2.5} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {galleryImages.length > 1 && (
          <section className="product-gallery-section">
            <FadeIn>
              <div className="section-label" style={{ display: "inline-flex" }}>More product photos</div>
              <div className="product-gallery-grid">
                {galleryImages.map((image, index) => (
                  <div key={image} className="product-gallery-tile">
                    <Image
                      src={image}
                      alt={`${product.name} photo ${index + 1}`}
                      fill
                      unoptimized
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 50vw, 220px"
                    />
                  </div>
                ))}
              </div>
            </FadeIn>
          </section>
        )}

        <ProductReviews productSlug={product.slug} initialSummary={reviewSummary} />

        {related.length > 0 && (
          <section className="product-related-section">
            <FadeIn>
              <div className="product-related-heading">
                <div>
                  <div className="section-label" style={{ display: "inline-flex" }}>More like this</div>
                  <h2>More in {product.category}</h2>
                </div>
                <Link href={`/products?category=${product.category}`}>See all</Link>
              </div>
            </FadeIn>
            <StaggerGrid className="product-related-grid">
              {related.map((item) => (
                <StaggerItem key={item.id}>
                  <ProductCard product={item} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </section>
        )}
      </div>

      <div className="product-mobile-sticky">
        <div>
          <span>{product.priceDisplay}</span>
          <small>{product.inStock ? "In stock" : "Confirm stock"}</small>
        </div>
        <a href={`https://wa.me/250784734956?text=${waMsg}`} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={17} />
          Order
        </a>
      </div>
    </div>
  );
}
