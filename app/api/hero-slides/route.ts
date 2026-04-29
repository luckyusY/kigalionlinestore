import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { heroSlides as defaultSlides } from "@/lib/hero-slides";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const doc = await db.collection("hero_slides").findOne({});
    return NextResponse.json({ slides: doc?.slides ?? defaultSlides });
  } catch {
    return NextResponse.json({ slides: defaultSlides });
  }
}
