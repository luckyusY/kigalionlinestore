// ═══════════════════════════════════════════════════════════════════════════
// HERO CAROUSEL — IMAGE CONFIG
//
// HOW TO UPDATE:
//  1. Put your designed images in the /public/hero/ folder
//  2. Edit the slides below — each slide has 3 independent image slots:
//
//     mainImage  → the big centre promotional post
//     thumb1     → small image shown bottom-left
//     thumb2     → small image shown bottom-right
//
// Example file names to use in /public/hero/:
//   slide-1-main.jpg   slide-1-thumb1.jpg   slide-1-thumb2.jpg
//   slide-2-main.jpg   slide-2-thumb1.jpg   slide-2-thumb2.jpg
//   …and so on
// ═══════════════════════════════════════════════════════════════════════════

export type HeroSlide = {
  /** Large centre image – your main designed promotional post */
  mainImage: string;
  /** Small image shown bottom-left of the product zone */
  thumb1: string;
  /** Small image shown bottom-right of the product zone */
  thumb2: string;
  /** Headline shown on the left panel */
  title: string;
  /** Price shown on the left panel, e.g. "65,000 RWF" */
  price: string;
  /** Crossed-out original price shown on the left panel */
  oldPrice: string;
  /** Where "Shop Now" links to */
  link: string;
  /** Small accent line below the price */
  accent: string;
};

// ─── ADD / EDIT YOUR SLIDES HERE ──────────────────────────────────────────
export const heroSlides: HeroSlide[] = [
  {
    mainImage: "/products/product-7.jpg",   // ← replace with /hero/slide-1-main.jpg
    thumb1:    "/products/product-3.jpg",   // ← replace with /hero/slide-1-thumb1.jpg
    thumb2:    "/products/product-22.jpg",  // ← replace with /hero/slide-1-thumb2.jpg
    title: "Clothes Drying Rack Foldable",
    price: "65,000 RWF",
    oldPrice: "92,000 RWF",
    link: "/products/clothes-drying-rack",
    accent: "Limited time offer",
  },
  {
    mainImage: "/products/product-4.jpg",   // ← replace with /hero/slide-2-main.jpg
    thumb1:    "/products/product-8.jpg",   // ← replace with /hero/slide-2-thumb1.jpg
    thumb2:    "/products/product-29.jpg",  // ← replace with /hero/slide-2-thumb2.jpg
    title: "Mini Steppers For Exercise",
    price: "120,000 RWF",
    oldPrice: "170,000 RWF",
    link: "/products/mini-steppers",
    accent: "Customer favorite",
  },
  {
    mainImage: "/products/product-19.jpg",  // ← replace with /hero/slide-3-main.jpg
    thumb1:    "/products/product-1.jpg",   // ← replace with /hero/slide-3-thumb1.jpg
    thumb2:    "/products/product-17.jpg",  // ← replace with /hero/slide-3-thumb2.jpg
    title: "Silver Crest Air Fryer 2400W",
    price: "90,000 RWF",
    oldPrice: "127,000 RWF",
    link: "/products/air-fryer",
    accent: "Best seller",
  },
  {
    mainImage: "/products/product-17.jpg",  // ← replace with /hero/slide-4-main.jpg
    thumb1:    "/products/product-19.jpg",  // ← replace with /hero/slide-4-thumb1.jpg
    thumb2:    "/products/product-1.jpg",   // ← replace with /hero/slide-4-thumb2.jpg
    title: "Multifunction 8 in 1 Blender",
    price: "130,000 RWF",
    oldPrice: "184,000 RWF",
    link: "/products/blender-8in1",
    accent: "Limited time offer",
  },
  {
    mainImage: "/products/product-13.jpg",  // ← replace with /hero/slide-5-main.jpg
    thumb1:    "/products/product-10.jpg",  // ← replace with /hero/slide-5-thumb1.jpg
    thumb2:    "/products/product-20.jpg",  // ← replace with /hero/slide-5-thumb2.jpg
    title: "Electric Instant Water Heater",
    price: "135,000 RWF",
    oldPrice: "191,000 RWF",
    link: "/products/water-heater-shower",
    accent: "Top rated",
  },
];
// ──────────────────────────────────────────────────────────────────────────

const copyModes = [
  { kicker: "Pay", mark: "WEEK", title: "Deals!" },
  { kicker: "TOP", mark: "RATED", title: "Best Prices. Best Brands." },
  { kicker: "BUY 2", mark: "SAVE", title: "Enjoy checkout deals" },
];

export function slideCopy(index: number) {
  return copyModes[index % copyModes.length];
}
