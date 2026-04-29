import { NextRequest, NextResponse } from "next/server";
import { adminUnauthorized, verifyAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";
import { heroSlides as defaultSlides } from "@/lib/hero-slides";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(request)) return adminUnauthorized();
  try {
    const db = await getDb();
    const doc = await db.collection("hero_slides").findOne({});
    return NextResponse.json({ slides: doc?.slides ?? defaultSlides });
  } catch {
    return NextResponse.json({ slides: defaultSlides });
  }
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminSession(request)) return adminUnauthorized();
  try {
    const body = await request.json() as { slides?: unknown };
    const db = await getDb();
    await db.collection("hero_slides").replaceOne({}, { slides: body.slides }, { upsert: true });
    return NextResponse.json({ slides: body.slides });
  } catch {
    return NextResponse.json({ error: "Could not save hero slides." }, { status: 500 });
  }
}
