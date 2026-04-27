"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");
  const router = useRouter();

  const doSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      if (trimmed) {
        router.push(`/products?search=${encodeURIComponent(trimmed)}`);
        setMenuOpen(false);
      }
    },
    [router]
  );

  return (
    <header className="site-header">
      {/* ── Top bar ── */}
      <div className="header-top">
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 900,
            fontSize: 17,
            color: "#fff",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #f97316, #fbbf24)",
              borderRadius: 10,
              width: 34,
              height: 34,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            🛒
          </span>
          <span>
            Kigali{" "}
            <span style={{ color: "#f97316" }}>Online</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex"
          style={{ alignItems: "center", gap: 6 }}
        >
          {[
            { href: "/", label: "Home" },
            { href: "/products", label: "Products" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                color: "rgba(255,255,255,0.82)",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
                padding: "7px 14px",
                borderRadius: 8,
                transition: "background 0.15s, color 0.15s",
              }}
              className="nav-link"
            >
              {label}
            </Link>
          ))}
          <a
            href="https://wa.me/250784734956"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginLeft: 8,
              background: "#22c55e",
              color: "#fff",
              padding: "8px 18px",
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
            }}
          >
            💬 WhatsApp
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1.5px solid rgba(255,255,255,0.18)",
            borderRadius: 10,
            padding: "7px 12px",
            color: "#fff",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ── Search bar row (desktop) ── */}
      <div className="header-search-bar hidden md:flex">
        <div className="header-search-inner">
          {/* Categories quick links */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {["Kitchen", "Bathroom", "Fitness", "Home"].map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: "rgba(255,255,255,0.06)",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </Link>
            ))}
          </div>

          <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doSearch(query);
            }}
            style={{ display: "flex", flex: 1 }}
          >
            <div className="header-search-input-wrap">
              <span className="header-search-icon">🔍</span>
              <input
                className="header-search-input"
                type="text"
                placeholder="Search products — blender, rain coat, air fryer…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search"
              />
              <button type="submit" className="header-search-btn">
                Search
              </button>
            </div>
          </form>

          <a
            href="tel:+250784734956"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            📞 0784 734 956
          </a>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="mobile-menu md:hidden">
          {/* Mobile search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doSearch(mobileQuery);
            }}
          >
            <div className="mobile-search-wrap">
              <input
                className="mobile-search-input"
                type="text"
                placeholder="Search products…"
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="mobile-search-btn">
                🔍
              </button>
            </div>
          </form>

          {/* Nav links */}
          {[
            { href: "/", label: "🏠 Home" },
            { href: "/products", label: "🛍️ Products" },
            { href: "/contact", label: "📞 Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                color: "rgba(255,255,255,0.85)",
                padding: "12px 0",
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {label}
            </Link>
          ))}

          <a
            href="https://wa.me/250784734956"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              marginTop: 14,
              background: "#22c55e",
              color: "#fff",
              padding: "13px",
              borderRadius: 12,
              textAlign: "center",
              fontWeight: 800,
              fontSize: 15,
              textDecoration: "none",
            }}
          >
            💬 WhatsApp Order
          </a>
        </div>
      )}
    </header>
  );
}
