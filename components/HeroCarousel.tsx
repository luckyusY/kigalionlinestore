"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/lib/products";

const categoryIcons: Record<string, string> = {
  Kitchen:"🍳", Bathroom:"🚿", Home:"🏠", Fitness:"💪",
  Office:"💻", Garden:"🌿", Clothing:"👗", Accessories:"🎒",
};

export default function HeroCarousel({ slides }: { slides: Product[] }) {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const [dir,     setDir]     = useState(1); // 1 = forward, -1 = back
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((idx: number, direction: number) => {
    setDir(direction);
    setCurrent(idx);
  }, []);

  const next = useCallback(() => go((current + 1) % slides.length,  1),  [current, slides.length, go]);
  const prev = useCallback(() => go((current - 1 + slides.length) % slides.length, -1), [current, slides.length, go]);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, paused]);

  /* touch swipe */
  const touchX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e: React.TouchEvent) => {
    const d = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(d) > 44) {
      if (d > 0) next();
      else prev();
    }
  };

  const slide = slides[current];

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background image — crossfade */}
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${current}`}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Image
            src={slide.image}
            alt={slide.name}
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            sizes="100vw"
            priority
          />
          <div className="hero-overlay" />
        </motion.div>
      </AnimatePresence>

      {/* Slide content */}
      <div className="hero-content">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={`content-${current}`}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 40 }),
              center: { opacity: 1, x: 0 },
              exit:  (d: number) => ({ opacity: 0, x: d * -30 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Category badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                background: "#f97316", color: "#fff",
                fontSize: 11, fontWeight: 800, padding: "4px 12px",
                borderRadius: 999, letterSpacing: "0.06em", textTransform: "uppercase",
              }}>
                {categoryIcons[slide.category] || "📦"} {slide.category}
              </span>
              <span style={{
                color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600,
                letterSpacing: "0.06em",
              }}>
                {current + 1} / {slides.length}
              </span>
            </div>

            {/* Title */}
            <h2 style={{
              fontSize: "clamp(1.55rem, 3.8vw, 2.6rem)",
              fontWeight: 900, color: "#fff", lineHeight: 1.1,
              marginBottom: 12, letterSpacing: "-0.02em",
              textShadow: "0 2px 12px rgba(0,0,0,0.3)",
            }}>
              {slide.name}
            </h2>

            {/* Description */}
            <p style={{
              fontSize: 14, color: "rgba(255,255,255,0.75)",
              lineHeight: 1.65, marginBottom: 22, maxWidth: 500,
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {slide.description}
            </p>

            {/* Price */}
            <div style={{ marginBottom: 24 }}>
              <span style={{
                fontSize: "clamp(1.25rem, 3vw, 1.85rem)",
                fontWeight: 900, color: "#fbbf24",
                letterSpacing: "-0.02em",
              }}>
                {slide.priceDisplay}
              </span>
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link href={`/products/${slide.slug}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "#f97316", color: "#fff",
                  fontWeight: 800, padding: "12px 24px", borderRadius: 12,
                  textDecoration: "none", fontSize: 14,
                  boxShadow: "0 4px 20px rgba(249,115,22,0.5)",
                }}>
                  View Details <ArrowRight size={15} strokeWidth={2.5} />
                </Link>
              </motion.div>

              <motion.a
                href={`https://wa.me/250784734956?text=${encodeURIComponent(`Hi! I'd like to order: ${slide.name} (${slide.priceDisplay})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
                  border: "1.5px solid rgba(255,255,255,0.25)",
                  color: "#fff", fontWeight: 700,
                  padding: "12px 22px", borderRadius: 12,
                  textDecoration: "none", fontSize: 14,
                }}
              >
                <MessageCircle size={15} strokeWidth={2.5} /> Order Now
              </motion.a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button className="hero-arrow hero-arrow-left" onClick={prev} aria-label="Previous">
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>
      <button className="hero-arrow hero-arrow-right" onClick={next} aria-label="Next">
        <ChevronRight size={22} strokeWidth={2.5} />
      </button>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? " active" : ""}`}
            onClick={() => go(i, i > current ? 1 : -1)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <motion.div
          key={`progress-${current}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 5, ease: "linear" }}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 3,
            background: "#f97316", transformOrigin: "left", zIndex: 5,
          }}
        />
      )}
    </div>
  );
}
