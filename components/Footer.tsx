import Link from "next/link";
import {
  Camera,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Truck,
  UsersRound,
} from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
  { href: "/contact", label: "Contact Us" },
  { href: "/admin", label: "Admin Panel" },
];

const shopLinks = [
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

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-brand-panel">
          <Link href="/" className="footer-brand">
            <span className="brand-mark">
              <ShoppingBag size={18} color="#fff" strokeWidth={2.5} />
            </span>
            <span>Kigali <strong>Online</strong> Store</span>
          </Link>
          <p>
            Trusted online shopping in Kigali with practical home, kitchen, fitness, and lifestyle
            products delivered fast.
          </p>
          <div className="footer-socials">
            {socials.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon size={16} strokeWidth={2.4} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h4>Store</h4>
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h4>Shop</h4>
          {shopLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="footer-contact">
          <h4>Contact</h4>
          <a href="tel:+250784734956"><Phone size={15} /> 0784 734 956</a>
          <a href="https://wa.me/250784734956" target="_blank" rel="noopener noreferrer">
            <MessageCircle size={15} /> WhatsApp Orders
          </a>
          <span><MapPin size={15} /> Kigali, Rwanda</span>
          <span><Truck size={15} /> Kigali & surroundings</span>
          <span><ShieldCheck size={15} /> Quality checked products</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kigali Online Store. All rights reserved.</span>
        <span>Fast delivery / WhatsApp ordering / RWF prices</span>
      </div>
    </footer>
  );
}
