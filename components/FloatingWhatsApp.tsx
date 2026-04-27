"use client";

import { motion } from "framer-motion";

export default function FloatingWhatsApp() {
  return (
    <div style={{ position: "fixed", bottom: 24, left: 20, zIndex: 9998 }}>
      {/* Pulse ring */}
      <span style={{
        position: "absolute", inset: -6,
        borderRadius: "50%",
        background: "rgba(37,211,102,0.25)",
        animation: "wa-pulse 2s ease-out infinite",
        pointerEvents: "none",
      }} />

      <motion.a
        href="https://wa.me/250784734956?text=Hello!%20I%27d%20like%20to%20know%20more%20about%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        title="Chat with us on WhatsApp"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#25D366",
          boxShadow: "0 6px 24px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.15)",
          textDecoration: "none",
          position: "relative",
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.504L4 29l7.695-1.813A11.943 11.943 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/>
          <path d="M22.54 19.28c-.297-.148-1.754-.866-2.025-.965-.272-.099-.47-.148-.668.148-.197.297-.768.965-.941 1.163-.174.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.654-2.059-.173-.297-.018-.457.13-.605.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.668-1.611-.916-2.206-.241-.579-.486-.5-.668-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.371-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
        </svg>
      </motion.a>

      <style>{`
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.7; }
          70%  { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
