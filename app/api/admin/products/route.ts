import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { adminUnauthorized, verifyAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

type ProductPayload = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number | null;
  priceDisplay?: string;
  category?: string;
  image?: string;
  images?: string[];
  inStock?: boolean;
  featured?: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(request)) return adminUnauthorized();

  const db = await getDb();
  const products = await db
    .collection("products")
    .find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .toArray();

  return NextResponse.json({
    products: products.map(({ _id, ...product }) => ({
      ...product,
      id: _id.toString(),
    })),
  });
}

export async function POST(request: NextRequest) {
  if (!verifyAdminSession(request)) return adminUnauthorized();

  const body = (await request.json()) as ProductPayload;
  const name = body.name?.trim();
  const description = body.description?.trim();
  const category = body.category?.trim();
  const priceDisplay = body.priceDisplay?.trim();
  const images = Array.isArray(body.images)
    ? Array.from(new Set(body.images.map((image) => image.trim()).filter(Boolean)))
    : [];
  const image = body.image?.trim() || images[0];

  if (!name || !description || !category || !priceDisplay || !image) {
    return NextResponse.json(
      { error: "Name, description, category, price display, and image are required." },
      { status: 400 }
    );
  }

  const db = await getDb();
  const now = new Date();
  const slug = slugify(body.slug || name);

  const fields = {
    name,
    slug,
    description,
    category,
    price: typeof body.price === "number" ? body.price : null,
    priceDisplay,
    image,
    images: Array.from(new Set([image, ...images])),
    inStock: body.inStock !== false,
    featured: Boolean(body.featured),
    updatedAt: now,
  };

  // Upsert by slug so editing a static product creates an override without duplicates
  const result = await db.collection("products").findOneAndUpdate(
    { slug },
    { $set: fields, $setOnInsert: { createdAt: now } },
    { upsert: true, returnDocument: "after" }
  );

  const saved = result ?? fields;

  return NextResponse.json({
    product: {
      ...saved,
      id: "_id" in saved ? (saved._id as { toString(): string }).toString() : slug,
    },
  });
}
