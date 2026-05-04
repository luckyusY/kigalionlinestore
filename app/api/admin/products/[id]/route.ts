import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { adminUnauthorized, verifyAdminSession } from "@/lib/admin-auth";
import { products as staticProducts } from "@/lib/products";

export const runtime = "nodejs";

function formatRwfPrice(price: number | null) {
  return typeof price === "number" && Number.isFinite(price)
    ? `${price.toLocaleString("en-US")} RWF`
    : "Contact for price";
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminSession(request)) return adminUnauthorized();

  const { id } = await params;

  try {
    const db = await getDb();
    if (!ObjectId.isValid(id)) {
      const staticProduct = staticProducts.find((product) => String(product.id) === id || product.slug === id);
      if (!staticProduct) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
      }

      await db.collection("deleted_static_slugs").updateOne(
        { slug: staticProduct.slug },
        { $set: { slug: staticProduct.slug, deletedAt: new Date() } },
        { upsert: true }
      );
      await db.collection("products").deleteOne({ slug: staticProduct.slug });

      return NextResponse.json({ ok: true });
    }

    const objectId = new ObjectId(id);
    const existing = await db.collection<{ slug?: string }>("products").findOne({ _id: objectId });
    const result = await db.collection("products").deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    if (existing?.slug) {
      await db.collection("deleted_static_slugs").updateOne(
        { slug: existing.slug },
        { $set: { slug: existing.slug, deletedAt: new Date() } },
        { upsert: true }
      );
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product." }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminSession(request)) return adminUnauthorized();

  const { id } = await params;
  const body = await request.json() as Record<string, unknown>;

  const update: Record<string, unknown> = { updatedAt: new Date() };
  if (body.name)         update.name         = String(body.name).trim();
  if (body.priceDisplay) update.priceDisplay = String(body.priceDisplay).trim();
  if (body.category)     update.category     = String(body.category).trim();
  if (body.description)  update.description  = String(body.description).trim();
  if (body.image)        update.image        = String(body.image).trim();
  if (Array.isArray(body.images)) {
    update.images = Array.from(
      new Set(body.images.map((image) => String(image).trim()).filter(Boolean))
    );
  }
  if (body.slug)         update.slug         = String(body.slug).trim();
  if ("price" in body) {
    const price = body.price === null ? null : Number(body.price);
    update.price = Number.isFinite(price) ? price : null;
    if (!body.priceDisplay) update.priceDisplay = formatRwfPrice(update.price as number | null);
  }
  if ("inStock"  in body) update.inStock     = Boolean(body.inStock);
  if ("featured" in body) update.featured    = Boolean(body.featured);

  try {
    const db = await getDb();
    await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to update product." }, { status: 500 });
  }
}
