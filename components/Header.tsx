"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Menu,
  MessageCircle,
  PhoneCall,
  Search,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { categories } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

const MOBILE_NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/contact", label: "Contact" },
];

const HEADER_CATEGORIES = categories.filter((category) => category !== "All");

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopQ, setDesktopQ] = useState("");
  const [mobileQ, setMobileQ] = useState("");
  const { count } = useCart();
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
      <div className="jumia-promo-banner">
        <Link href="/products?sort=best-selling" className="jumia-promo-inner">
          <span className="jumia-promo-spark" aria-hidden="true" />
          <span className="jumia-promo-title">
            Pay <mark>WEEK</mark> Deals!
          </span>
          <span className="jumia-promo-live">BUY NOW</span>
          <span className="jumia-promo-call">
            <small>Call For Deals</small>
            0784 734 956
          </span>
        </Link>
      </div>

      <div className="jumia-service-strip">
        <Link href="/products?sort=best-selling" className="jumia-sell-link">
          <BadgeCheck size={13} fill="currentColor" />
          Shop Kigali Deals
        </Link>
        <span>KOS OFFICIAL</span>
        <span>SECURE PAY</span>
        <span>FAST DELIVERY</span>
      </div>

      <div className="jumia-main-nav">
        <Link href="/" className="jumia-logo" onClick={() => setMenuOpen(false)} aria-label="KOS - Save Time Buy online">
          <Image className="kos-logo-image" src="/kos-logo-full.svg" alt="KOS - Save Time Buy online" width={600} height={150} priority />
        </Link>

        <form className="jumia-search" onSubmit={(event) => { event.preventDefault(); doSearch(desktopQ); }}>
          <Search size={24} strokeWidth={2.5} />
          <input
            type="text"
            value={desktopQ}
            onChange={(event) => setDesktopQ(event.target.value)}
            placeholder="Search products, brands and categories"
            aria-label="Search Kigali Store"
          />
          <button type="submit">Search</button>
        </form>

        <div className="hidden md:flex jumia-actions">
          <Link href="/contact" aria-label="KOS Store contact">
            <Store size={24} />
            <span>KOS Store</span>
          </Link>
          <a href="tel:+250784734956" aria-label="Call Kigali Online Store">
            <PhoneCall size={24} />
            <span>Call Us</span>
          </a>
          <a href="https://wa.me/250784734956" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
            <MessageCircle size={24} />
            <span>WhatsApp</span>
          </a>
          <Link href="/cart" aria-label="Cart" className="jumia-cart-link">
            <ShoppingCart size={25} />
            <span>Cart</span>
            {count > 0 && <b>{count}</b>}
          </Link>
        </div>

        <motion.button
          className="md:hidden jumia-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
          whileTap={{ scale: 0.92 }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
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
            <Link href="/products?sort=best-selling" onClick={() => setMenuOpen(false)} className="mobile-nav-link">
              <Store size={16} />
              Shop Kigali Deals
            </Link>
            <Link href="/cart" onClick={() => setMenuOpen(false)} className="mobile-nav-link">
              <ShoppingCart size={16} />
              Cart {count > 0 ? `(${count})` : ""}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
