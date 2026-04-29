import Link from "next/link";
import {
  Camera,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  ShieldCheck,
  Truck,
  UsersRound,
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

const socials = [
  { href: "https://www.tiktok.com/@kigalionlinestore", label: "TikTok", Icon: Music2 },
  { href: "https://www.instagram.com/kigali_online_store/", label: "Instagram", Icon: Camera },
  { href: "https://web.facebook.com/kigalionlinestore/", label: "Facebook", Icon: UsersRound },
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
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon size={16} strokeWidth={2.4} />
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
