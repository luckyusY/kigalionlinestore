import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { products as staticProducts } from "@/lib/products";
import { getReviewSummaries } from "@/lib/reviews";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    const dbProducts = docs.map(({ _id, ...p }) => ({ ...p, id: _id.toString() })) as unknown as Array<{ slug: string; [key: string]: unknown }>;
    const dbSlugs = new Set(dbProducts.map((p) => p.slug));
    const merged = [...dbProducts, ...staticProducts.filter((p) => !dbSlugs.has(p.slug))];
    const reviewSummaries = await getReviewSummaries(merged.map((product) => product.slug));
    const products = merged.map((product) => ({
      ...product,
      ...(reviewSummaries[product.slug] ?? { averageRating: 0, reviewCount: 0 }),
    }));
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: staticProducts });
  }
}
