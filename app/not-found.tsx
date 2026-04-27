import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">😕</div>
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-full transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/products"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-full transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
