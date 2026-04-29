import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;
  return Boolean(adminSecret && request.headers.get("x-admin-secret") === adminSecret);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const settings = await db.collection("settings").findOne({ key: "site" });

  return NextResponse.json({ settings: settings?.value || {} });
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const now = new Date();

  const settings = {
    storeName: String(body.storeName || "Kigali Online Store"),
    phone: String(body.phone || "0784 734 956"),
    whatsapp: String(body.whatsapp || "250784734956"),
    deliveryText: String(body.deliveryText || "Fast Kigali delivery"),
    announcement: String(body.announcement || "Free shipping on selected products"),
    supportText: String(body.supportText || "WhatsApp Orders"),
    tiktok: String(body.tiktok || ""),
    instagram: String(body.instagram || ""),
    facebook: String(body.facebook || ""),
    updatedAt: now,
  };

  const db = await getDb();
  await db.collection("settings").updateOne(
    { key: "site" },
    { $set: { key: "site", value: settings, updatedAt: now } },
    { upsert: true }
  );

  return NextResponse.json({ settings });
}
