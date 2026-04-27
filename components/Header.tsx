"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-orange-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-2xl">🛒</span>
            <span className="hidden sm:block">Kigali Online Store</span>
            <span className="sm:hidden">KOS</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-orange-200 transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-orange-200 transition-colors">
              Products
            </Link>
            <Link href="/contact" className="hover:text-orange-200 transition-colors">
              Contact
            </Link>
            <a
              href="https://wa.me/250784734956"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
            >
              <span>💬</span> WhatsApp Order
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-orange-700 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className="text-xl">{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-orange-700 border-t border-orange-500">
          <nav className="flex flex-col px-4 py-3 gap-3 text-sm font-medium">
            <Link href="/" onClick={() => setMenuOpen(false)} className="hover:text-orange-200 py-1">
              Home
            </Link>
            <Link href="/products" onClick={() => setMenuOpen(false)} className="hover:text-orange-200 py-1">
              Products
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="hover:text-orange-200 py-1">
              Contact
            </Link>
            <a
              href="https://wa.me/250784734956"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-4 py-2 rounded-full text-center font-semibold"
            >
              💬 WhatsApp Order
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
