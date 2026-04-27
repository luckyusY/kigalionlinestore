"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 18, color: "#fff", textDecoration: "none" }}
        >
          <span style={{ fontSize: 22 }}>🛒</span>
          <span>Kigali Online Store</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" style={{ fontSize: 14, fontWeight: 600 }}>
          <Link href="/" className="hover:text-orange-200 transition-colors" style={{ color: "#fff" }}>
            Home
          </Link>
          <Link href="/products" className="hover:text-orange-200 transition-colors" style={{ color: "#fff" }}>
            Products
          </Link>
          <Link href="/contact" className="hover:text-orange-200 transition-colors" style={{ color: "#fff" }}>
            Contact
          </Link>
          <a
            href="https://wa.me/250784734956"
            target="_blank"
            rel="noopener noreferrer"
            style={{
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
              transition: "background 0.2s",
            }}
          >
            💬 WhatsApp Order
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: 8,
            padding: "6px 10px",
            color: "#fff",
            fontSize: 20,
            cursor: "pointer",
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="mobile-menu md:hidden">
          <nav style={{ display: "flex", flexDirection: "column", padding: "12px 16px", gap: 4 }}>
            {[
              { href: "/", label: "Home" },
              { href: "/products", label: "Products" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  color: "#fff",
                  padding: "10px 0",
                  fontWeight: 600,
                  fontSize: 15,
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.1)",
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
                marginTop: 12,
                background: "#22c55e",
                color: "#fff",
                padding: "12px",
                borderRadius: 12,
                textAlign: "center",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
              }}
            >
              💬 WhatsApp Order
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
