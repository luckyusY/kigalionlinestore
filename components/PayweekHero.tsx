"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
import { categories, type Product } from "@/lib/products";

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

const copyModes = [
  { kicker: "Pay", mark: "WEEK", title: "Deals!", accent: "Limited time offer" },
  { kicker: "TOP", mark: "RATED", title: "Best Prices. Best Brands.", accent: "Customer favorites" },
  { kicker: "BUY 2", mark: "SAVE", title: "Enjoy checkout deals", accent: "Limited time offer" },
];

export default function PayweekHero({ products }: { products: Product[] }) {
  const heroProducts = useMemo(() => products.filter((product) => product.image).slice(0, 8), [products]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (heroProducts.length < 2) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setCurrent((index) => (index + 1) % heroProducts.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [heroProducts.length]);

  if (!heroProducts.length) return null;

  const product = heroProducts[current];
  const copy = copyModes[current % copyModes.length];
  const numericPrice = product.priceDisplay.match(/\d[\d,]*/)?.[0] ?? product.priceDisplay;
  const oldPrice = product.price ? `${Math.round(product.price * 1.42).toLocaleString()} RWF` : "Ask for quote";

  const goTo = (nextIndex: number) => {
    setDirection(nextIndex > current ? 1 : -1);
    setCurrent(nextIndex);
  };

  const prev = () => goTo((current - 1 + heroProducts.length) % heroProducts.length);

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
          <h2>{product.name}</h2>
          <div className="payweek-price-pill">
            <span>UGX</span>
            <del>{oldPrice}</del>
            <strong>{numericPrice}</strong>
          </div>
          <p>{copy.accent}</p>
          <small>T&Cs Apply</small>
        </div>

        <div className="payweek-product-zone">
          <div className="payweek-rays" />
          <div className="payweek-pedestal" />
          <motion.div
            key={product.id}
            className="payweek-product-graphic"
            custom={direction}
            initial={{ opacity: 0, x: direction * 90, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="payweek-product-card payweek-product-main">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 900px) 72vw, 330px"
                priority
                unoptimized
              />
            </div>
            <div className="payweek-product-support">
              <div className="payweek-product-card">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="92px"
                  unoptimized
                />
              </div>
              <div className="payweek-product-card">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="92px"
                  unoptimized
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="payweek-dots" aria-label="Deal slides">
          {heroProducts.map((item, index) => (
            <button
              key={item.id}
              className={index === current ? "active" : ""}
              onClick={() => goTo(index)}
              aria-label={`Show ${item.name}`}
            />
          ))}
        </div>

        <Link href={`/products/${product.slug}`} className="payweek-shop">
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
        <Link href="/products" className="payweek-live-card">
          <strong>LIVE<br />NOW</strong>
          <span>SHOP NOW</span>
        </Link>
      </aside>
    </section>
  );
}
