import Link from "next/link";
import {
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";

const companyLinks = ["About Kigali Online Store", "Contact us", "Delivery areas", "Customer support", "Quality guarantee"];
const serviceLinks = ["How to order", "Return and refund policy", "Delivery information", "Report suspicious activity", "Product availability"];
const helpLinks = ["Support centre", "Safe shopping", "WhatsApp ordering", "Payment options", "Privacy policy"];

const shopLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products?category=Kitchen", label: "Kitchen" },
  { href: "/products?category=Bathroom", label: "Bathroom" },
  { href: "/products?category=Fitness", label: "Fitness" },
  { href: "/products?category=Home", label: "Home & Living" },
  { href: "/products?category=Accessories", label: "Accessories" },
];

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M16.7 3c.4 2.6 1.9 4.2 4.3 4.4v3.5c-1.4.1-2.7-.3-4.2-1.1v5.8c0 3.8-2.3 6.4-5.9 6.4-3.1 0-5.5-2.2-5.5-5.2 0-3.4 2.7-5.6 6.3-5.3v3.6c-1.7-.3-2.7.5-2.7 1.6 0 1 .8 1.7 1.9 1.7 1.4 0 2.2-.8 2.2-2.7V3h3.6z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 3A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 16.5 5h-9zm4.5 2.8A4.2 4.2 0 1 1 12 16.2a4.2 4.2 0 0 1 0-8.4zm0 3A1.2 1.2 0 1 0 12 13.2a1.2 1.2 0 0 0 0-2.4zm4.6-3.7a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M14.2 8.3V6.8c0-.8.5-1 1.1-1h2V2.3C16.9 2.2 15.7 2 14.4 2c-2.8 0-4.7 1.7-4.7 4.8v1.5H6.6V12h3.1v9.9h3.8V12h3.1l.5-3.7h-3z" />
    </svg>
  );
}

const socials = [
  { href: "https://www.tiktok.com/@kigalionlinestore", label: "TikTok", Icon: TikTokIcon, platform: "tiktok" },
  { href: "https://www.instagram.com/kigali_online_store/", label: "Instagram", Icon: InstagramIcon, platform: "instagram" },
  { href: "https://web.facebook.com/kigalionlinestore/", label: "Facebook", Icon: FacebookIcon, platform: "facebook" },
];

function FooterList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="footer-column">
      <h4>{title}</h4>
      {items.map((item) => (
        <span key={item}>{item}</span>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell temu-footer-shell">
        <div className="footer-brand-panel">
          <h3>Kigali Online Store</h3>
          <p>
            Quality home, kitchen, fitness, office, clothing, and lifestyle products delivered
            across Kigali. Order quickly through WhatsApp and get clear confirmation before delivery.
          </p>
          <a href="https://wa.me/250784734956" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> Order on WhatsApp
          </a>
        </div>

        <FooterList title="Company info" items={companyLinks} />
        <FooterList title="Customer service" items={serviceLinks} />
        <FooterList title="Help" items={helpLinks} />

        <div className="footer-column">
          <h4>Shop categories</h4>
          {shopLinks.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </div>

        <div className="footer-action-panel">
          <div>
            <h4>Contact</h4>
            <a href="tel:+250784734956"><Phone size={15} /> 0784 734 956</a>
            <a href="https://wa.me/250784734956" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={15} /> WhatsApp Orders
            </a>
            <span><MapPin size={15} /> Kigali, Rwanda</span>
            <span><Truck size={15} /> Kigali & surroundings</span>
          </div>

          <div>
            <h4>Why shop with us</h4>
            <div className="footer-app-buttons">
              <span><Truck size={14} /> Fast delivery</span>
              <span><ShieldCheck size={14} /> Checked products</span>
            </div>
          </div>

          <div>
            <h4>Connect with us</h4>
            <div className="footer-socials">
              {socials.map(({ href, label, Icon, platform }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} data-platform={platform}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-payment-row">
        <div>
          <h4>Security and service</h4>
          <span>Secure ordering</span><span>Delivery confirmation</span><span>Quality checked</span>
        </div>
        <div>
          <h4>Payment options</h4>
          <span>MoMo</span><span>Cash</span><span>Bank transfer</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kigali Online Store. All rights reserved.</span>
        <span>Terms of use / Privacy policy / Customer support</span>
      </div>
    </footer>
  );
}
