import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getReviewSummary, validateReviewInput } from "@/lib/reviews";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const summary = await getReviewSummary(slug);
  return NextResponse.json(summary);
}

export async function POST(request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const parsed = validateReviewInput(await request.json().catch(() => null));

  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const db = await getDb();
    await db.collection("reviews").insertOne({
      productSlug: slug,
      name: parsed.review.name,
      rating: parsed.review.rating,
      comment: parsed.review.comment,
      approved: true,
      createdAt: new Date(),
    });

    const summary = await getReviewSummary(slug);
    return NextResponse.json(summary, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Reviews are temporarily unavailable. Please try again later." }, { status: 503 });
  }
}
