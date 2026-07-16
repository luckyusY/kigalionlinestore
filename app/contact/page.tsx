import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { FadeIn } from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Contact Us | Kigali Online Store",
  description: "Contact Kigali Online Store via WhatsApp, phone, or map directions to place your order in Kigali.",
};

const steps = [
  { n: "01", title: "Browse Products", desc: "Find the item you want on the website." },
  { n: "02", title: "Tap Order", desc: "Use WhatsApp, call, or add the product to your cart." },
  { n: "03", title: "We Confirm", desc: "We confirm availability, price, and delivery details." },
  { n: "04", title: "Delivery", desc: "Your order is delivered in Kigali and nearby areas." },
];

const mapUrl = "https://www.google.com/maps?q=Kigali%20Online%20Store%20Rwanda&output=embed";

export default function ContactPage() {
  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div>
          <div className="section-label">Contact</div>
          <h1>Kigali Online Store</h1>
          <p>
            Need help choosing a product, checking availability, or arranging delivery?
            Reach us directly and we will confirm everything before your order is delivered.
          </p>
        </div>
        <div className="contact-hero-actions">
          <a href="https://wa.me/250784734956?text=Hello!%20I'd%20like%20to%20order." target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} /> WhatsApp Order
          </a>
          <a href="tel:+250784734956">
            <Phone size={18} /> Call Now
          </a>
        </div>
      </section>

      <main className="contact-shell">
        <section className="contact-layout">
          <div className="contact-info-stack">
            <FadeIn>
              <a className="contact-card whatsapp" href="https://wa.me/250784734956?text=Hello!%20I'd%20like%20to%20order." target="_blank" rel="noopener noreferrer">
                <span><MessageCircle size={24} /></span>
                <div>
                  <strong>WhatsApp</strong>
                  <b>0784 734 956</b>
                  <small>Fastest way to order or ask a question</small>
                </div>
              </a>
            </FadeIn>

            <FadeIn delay={0.06}>
              <a className="contact-card call" href="tel:+250784734956">
                <span><Phone size={24} /></span>
                <div>
                  <strong>Call Us</strong>
                  <b>0784 734 956</b>
                  <small>Available during business hours</small>
                </div>
              </a>
            </FadeIn>

            <FadeIn delay={0.12}>
              <div className="contact-card location">
                <span><MapPin size={24} /></span>
                <div>
                  <strong>Location</strong>
                  <b>Kigali, Rwanda</b>
                  <small>Delivery across Kigali and surroundings</small>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.18}>
              <div className="contact-card hours">
                <span><Clock size={24} /></span>
                <div>
                  <strong>Business Hours</strong>
                  <b>Mon-Sat: 8:00 AM - 8:00 PM</b>
                  <small>Sunday: 9:00 AM - 6:00 PM</small>
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.08}>
            <section className="contact-map-panel">
              <div className="contact-map-heading">
                <div>
                  <div className="section-label">Map</div>
                  <h2>Find us in Kigali</h2>
                  <p>Use the map for directions, or contact us first so we can guide you.</p>
                </div>
                <a href="https://www.google.com/maps/search/?api=1&query=Kigali%20Online%20Store%20Rwanda" target="_blank" rel="noopener noreferrer">
                  Open Map <ArrowRight size={14} />
                </a>
              </div>
              <div className="contact-map-frame">
                <iframe
                  title="Kigali Online Store on Google Maps"
                  src={mapUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </FadeIn>
        </section>

        <section className="contact-order-section">
          <FadeIn>
            <div className="contact-order-heading">
              <div>
                <div className="section-label">How To Order</div>
                <h2>Simple ordering in four steps</h2>
              </div>
              <Link href="/products">
                Browse Products <ArrowRight size={15} />
              </Link>
            </div>
          </FadeIn>

          <div className="contact-step-grid">
            {steps.map((step, index) => (
              <FadeIn key={step.n} delay={index * 0.05}>
                <article className="contact-step-card">
                  <span>{index === steps.length - 1 ? <CheckCircle size={18} /> : step.n}</span>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </section>

        <section className="contact-trust-strip">
          <div><ShoppingBag size={17} /> Quality products</div>
          <div><Truck size={17} /> Kigali delivery</div>
          <div><MessageCircle size={17} /> WhatsApp confirmation</div>
        </section>
      </main>
    </div>
  );
}
