import Link from "next/link";
import { Phone, MapPin, Truck, Clock, MessageCircle, ShoppingBag, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { href: "/",                      label: "Home" },
  { href: "/products",              label: "All Products" },
  { href: "/products?category=Kitchen",   label: "Kitchen" },
  { href: "/products?category=Bathroom",  label: "Bathroom" },
  { href: "/products?category=Fitness",   label: "Fitness" },
  { href: "/products?category=Home",      label: "Home & Living" },
  { href: "/contact",               label: "Contact Us" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0a0a14", color: "#94a3b8" }}>
      {/* Main grid */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "52px 24px 40px" }}>
        <div className="footer-grid">

          {/* Brand col — full-width on mobile */}
          <div className="footer-brand">
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: "linear-gradient(135deg, #f97316, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ShoppingBag size={18} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 16, letterSpacing: "-0.02em" }}>
                  Kigali <span style={{ color: "#f97316" }}>Online</span> Store
                </div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase" }}>
                  Kigali, Rwanda 🇷🇼
                </div>
              </div>
            </Link>

            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
              Your trusted online shop in Kigali. Quality products at great prices — delivered fast.
            </p>

            <a
              href="https://wa.me/250784734956"
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 13, padding: "9px 18px", borderRadius: 999, textDecoration: "none" }}
            >
              <MessageCircle size={14} strokeWidth={2.5} /> WhatsApp Us
            </a>
          </div>

          {/* Quick links */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ display: "flex", alignItems: "center", gap: 5, color: "#94a3b8", textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "color 0.15s" }}
                    onMouseEnter={undefined}
                  >
                    <ArrowUpRight size={12} strokeWidth={2} style={{ opacity: 0.4 }} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>
              Contact
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 13 }}>
              <li>
                <a href="tel:+250784734956" style={{ display: "flex", gap: 10, textDecoration: "none", color: "#94a3b8", alignItems: "flex-start" }}>
                  <div style={{ width: 30, height: 30, background: "rgba(255,255,255,0.06)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Phone size={13} color="#f97316" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700, marginBottom: 1 }}>Phone / WhatsApp</div>
                    <div style={{ fontSize: 13 }}>0784 734 956</div>
                  </div>
                </a>
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, background: "rgba(255,255,255,0.06)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={13} color="#f97316" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700, marginBottom: 1 }}>Location</div>
                  <div style={{ fontSize: 13 }}>Kigali, Rwanda 🇷🇼</div>
                </div>
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, background: "rgba(255,255,255,0.06)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Truck size={13} color="#f97316" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700, marginBottom: 1 }}>Delivery</div>
                  <div style={{ fontSize: 13 }}>Kigali &amp; surrounding areas</div>
                </div>
              </li>
              <li style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, background: "rgba(255,255,255,0.06)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={13} color="#f97316" strokeWidth={2.5} />
                </div>
                <div>
                  <div style={{ color: "#cbd5e1", fontSize: 12, fontWeight: 700, marginBottom: 1 }}>Hours</div>
                  <div style={{ fontSize: 13 }}>Mon–Sat: 8am – 8pm</div>
                  <div style={{ fontSize: 13 }}>Sun: 9am – 6pm</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 24px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 12, color: "#475569" }}>
            © {new Date().getFullYear()} Kigali Online Store · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
