import Link from "next/link";
import {
  Camera,
  Download,
  MapPin,
  MessageCircle,
  Music2,
  Phone,
  ShieldCheck,
  Truck,
  UsersRound,
} from "lucide-react";

const companyLinks = ["About Temu Style Store", "Affiliate Program", "Contact us", "Careers", "Corporate Responsibility"];
const serviceLinks = ["Return and refund policy", "Intellectual property policy", "Shipping info", "Report suspicious activity", "Minimum order value"];
const helpLinks = ["Support centre & FAQ", "Safety centre", "Delivery protection", "Site map", "Purchase protection"];

const shopLinks = [
  { href: "/products?category=Kitchen", label: "Home & Kitchen" },
  { href: "/products?category=Bathroom", label: "Beauty & Health" },
  { href: "/products?category=Fitness", label: "Sports & Outdoors" },
  { href: "/products?category=Clothing", label: "Clothing" },
  { href: "/admin", label: "Admin Panel" },
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
        <FooterList title="Company info" items={companyLinks} />
        <FooterList title="Customer service" items={serviceLinks} />
        <FooterList title="Help" items={helpLinks} />

        <div className="footer-column">
          <h4>Shop Kigali Store</h4>
          {shopLinks.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </div>

        <div className="footer-action-panel">
          <Link href="/admin" className="footer-seller-card">
            <span>Start Selling to Kigali Buyers</span>
            <strong>Start a Selling Account</strong>
          </Link>

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
            <h4>Download the Store App</h4>
            <div className="footer-app-buttons">
              <span><Download size={14} /> Price drop alerts</span>
              <span><ShieldCheck size={14} /> Secure checkout</span>
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
          <h4>Security certification</h4>
          <span>SSL</span><span>Verified</span><span>SafePay</span><span>Delivery guarantee</span>
        </div>
        <div>
          <h4>We accept</h4>
          <span>MoMo</span><span>Visa</span><span>Mastercard</span><span>Cash</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Kigali Online Store. All rights reserved.</span>
        <span>Terms of use / Privacy policy / Your privacy choices</span>
      </div>
    </footer>
  );
}
