"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Bell,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Globe2,
  Headphones,
  Menu,
  MessageCircle,
  PackageCheck,
  Search,
  ShieldCheck,
  Star,
  ThumbsUp,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "@/lib/products";

const NAV = [
  { href: "/products?sort=best-selling", label: "Best-Selling Items", Icon: ThumbsUp },
  { href: "/products?rating=5", label: "5-Star Rated", Icon: Star },
  { href: "/products?sort=new", label: "New In", Icon: BadgeCheck },
  { href: "/products", label: "Categories", Icon: ChevronDown },
];

const MOBILE_NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Admin" },
];

const HEADER_CATEGORIES = categories.filter((category) => category !== "All");

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopQ, setDesktopQ] = useState("");
  const [mobileQ, setMobileQ] = useState("");
  const router = useRouter();

  const doSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
      setMenuOpen(false);
    },
    [router]
  );

  return (
    <header className="site-header">
      <div className="temu-top-strip">
        <Link href="/products" className="temu-top-item">
          <Truck size={22} fill="#79ff87" />
          <span><strong>Easy ordering</strong><small>Via WhatsApp</small></span>
          <ChevronRight size={15} />
        </Link>
        <Link href="/contact" className="temu-top-item">
          <BadgeCheck size={24} />
          <span><strong>Price adjustment</strong><small>Within 30 days</small></span>
        </Link>
        <Link href="/products" className="temu-top-item">
          <Bell size={21} fill="#ffe96b" />
          <span><strong>Get the Kigali Store App</strong><small>Order faster on WhatsApp</small></span>
        </Link>
        <Link href="/admin" className="temu-seller-card">
          <span>Start Selling to Kigali Buyers</span>
          <strong>Join Now</strong>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="temu-blue-nav">
        <Link href="/" className="temu-logo" onClick={() => setMenuOpen(false)} aria-label="Kigali Online Store">
          <span>KIGALI</span>
          <strong>STORE</strong>
        </Link>

        <nav className="hidden lg:flex temu-main-links">
          {NAV.map(({ href, label, Icon }) => (
            label === "Categories" ? (
              <div key={label} className="temu-category-menu">
                <Link href={href}>
                  <Icon size={14} />
                  {label}
                </Link>
                <div className="temu-category-panel">
                  {HEADER_CATEGORIES.map((category) => (
                    <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link key={label} href={href}>
                <Icon size={14} fill="currentColor" />
                {label}
              </Link>
            )
          ))}
        </nav>

        <form className="temu-search" onSubmit={(event) => { event.preventDefault(); doSearch(desktopQ); }}>
          <input
            type="text"
            value={desktopQ}
            onChange={(event) => setDesktopQ(event.target.value)}
            placeholder="Search Kigali Store"
            aria-label="Search Kigali Store"
          />
          <button type="submit" aria-label="Search">
            <Search size={24} strokeWidth={2.8} />
          </button>
        </form>

        <div className="hidden md:flex temu-actions">
          <Link href="/contact">
            <UserRound size={24} />
            <span>Orders &<br />Account</span>
          </Link>
          <a href="https://wa.me/250784734956" target="_blank" rel="noopener noreferrer">
            <Headphones size={23} />
            <span>Support</span>
          </a>
          <Link href="/contact">
            <Globe2 size={24} />
            <span>English</span>
          </Link>
        </div>

        <motion.button
          className="md:hidden temu-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
          whileTap={{ scale: 0.92 }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      <div className="temu-trust-wrap">
        <div className="temu-trust-primary">
          <span><ShieldCheck size={18} fill="currentColor" /> Why choose Kigali Store?</span>
          <span><ShieldCheck size={18} /> Secure privacy</span>
          <span><CreditCard size={18} /> Safe payments</span>
          <span><PackageCheck size={18} /> Delivery support</span>
          <ChevronRight size={20} />
        </div>
        <div className="temu-trust-alert">
          <span><Bell size={17} fill="currentColor" /> Be wary of messages about delivery issues claiming to be from fake couriers.</span>
          <Link href="/contact">View <ChevronRight size={18} /></Link>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer"
            className="temu-mobile-drawer md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            <form onSubmit={(event) => { event.preventDefault(); doSearch(mobileQ); }}>
              <div className="mobile-search-wrap">
                <input
                  className="mobile-search-input"
                  type="text"
                  placeholder="Search Kigali Store"
                  value={mobileQ}
                  onChange={(event) => setMobileQ(event.target.value)}
                  autoFocus
                />
                <button type="submit" className="mobile-search-btn">
                  <Search size={18} color="#fff" />
                </button>
              </div>
            </form>

            {MOBILE_NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="mobile-nav-link">
                {item.label}
              </Link>
            ))}
            {HEADER_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                onClick={() => setMenuOpen(false)}
                className="mobile-nav-link"
              >
                {category}
              </Link>
            ))}

            <a
              href="https://wa.me/250784734956"
              target="_blank"
              rel="noopener noreferrer"
              className="wa-badge"
              style={{ display: "flex", justifyContent: "center", marginTop: 14, padding: "13px 0" }}
            >
              <MessageCircle size={16} strokeWidth={2.5} />
              WhatsApp Order / 0784 734 956
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
