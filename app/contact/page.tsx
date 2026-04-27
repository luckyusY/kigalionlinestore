import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | Kigali Online Store",
  description: "Contact Kigali Online Store via WhatsApp or phone to place your order.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Contact Us</h1>
          <p className="text-orange-100">We're here to help! Reach out to place an order or ask questions.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Cards */}
          <div className="space-y-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/250784734956?text=Hello%21%20I%27d%20like%20to%20order%20from%20Kigali%20Online%20Store."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 bg-green-50 border-2 border-green-200 hover:border-green-400 p-6 rounded-2xl transition-all group"
            >
              <div className="text-4xl">💬</div>
              <div>
                <h2 className="text-lg font-bold text-green-800 group-hover:text-green-900">WhatsApp</h2>
                <p className="text-green-700 text-sm mb-1">Fastest way to order! Click to open WhatsApp</p>
                <div className="text-green-600 font-bold text-xl">0784 734 956</div>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:+250784734956"
              className="flex items-start gap-4 bg-orange-50 border-2 border-orange-200 hover:border-orange-400 p-6 rounded-2xl transition-all group"
            >
              <div className="text-4xl">📞</div>
              <div>
                <h2 className="text-lg font-bold text-orange-800 group-hover:text-orange-900">Phone Call</h2>
                <p className="text-orange-700 text-sm mb-1">Give us a call anytime</p>
                <div className="text-orange-600 font-bold text-xl">0784 734 956</div>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-start gap-4 bg-blue-50 border-2 border-blue-200 p-6 rounded-2xl">
              <div className="text-4xl">📍</div>
              <div>
                <h2 className="text-lg font-bold text-blue-800">Location</h2>
                <p className="text-blue-700 text-sm mb-1">We deliver across Kigali</p>
                <div className="text-blue-600 font-semibold">Kigali, Rwanda 🇷🇼</div>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4 bg-purple-50 border-2 border-purple-200 p-6 rounded-2xl">
              <div className="text-4xl">🕐</div>
              <div>
                <h2 className="text-lg font-bold text-purple-800">Business Hours</h2>
                <div className="text-purple-700 text-sm space-y-1 mt-1">
                  <p>Monday – Saturday: 8:00 AM – 8:00 PM</p>
                  <p>Sunday: 9:00 AM – 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Order */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5">How to Order</h2>
            <div className="space-y-5">
              {[
                {
                  step: "1",
                  title: "Browse Products",
                  desc: "Find the product you want on our website",
                  icon: "🛍️",
                },
                {
                  step: "2",
                  title: "Click Order Button",
                  desc: "Tap the green WhatsApp button on any product",
                  icon: "👆",
                },
                {
                  step: "3",
                  title: "Send Message",
                  desc: "A pre-filled message opens in WhatsApp — just send it!",
                  icon: "💬",
                },
                {
                  step: "4",
                  title: "Confirm & Pay",
                  desc: "We'll confirm availability, price, and delivery details",
                  icon: "✅",
                },
                {
                  step: "5",
                  title: "Receive Delivery",
                  desc: "Your order is delivered to your door in Kigali",
                  icon: "🚚",
                },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <div className="bg-orange-100 text-orange-600 font-bold w-9 h-9 rounded-full flex items-center justify-center text-sm shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="https://wa.me/250784734956?text=Hello%21%20I%27d%20like%20to%20order%20from%20Kigali%20Online%20Store."
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-2xl text-center transition-colors text-lg"
              >
                💬 Start WhatsApp Order
              </a>
              <div className="text-center mt-3">
                <Link href="/products" className="text-orange-600 hover:text-orange-700 text-sm font-medium">
                  Browse all products →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
