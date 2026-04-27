"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { Product } from "@/lib/products";

interface Props {
  slides: Product[];
}

export default function HeroCarousel({ slides }: Props) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), [slides.length]);

  // Auto-advance every 4.5 s
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, paused]);

  // Touch swipe support
  const touchStart = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides track */}
      <div
        className="hero-track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((product) => (
          <div key={product.id} className="hero-slide">
            {/* Background image */}
            <Image
              src={product.image}
              alt={product.name}
              fill
              style={{ objectFit: "cover", objectPosition: "center" }}
              sizes="100vw"
              priority
            />
            {/* Gradient overlay */}
            <div className="hero-slide-overlay" />

            {/* Content */}
            <div className="hero-slide-content">
              {/* Category badge */}
              <span
                style={{
                  display: "inline-block",
                  background: "#f97316",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 800,
                  padding: "4px 12px",
                  borderRadius: 999,
                  marginBottom: 14,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  width: "fit-content",
                }}
              >
                {product.category}
              </span>

              <h2
                style={{
                  fontSize: "clamp(1.6rem, 4vw, 2.75rem)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.1,
                  marginBottom: 12,
                  textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
              >
                {product.name}
              </h2>

              <p
                style={{
                  fontSize: "clamp(13px, 2vw, 15px)",
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.6,
                  marginBottom: 20,
                  maxWidth: 480,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.description}
              </p>

              {/* Price + CTA */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
                <span
                  style={{
                    fontSize: "clamp(1.2rem, 3vw, 1.7rem)",
                    fontWeight: 900,
                    color: "#fbbf24",
                    textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  {product.priceDisplay}
                </span>
              </div>

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link
                  href={`/products/${product.slug}`}
                  style={{
                    background: "#f97316",
                    color: "#fff",
                    fontWeight: 800,
                    padding: "12px 26px",
                    borderRadius: 12,
                    textDecoration: "none",
                    fontSize: 14,
                    boxShadow: "0 4px 18px rgba(249,115,22,0.45)",
                    transition: "transform 0.15s",
                  }}
                >
                  View Details
                </Link>
                <a
                  href={`https://wa.me/250784734956?text=${encodeURIComponent(`Hello! I'd like to order: ${product.name} (${product.priceDisplay})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(6px)",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    color: "#fff",
                    fontWeight: 700,
                    padding: "12px 24px",
                    borderRadius: 12,
                    textDecoration: "none",
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  💬 Order Now
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Left arrow */}
      <button className="hero-arrow hero-arrow-left" onClick={prev} aria-label="Previous">
        ‹
      </button>
      {/* Right arrow */}
      <button className="hero-arrow hero-arrow-right" onClick={next} aria-label="Next">
        ›
      </button>

      {/* Slide counter top-right */}
      <div
        style={{
          position: "absolute",
          top: 18,
          right: 20,
          zIndex: 5,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          padding: "4px 12px",
          borderRadius: 999,
          letterSpacing: "0.04em",
        }}
      >
        {current + 1} / {slides.length}
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Paused indicator */}
      {paused && (
        <div
          style={{
            position: "absolute",
            bottom: 18,
            right: 20,
            zIndex: 5,
            background: "rgba(0,0,0,0.4)",
            color: "rgba(255,255,255,0.6)",
            fontSize: 11,
            padding: "3px 10px",
            borderRadius: 999,
            letterSpacing: "0.05em",
          }}
        >
          ⏸ paused
        </div>
      )}
    </div>
  );
}
