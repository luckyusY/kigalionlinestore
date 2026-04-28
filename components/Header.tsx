"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Grid3X3,
  Home,
  Menu,
  MessageCircle,
  Music2,
  Phone,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  UsersRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NAV = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/products", label: "Products", Icon: Grid3X3 },
  { href: "/contact", label: "Contact", Icon: Phone },
  { href: "/admin", label: "Admin", Icon: ShieldCheck },
];

const QUICK_CATS = ["Kitchen", "Bathroom", "Fitness", "Home", "Office"];

const SOCIALS = [
  { href: "https://www.tiktok.com/@kigalionlinestore", label: "TikTok", Icon: Music2 },
  { href: "https://www.instagram.com/kigali_online_store/", label: "Instagram", Icon: Camera },
  { href: "https://web.facebook.com/kigalionlinestore/", label: "Facebook", Icon: UsersRound },
];

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
      <div className="header-promo">
        <span><Truck size={13} /> Fast Kigali delivery</span>
        <span><Sparkles size={13} /> Quality products in RWF</span>
        <a href="tel:+250784734956"><Phone size={13} /> 0784 734 956</a>
      </div>

      <div className="header-top">
        <Link href="/" className="brand-lockup" onClick={() => setMenuOpen(false)}>
          <motion.span
            className="brand-mark"
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ShoppingBag size={19} color="#fff" strokeWidth={2.5} />
          </motion.span>
          <span className="brand-copy">
            <strong>Kigali <span>Online</span> Store</strong>
            <small>Kigali, Rwanda</small>
          </span>
        </Link>

        <nav className="hidden md:flex header-nav">
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="nav-link">
              <Icon size={14} strokeWidth={2.5} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex header-actions">
          <div className="header-socials">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon size={15} strokeWidth={2.4} />
              </a>
            ))}
          </div>
          <motion.a
            href="https://wa.me/250784734956"
            target="_blank"
            rel="noopener noreferrer"
            className="wa-badge"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle size={14} strokeWidth={2.5} />
            WhatsApp
          </motion.a>
        </div>

        <motion.button
          className="md:hidden mobile-menu-button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Menu"
          whileTap={{ scale: 0.9 }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      <div className="header-search-bar hidden md:flex">
        <div className="header-search-inner">
          <div className="quick-cats">
            {QUICK_CATS.map((cat) => (
              <Link key={cat} href={`/products?category=${cat}`} className="hs-pill">
                {cat}
              </Link>
            ))}
          </div>

          <form className="hs-form" onSubmit={(event) => { event.preventDefault(); doSearch(desktopQ); }}>
            <div className="hs-input-wrap">
              <span className="hs-input-icon"><Search size={14} strokeWidth={2.5} /></span>
              <input
                className="hs-input"
                type="text"
                placeholder="Search blender, rain coat, air fryer, fitness..."
                value={desktopQ}
                onChange={(event) => setDesktopQ(event.target.value)}
                aria-label="Search products"
              />
              <button type="submit" className="hs-btn">
                <Search size={13} strokeWidth={3} /> Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer"
            className="mobile-drawer md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <form onSubmit={(event) => { event.preventDefault(); doSearch(mobileQ); }}>
              <div className="mobile-search-wrap">
                <input
                  className="mobile-search-input"
                  type="text"
                  placeholder="Search products..."
                  value={mobileQ}
                  onChange={(event) => setMobileQ(event.target.value)}
                  autoFocus
                />
                <button type="submit" className="mobile-search-btn">
                  <Search size={16} color="#fff" />
                </button>
              </div>
            </form>

            {NAV.map(({ href, label, Icon }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="mobile-nav-link">
                <Icon size={16} strokeWidth={2.5} />
                {label}
              </Link>
            ))}

            <div className="mobile-socials">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                  <Icon size={17} strokeWidth={2.4} />
                  {label}
                </a>
              ))}
            </div>

            <motion.a
              href="https://wa.me/250784734956"
              target="_blank"
              rel="noopener noreferrer"
              className="wa-badge"
              style={{ display: "flex", justifyContent: "center", marginTop: 14, padding: "13px 0" }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={16} strokeWidth={2.5} />
              WhatsApp Order / 0784 734 956
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
