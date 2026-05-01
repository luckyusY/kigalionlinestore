import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function POST(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return NextResponse.json({ error: "Product slug is required." }, { status: 400 });

  try {
    const db = await getDb();
    const result = await db.collection("product_views").findOneAndUpdate(
      { productSlug: slug },
      {
        $inc: { count: 1 },
        $set: { productSlug: slug, updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true, returnDocument: "after" }
    );
    return NextResponse.json({ viewCount: Number(result?.count) || 1 });
  } catch {
    return NextResponse.json({ error: "Could not record product view." }, { status: 503 });
  }
}
