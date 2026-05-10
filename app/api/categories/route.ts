import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { defaultCategoryOptions, normalizeCategoryOptions } from "@/lib/products";

export const runtime = "nodejs";

export async function GET() {
  try {
    const db = await getDb();
    const settings = await db.collection("settings").findOne({ key: "site" });
    const categories = normalizeCategoryOptions(settings?.value?.categories ?? defaultCategoryOptions);
    return NextResponse.json({ categories });
  } catch {
    return NextResponse.json({ categories: defaultCategoryOptions });
  }
}
