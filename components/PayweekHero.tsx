"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  Home,
  Laptop,
  MessageCircle,
  ShoppingBasket,
  Sprout,
  Store,
  Utensils,
} from "lucide-react";
import { motion } from "framer-motion";
import { categories } from "@/lib/products";
import { type HeroSlide, slideCopy } from "@/lib/hero-slides";

const categoryMeta = {
  Kitchen: { label: "Kitchen", Icon: Utensils },
  Bathroom: { label: "Bathroom", Icon: HeartPulse },
  Home: { label: "Home", Icon: Home },
  Fitness: { label: "Fitness", Icon: Dumbbell },
  Office: { label: "Office", Icon: Laptop },
  Garden: { label: "Garden", Icon: Sprout },
  Accessories: { label: "Accessories", Icon: ShoppingBasket },
} as const;

const heroCategories = categories
  .filter((category) => category !== "All" && category !== "Clothing")
  .map((category) => ({
    category,
    ...(categoryMeta[category as keyof typeof categoryMeta] || { label: category, Icon: Store }),
  }));

function displayPrice(value: string) {
  const trimmed = value.trim();
  const withoutCurrency = trimmed.replace(/\bRWF\b/gi, "").trim();
  const compact = withoutCurrency.replace(/[,\s]/g, "");
  const digits = compact.replace(/[^\d]/g, "");

  if (digits.length >= 4 && digits.length === compact.length) {
    return `${Number(digits).toLocaleString("en-US")} RWF`;
  }

  return /\bRWF\b/i.test(trimmed) ? `${withoutCurrency} RWF` : trimmed;
}

export default function PayweekHero({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setCurrent((index) => (index + 1) % slides.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const slide = slides[current];
  const copy = slideCopy(current);

  const goTo = (nextIndex: number) => {
    setDirection(nextIndex > current ? 1 : -1);
    setCurrent(nextIndex);
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  return (
    <section className="payweek-hero" aria-label="Pay week deals">
      <aside className="payweek-categories" aria-label="Featured categories">
        {heroCategories.map(({ category, label, Icon }) => (
          <Link key={category} href={`/products?category=${encodeURIComponent(category)}`}>
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </aside>

      <div className="payweek-stage">
        <button className="payweek-arrow payweek-arrow-left" onClick={prev} aria-label="Previous deal">
          <ChevronLeft size={24} />
        </button>

        <div className="payweek-copy">
          <h1>
            {copy.kicker} <mark>{copy.mark}</mark>
            <span>{copy.title}</span>
          </h1>
          <h2>{slide.title}</h2>
          <div className="payweek-price-pill">
            <del>{displayPrice(slide.oldPrice)}</del>
            <strong>{displayPrice(slide.price)}</strong>
          </div>
          <p>{slide.accent}</p>
          <small>T&Cs Apply</small>
        </div>

        <div className="payweek-product-zone">
          <div className="payweek-rays" />
          <div className="payweek-pedestal" />
          <motion.div
            key={current}
            className="payweek-product-graphic"
            custom={direction}
            initial={false}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="payweek-product-card payweek-product-main">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="(max-width: 900px) 72vw, 380px"
                priority
                unoptimized
              />
            </div>
          </motion.div>
        </div>

        <div className="payweek-dots" aria-label="Deal slides">
          {slides.map((_, index) => (
            <button
              key={index}
              className={index === current ? "active" : ""}
              onClick={() => goTo(index)}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>

        <Link href={slide.link} className="payweek-shop">
          SHOP NOW <ChevronRight size={13} />
        </Link>
      </div>

      <aside className="payweek-side">
        <a href="https://wa.me/250784734956" target="_blank" rel="noopener noreferrer" className="payweek-side-card">
          <MessageCircle size={28} />
          <span><strong>WhatsApp</strong>Chat To Order</span>
        </a>
        <Link href="/products?sort=best-selling" className="payweek-side-card">
          <ShoppingBasket size={28} />
          <span><strong>Mega Home Savings</strong>Bigger Comfort</span>
        </Link>
        <Link href="/admin" className="payweek-side-card">
          <Store size={28} />
          <span><strong>SELL ON KIGALI</strong>Millions Of Visitors</span>
        </Link>
        <Link href={slide.link} className="payweek-live-card product-ad">
          <strong>{copy.kicker}<br />{copy.title}</strong>
          <Image
            src={slide.image}
            alt={`${slide.title} deal`}
            fill
            sizes="218px"
            unoptimized
          />
          <span>SHOP NOW</span>
        </Link>
      </aside>
    </section>
  );
}
