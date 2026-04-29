import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { adminUnauthorized, verifyAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminSession(request)) return adminUnauthorized();

  const { id } = await params;

  try {
    const db = await getDb();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
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
  if ("price" in body)   update.price        = body.price === null ? null : Number(body.price);
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
