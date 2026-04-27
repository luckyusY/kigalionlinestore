"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Phone, ShoppingBag, Home, Grid3X3, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { href: "/",         label: "Home",     Icon: Home },
  { href: "/products", label: "Products", Icon: Grid3X3 },
  { href: "/contact",  label: "Contact",  Icon: Phone },
];

const QUICK_CATS = ["Kitchen", "Bathroom", "Fitness", "Home", "Office"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopQ, setDesktopQ] = useState("");
  const [mobileQ,  setMobileQ]  = useState("");
  const router = useRouter();

  const doSearch = useCallback((q: string) => {
    const t = q.trim();
    if (t) { router.push(`/products?search=${encodeURIComponent(t)}`); setMenuOpen(false); }
  }, [router]);

  return (
    <header className="site-header">
      {/* ── Top bar ── */}
      <div className="header-top">
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
          <motion.div
            whileHover={{ rotate: -8, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #f97316, #fbbf24)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <ShoppingBag size={18} color="#fff" strokeWidth={2.5} />
          </motion.div>
          <div style={{ lineHeight: 1 }}>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 15, letterSpacing: "-0.03em" }}>
              Kigali <span style={{ color: "#f97316" }}>Online</span>
            </div>
            <div style={{ color: "rgba(255,255,255,0.38)", fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Store · Kigali, Rwanda
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex" style={{ alignItems: "center", gap: 2 }}>
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href} className="nav-link">
              <Icon size={14} strokeWidth={2.5} />
              {label}
            </Link>
          ))}
          <motion.a
            href="https://wa.me/250784734956"
            target="_blank"
            rel="noopener noreferrer"
            className="wa-badge"
            style={{ marginLeft: 10 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle size={14} strokeWidth={2.5} />
            WhatsApp
          </motion.a>
        </nav>

        {/* Mobile toggle */}
        <motion.button
          className="md:hidden"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
          whileTap={{ scale: 0.9 }}
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1.5px solid rgba(255,255,255,0.12)",
            borderRadius: 10, padding: "7px 10px",
            color: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
          }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      {/* ── Search bar (desktop) ── */}
      <div className="header-search-bar hidden md:flex">
        <div className="header-search-inner">
          {/* Quick category pills */}
          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
            {QUICK_CATS.map(cat => (
              <Link key={cat} href={`/products?category=${cat}`} className="hs-pill">
                {cat}
              </Link>
            ))}
          </div>
          <div className="hs-divider" />

          {/* Search input */}
          <form
            className="hs-form"
            onSubmit={e => { e.preventDefault(); doSearch(desktopQ); }}
          >
            <div className="hs-input-wrap">
              <span className="hs-input-icon"><Search size={13} strokeWidth={2.5} /></span>
              <input
                className="hs-input"
                type="text"
                placeholder="Search for blender, rain coat, air fryer, fitness…"
                value={desktopQ}
                onChange={e => setDesktopQ(e.target.value)}
                aria-label="Search"
              />
              <button type="submit" className="hs-btn">
                <Search size={12} strokeWidth={3} /> Search
              </button>
            </div>
          </form>

          <div className="hs-divider" />
          <a href="tel:+250784734956" className="hs-phone">
            <Phone size={12} strokeWidth={2.5} />
            0784 734 956
          </a>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
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
            {/* Mobile search */}
            <form onSubmit={e => { e.preventDefault(); doSearch(mobileQ); }}>
              <div className="mobile-search-wrap">
                <input
                  className="mobile-search-input"
                  type="text"
                  placeholder="Search products…"
                  value={mobileQ}
                  onChange={e => setMobileQ(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="mobile-search-btn">
                  <Search size={16} color="#fff" />
                </button>
              </div>
            </form>

            {/* Nav */}
            {NAV.map(({ href, label, Icon }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="mobile-nav-link">
                <Icon size={16} strokeWidth={2.5} />
                {label}
              </Link>
            ))}

            <motion.a
              href="https://wa.me/250784734956"
              target="_blank"
              rel="noopener noreferrer"
              className="wa-badge"
              style={{ display: "flex", justifyContent: "center", marginTop: 14, padding: "13px 0" }}
              whileTap={{ scale: 0.97 }}
            >
              <MessageCircle size={16} strokeWidth={2.5} />
              WhatsApp Order · 0784 734 956
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
