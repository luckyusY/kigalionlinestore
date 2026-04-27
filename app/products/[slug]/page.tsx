import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Kigali Online Store`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const whatsappMessage = encodeURIComponent(
    `Hello! I'd like to order: ${product.name}\nPrice: ${product.priceDisplay}\nPlease confirm availability and delivery details.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-orange-600 transition-colors">Products</Link>
        <span>/</span>
        <Link href={`/products?category=${product.category}`} className="hover:text-orange-600 transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">{product.name}</span>
      </nav>

      {/* Product Detail */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image */}
          <div className="relative h-80 lg:h-full min-h-80 bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute top-4 left-4">
              <span className="bg-orange-100 text-orange-700 text-sm font-semibold px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            {product.inStock && (
              <div className="absolute top-4 right-4">
                <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                  ✓ In Stock
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="text-3xl font-bold text-orange-600 mb-5">
              {product.priceDisplay}
            </div>

            <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/250784734956?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors text-center flex items-center justify-center gap-2 text-lg shadow-md"
              >
                <span>💬</span> Order on WhatsApp
              </a>
              <a
                href="tel:+250784734956"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-2xl transition-colors text-center flex items-center justify-center gap-2 text-lg shadow-md"
              >
                <span>📞</span> Call to Order
              </a>
            </div>

            <div className="mt-6 p-4 bg-orange-50 rounded-2xl">
              <p className="text-orange-800 text-sm font-medium flex items-center gap-2">
                <span>🚚</span> Fast delivery available in Kigali and surrounding areas
              </p>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              📱 <strong>Phone / WhatsApp:</strong> 0784 734 956
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-5">More in {product.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
