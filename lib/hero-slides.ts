// ═══════════════════════════════════════════════════════════════════════════
// HERO CAROUSEL — IMAGE CONFIG
//
// HOW TO UPDATE:
//  1. Put your designed images in the /public/hero/ folder
//  2. Edit the slides below — each slide has ONE full image slot.
//
// Example file names to use in /public/hero/:
//   slide-1.jpg   slide-2.jpg   slide-3.jpg  …
// ═══════════════════════════════════════════════════════════════════════════

export type HeroSlide = {
  /** Your designed promotional post — fills the full image zone */
  image: string;
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
    image: "/products/product-7.jpg",
    title: "Clothes Drying Rack Foldable",
    price: "65,000 RWF",
    oldPrice: "92,000 RWF",
    link: "/products/clothes-drying-rack",
    accent: "Limited time offer",
  },
  {
    image: "/products/product-4.jpg",
    title: "Mini Steppers For Exercise",
    price: "120,000 RWF",
    oldPrice: "170,000 RWF",
    link: "/products/mini-steppers",
    accent: "Customer favorite",
  },
  {
    image: "/products/product-19.jpg",
    title: "Silver Crest Air Fryer 2400W",
    price: "90,000 RWF",
    oldPrice: "127,000 RWF",
    link: "/products/air-fryer",
    accent: "Best seller",
  },
  {
    image: "/products/product-17.jpg",
    title: "Multifunction 8 in 1 Blender",
    price: "130,000 RWF",
    oldPrice: "184,000 RWF",
    link: "/products/blender-8in1",
    accent: "Limited time offer",
  },
  {
    image: "/products/product-13.jpg",
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
