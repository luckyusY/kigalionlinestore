import { getDb } from "@/lib/mongodb";

export type ProductReview = {
  id: string;
  productSlug: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ReviewSummary = {
  reviews: ProductReview[];
  averageRating: number;
  reviewCount: number;
};

export type CompactReviewSummary = {
  averageRating: number;
  reviewCount: number;
};

function cleanText(value: unknown, maxLength: number) {
  return String(value ?? "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function normalizeReview(doc: {
  _id?: { toString(): string };
  productSlug?: unknown;
  name?: unknown;
  rating?: unknown;
  comment?: unknown;
  createdAt?: Date | string;
}): ProductReview {
  return {
    id: doc._id?.toString() ?? "",
    productSlug: cleanText(doc.productSlug, 120),
    name: cleanText(doc.name, 80) || "Customer",
    rating: Math.min(5, Math.max(1, Number(doc.rating) || 5)),
    comment: cleanText(doc.comment, 900),
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : String(doc.createdAt ?? new Date().toISOString()),
  };
}

export function validateReviewInput(input: unknown) {
  const data = input && typeof input === "object" ? input as Record<string, unknown> : {};
  const name = cleanText(data.name, 80);
  const comment = cleanText(data.comment, 900);
  const rating = Number(data.rating);

  if (!name) return { error: "Please enter your name." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Please choose a rating from 1 to 5 stars." };
  if (comment.length < 8) return { error: "Please write a short review." };

  return { review: { name, rating, comment } };
}

export async function getReviewSummary(productSlug: string): Promise<ReviewSummary> {
  try {
    const db = await getDb();
    const docs = await db
      .collection("reviews")
      .find({ productSlug, approved: { $ne: false } })
      .sort({ createdAt: -1 })
      .limit(40)
      .toArray();

    const reviews = docs.map(normalizeReview);
    const reviewCount = reviews.length;
    const averageRating = reviewCount
      ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount) * 10) / 10
      : 0;

    return { reviews, averageRating, reviewCount };
  } catch {
    return { reviews: [], averageRating: 0, reviewCount: 0 };
  }
}

export async function getReviewSummaries(productSlugs: string[]): Promise<Record<string, CompactReviewSummary>> {
  const slugs = Array.from(new Set(productSlugs.filter(Boolean)));
  if (!slugs.length) return {};

  try {
    const db = await getDb();
    const rows = await db
      .collection("reviews")
      .aggregate<{ _id: string; averageRating: number; reviewCount: number }>([
        { $match: { productSlug: { $in: slugs }, approved: { $ne: false } } },
        {
          $group: {
            _id: "$productSlug",
            averageRating: { $avg: "$rating" },
            reviewCount: { $sum: 1 },
          },
        },
      ])
      .toArray();

    return rows.reduce<Record<string, CompactReviewSummary>>((summaries, row) => {
      summaries[row._id] = {
        averageRating: Math.round(row.averageRating * 10) / 10,
        reviewCount: row.reviewCount,
      };
      return summaries;
    }, {});
  } catch {
    return {};
  }
}
