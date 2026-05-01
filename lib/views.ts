import { getDb } from "@/lib/mongodb";

export type ProductViewSummary = {
  viewCount: number;
};

export async function getViewCounts(productSlugs: string[]): Promise<Record<string, ProductViewSummary>> {
  const slugs = Array.from(new Set(productSlugs.filter(Boolean)));
  if (!slugs.length) return {};

  try {
    const db = await getDb();
    const docs = await db.collection("product_views").find({ productSlug: { $in: slugs } }).toArray();
    return docs.reduce<Record<string, ProductViewSummary>>((counts, doc) => {
      const slug = String(doc.productSlug || "");
      if (slug) counts[slug] = { viewCount: Math.max(0, Number(doc.count) || 0) };
      return counts;
    }, {});
  } catch {
    return {};
  }
}
