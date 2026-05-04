import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { products as staticProducts } from "@/lib/products";
import { getReviewSummaries } from "@/lib/reviews";
import { getViewCounts } from "@/lib/views";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db.collection("products").find({}).sort({ createdAt: -1 }).toArray();
    const dbProducts = docs.map(({ _id, ...p }) => ({ ...p, id: _id.toString() })) as unknown as Array<{ slug: string; [key: string]: unknown }>;
    const dbSlugs = new Set(dbProducts.map((p) => p.slug));
    const deletedStaticSlugs = new Set(
      (await db.collection<{ slug: string }>("deleted_static_slugs").find({}).toArray()).map(
        (entry) => entry.slug
      )
    );
    const merged = [...dbProducts, ...staticProducts.filter((p) => !dbSlugs.has(p.slug) && !deletedStaticSlugs.has(p.slug))]
      .filter((product) => product.inStock !== false);
    const slugs = merged.map((product) => product.slug);
    const [reviewSummaries, viewCounts] = await Promise.all([getReviewSummaries(slugs), getViewCounts(slugs)]);
    const products = merged.map((product) => ({
      ...product,
      ...(reviewSummaries[product.slug] ?? { averageRating: 0, reviewCount: 0 }),
      ...(viewCounts[product.slug] ?? { viewCount: 0 }),
    }));
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: staticProducts });
  }
}
