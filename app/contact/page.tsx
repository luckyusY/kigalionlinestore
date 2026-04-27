import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone, MapPin, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { FadeIn, StaggerGrid, StaggerItem } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Contact Us | Kigali Online Store",
  description: "Contact Kigali Online Store via WhatsApp or phone to place your order.",
};

const steps = [
  { n: "01", icon: "🛍️", title: "Browse Products", desc: "Find the product you want on our website" },
  { n: "02", icon: "👆", title: "Tap Order",        desc: "Click the green Order button on any product" },
  { n: "03", icon: "💬", title: "WhatsApp Opens",   desc: "A pre-filled message opens — just hit Send" },
  { n: "04", icon: "✅", title: "We Confirm",       desc: "We confirm availability, price and delivery time" },
  { n: "05", icon: "🚚", title: "Delivered!",       desc: "Your order arrives at your door in Kigali" },
];

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f0f1a 0%, #1e1540 100%)", color: "#fff", padding: "52px 24px" }}>
        <div style={{ maxWidth: 700 }}>
          <div className="section-label" style={{ display: "inline-flex", marginBottom: 14 }}>
            📞 Get in Touch
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 10, letterSpacing: "-0.02em" }}>
            Contact Us
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", lineHeight: 1.65 }}>
            We&apos;re here to help — reach out via WhatsApp or phone to place an order or ask a question.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "52px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }} className="contact-grid">

          {/* Contact cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FadeIn delay={0}>
              <a href="https://wa.me/250784734956?text=Hello!%20I'd%20like%20to%20order." target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", gap: 16, background: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: 20, padding: "22px 20px", textDecoration: "none", transition: "all 0.2s" }}
              >
                <div style={{ width: 52, height: 52, background: "#16a34a", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MessageCircle size={24} color="#fff" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: "#14532d", fontSize: 16, marginBottom: 3 }}>WhatsApp</div>
                  <div style={{ color: "#16a34a", fontSize: 22, fontWeight: 900 }}>0784 734 956</div>
                  <div style={{ color: "#4ade80", fontSize: 12, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                    Tap to open WhatsApp now <ArrowRight size={12} strokeWidth={2.5} />
                  </div>
                </div>
              </a>
            </FadeIn>

            <FadeIn delay={0.08}>
              <a href="tel:+250784734956"
                style={{ display: "flex", gap: 16, background: "#fff7ed", border: "2px solid #fed7aa", borderRadius: 20, padding: "22px 20px", textDecoration: "none" }}
              >
                <div style={{ width: 52, height: 52, background: "#f97316", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Phone size={24} color="#fff" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: "#7c2d12", fontSize: 16, marginBottom: 3 }}>Call Us</div>
                  <div style={{ color: "#ea580c", fontSize: 22, fontWeight: 900 }}>0784 734 956</div>
                  <div style={{ color: "#fb923c", fontSize: 12, marginTop: 4 }}>Available during business hours</div>
                </div>
              </a>
            </FadeIn>

            <FadeIn delay={0.14}>
              <div style={{ display: "flex", gap: 16, background: "#eff6ff", border: "2px solid #bfdbfe", borderRadius: 20, padding: "22px 20px" }}>
                <div style={{ width: 52, height: 52, background: "#2563eb", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MapPin size={24} color="#fff" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: "#1e3a8a", fontSize: 16, marginBottom: 3 }}>Location</div>
                  <div style={{ color: "#1d4ed8", fontSize: 16, fontWeight: 700 }}>Kigali, Rwanda 🇷🇼</div>
                  <div style={{ color: "#60a5fa", fontSize: 12, marginTop: 4 }}>Delivery across Kigali &amp; surroundings</div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div style={{ display: "flex", gap: 16, background: "#faf5ff", border: "2px solid #e9d5ff", borderRadius: 20, padding: "22px 20px" }}>
                <div style={{ width: 52, height: 52, background: "#7c3aed", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Clock size={24} color="#fff" strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: "#4c1d95", fontSize: 16, marginBottom: 6 }}>Business Hours</div>
                  <div style={{ fontSize: 13, color: "#6d28d9", lineHeight: 1.7 }}>
                    <div>Mon – Sat: <strong>8:00 AM – 8:00 PM</strong></div>
                    <div>Sunday: <strong>9:00 AM – 6:00 PM</strong></div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* How to order */}
          <FadeIn delay={0.1}>
            <div style={{ background: "#fff", borderRadius: 24, padding: "30px 26px", border: "1px solid #f1f5f9", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: "#111827", marginBottom: 24 }}>
                How to Order — 5 Steps
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {steps.map((s, i) => (
                  <div key={s.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 38, height: 38, background: i === steps.length - 1 ? "#16a34a" : "#fff7ed", border: `2px solid ${i === steps.length - 1 ? "#16a34a" : "#fed7aa"}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 900, color: i === steps.length - 1 ? "#fff" : "#ea580c" }}>
                      {i === steps.length - 1 ? <CheckCircle size={18} color="#fff" strokeWidth={2.5} /> : s.n}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 15 }}>{s.icon}</span>
                        <span style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>{s.title}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#6b7280", marginTop: 2, lineHeight: 1.5 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="https://wa.me/250784734956?text=Hello!%20I'd%20like%20to%20order." target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", background: "#16a34a", color: "#fff", fontWeight: 800, padding: "14px", borderRadius: 14, textDecoration: "none", fontSize: 15, marginTop: 24 }}
              >
                <MessageCircle size={18} strokeWidth={2.5} /> Start WhatsApp Order
              </a>
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <Link href="/products" style={{ color: "#f97316", fontWeight: 700, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  Browse products first <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
