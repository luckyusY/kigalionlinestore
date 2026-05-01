import { NextRequest, NextResponse } from "next/server";
import { adminUnauthorized, verifyAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";
import { products as staticProducts, Product } from "@/lib/products";
import { getViewCounts } from "@/lib/views";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(request)) return adminUnauthorized();

  try {
    const db = await getDb();
    const docs = await db.collection("products").find({}).toArray();
    const dbProducts = docs.map(({ _id, ...product }) => ({ ...product, id: _id.toString() })) as unknown as Product[];
    const dbSlugs = new Set(dbProducts.map((product) => product.slug));
    const merged = [...dbProducts, ...staticProducts.filter((product) => !dbSlugs.has(product.slug))];
    const viewCounts = await getViewCounts(merged.map((product) => product.slug));
    const products = merged
      .map((product) => ({ ...product, ...(viewCounts[product.slug] ?? { viewCount: 0 }) }))
      .sort((a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0))
      .slice(0, 50);

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Could not load product views." }, { status: 500 });
  }
}
