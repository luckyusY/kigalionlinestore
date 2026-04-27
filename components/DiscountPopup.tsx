"use client";

import { useEffect, useState } from "react";
import { X, MessageCircle, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DiscountPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if dismissed this session
    if (sessionStorage.getItem("discount-popup-dismissed")) return;

    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? scrolled / total : 0;
      if (pct > 0.3 && !dismissed) setVisible(true);
    };

    // Small delay before attaching so it doesn't flash immediately
    const t = setTimeout(() => window.addEventListener("scroll", handleScroll, { passive: true }), 800);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dismissed]);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem("discount-popup-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="discount-popup"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          style={{
            position: "fixed",
            bottom: 24,
            right: 20,
            zIndex: 10000,
            width: "min(320px, calc(100vw - 32px))",
            background: "#fff",
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.08)",
            overflow: "hidden",
            border: "1px solid #f1f5f9",
          }}
        >
          {/* Top stripe */}
          <div style={{ background: "linear-gradient(135deg, #ea580c, #f97316)", padding: "14px 16px 12px", position: "relative" }}>
            <button
              onClick={dismiss}
              aria-label="Close"
              style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 999, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}
            >
              <X size={14} strokeWidth={2.5} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Tag size={16} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 900, fontSize: 14, lineHeight: 1 }}>Get a Special Discount!</div>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, marginTop: 2 }}>Contact us before you order</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "16px 16px 18px" }}>
            <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.6, marginBottom: 14 }}>
              💬 Message us on WhatsApp and mention <strong>&ldquo;DISCOUNT&rdquo;</strong> to get a special deal on your order!
            </p>

            <a
              href="https://wa.me/250784734956?text=Hello!%20I%27d%20like%20a%20discount%20on%20my%20order%20from%20Kigali%20Online%20Store.%20DISCOUNT"
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "#16a34a", color: "#fff", fontWeight: 800,
                padding: "12px", borderRadius: 12, textDecoration: "none",
                fontSize: 14, width: "100%",
                boxShadow: "0 4px 14px rgba(22,163,74,0.3)",
              }}
            >
              <MessageCircle size={16} strokeWidth={2.5} />
              Claim Discount on WhatsApp
            </a>

            <button
              onClick={dismiss}
              style={{ width: "100%", marginTop: 8, background: "none", border: "none", color: "#9ca3af", fontSize: 12, cursor: "pointer", padding: "4px 0", fontFamily: "inherit" }}
            >
              No thanks, continue browsing
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
