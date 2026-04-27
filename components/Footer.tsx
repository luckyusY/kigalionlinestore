import Link from "next/link";
import { Phone, MapPin, Truck, Clock, MessageCircle, ShoppingBag } from "lucide-react";

const quickLinks = [
  { href: "/",                             label: "Home" },
  { href: "/products",                     label: "All Products" },
  { href: "/products?category=Kitchen",    label: "Kitchen" },
  { href: "/products?category=Bathroom",   label: "Bathroom" },
  { href: "/products?category=Fitness",    label: "Fitness" },
  { href: "/products?category=Home",       label: "Home & Living" },
  { href: "/contact",                      label: "Contact Us" },
];

const contactItems = [
  { Icon: Phone,    label: "Phone / WhatsApp", value: "0784 734 956",              href: "tel:+250784734956" },
  { Icon: MapPin,   label: "Location",         value: "Kigali, Rwanda 🇷🇼",        href: null },
  { Icon: Truck,    label: "Delivery",         value: "Kigali & surroundings",     href: null },
  { Icon: Clock,    label: "Hours",            value: "Mon–Sat 8am–8pm",           href: null },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0a0a14", color: "#64748b" }}>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "44px 20px 32px" }}>

        {/* Brand row — always full width */}
        <div style={{ marginBottom: 36, paddingBottom: 28, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#f97316,#fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ShoppingBag size={17} color="#fff" strokeWidth={2.5} />
            </div>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 16, letterSpacing: "-0.02em" }}>
              Kigali <span style={{ color: "#f97316" }}>Online</span> Store
            </span>
          </Link>
          <p style={{ fontSize: 13, lineHeight: 1.65, maxWidth: 340, marginBottom: 16 }}>
            Your trusted online shop in Kigali, Rwanda. Quality products at great prices — delivered fast.
          </p>
          <a
            href="https://wa.me/250784734956"
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 13, padding: "9px 18px", borderRadius: 999, textDecoration: "none" }}
          >
            <MessageCircle size={14} strokeWidth={2.5} /> WhatsApp Us
          </a>
        </div>

        {/* 2-col grid: links + contact */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 32px" }}>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ color: "#64748b", textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "color 0.15s", display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ color: "#334155", fontSize: 9 }}>›</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14 }}>
              Contact
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {contactItems.map(({ Icon, label, value, href }) => {
                const inner = (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                    <div style={{ marginTop: 1, flexShrink: 0 }}>
                      <Icon size={13} color="#f97316" strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 1 }}>
                        {label}
                      </div>
                      <div style={{ color: "#cbd5e1", fontSize: 13, fontWeight: 500 }}>
                        {value}
                      </div>
                    </div>
                  </div>
                );
                return href
                  ? <a key={label} href={href} style={{ textDecoration: "none" }}>{inner}</a>
                  : <div key={label}>{inner}</div>;
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "12px 20px", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: "#334155" }}>
          © {new Date().getFullYear()} Kigali Online Store · All rights reserved
        </p>
      </div>
    </footer>
  );
}
