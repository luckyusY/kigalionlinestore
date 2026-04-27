import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const whatsappMessage = encodeURIComponent(
    `Hello! I'm interested in ordering: ${product.name} (${product.priceDisplay})`
  );

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      {/* Image */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-52 w-full overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
          {product.inStock && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                In Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-gray-800 text-sm leading-tight hover:text-orange-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-xs line-clamp-2 mb-3">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-orange-600 font-bold text-base">{product.priceDisplay}</span>
          <a
            href={`https://wa.me/250784734956?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>💬</span> Order
          </a>
        </div>
      </div>
    </div>
  );
}
