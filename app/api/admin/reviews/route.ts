import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { adminUnauthorized, verifyAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(request)) return adminUnauthorized();

  const db = await getDb();
  const reviews = await db
    .collection("reviews")
    .find({})
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray();

  return NextResponse.json({
    reviews: reviews.map(({ _id, ...review }) => ({
      ...review,
      id: _id.toString(),
      createdAt: review.createdAt instanceof Date ? review.createdAt.toISOString() : review.createdAt,
    })),
  });
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminSession(request)) return adminUnauthorized();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Review id is required." }, { status: 400 });

  try {
    const db = await getDb();
    const result = await db.collection("reviews").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete review." }, { status: 500 });
  }
}
