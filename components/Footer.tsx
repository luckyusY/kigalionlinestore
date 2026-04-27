import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold mb-3">🛒 Kigali Online Store</h3>
            <p className="text-sm leading-relaxed">
              Your trusted online shop in Kigali, Rwanda. Quality products at great prices, delivered to your door.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://wa.me/250784734956"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">All Products</Link>
              </li>
              <li>
                <Link href="/products?category=Kitchen" className="hover:text-white transition-colors">Kitchen</Link>
              </li>
              <li>
                <Link href="/products?category=Bathroom" className="hover:text-white transition-colors">Bathroom</Link>
              </li>
              <li>
                <Link href="/products?category=Fitness" className="hover:text-white transition-colors">Fitness</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-lg font-bold mb-3">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span>📱</span>
                <div>
                  <div className="text-white font-medium">Phone / WhatsApp</div>
                  <a href="tel:+250784734956" className="hover:text-white transition-colors">
                    0784 734 956
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <div>
                  <div className="text-white font-medium">Location</div>
                  <span>Kigali, Rwanda</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span>🚚</span>
                <div>
                  <div className="text-white font-medium">Delivery</div>
                  <span>Kigali & surrounding areas</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Kigali Online Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
