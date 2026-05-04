import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { adminUnauthorized, verifyAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!verifyAdminSession(request)) return adminUnauthorized();

  const db = await getDb();
  const settings = await db.collection("settings").findOne({ key: "site" });

  return NextResponse.json({ settings: settings?.value || {} });
}

export async function PUT(request: NextRequest) {
  if (!verifyAdminSession(request)) return adminUnauthorized();

  const body = await request.json();
  const now = new Date();

  const settings = {
    storeName: String(body.storeName || "Kigali Online Store"),
    phone: String(body.phone || "0784 734 956"),
    whatsapp: String(body.whatsapp || "250784734956"),
    deliveryText: String(body.deliveryText || "Fast Kigali delivery"),
    announcement: String(body.announcement || "WhatsApp ordering available"),
    supportText: String(body.supportText || "WhatsApp Orders"),
    tiktok: String(body.tiktok || ""),
    instagram: String(body.instagram || ""),
    facebook: String(body.facebook || ""),
    flashTitle: String(body.flashTitle || "Flash Sales"),
    flashEnabled: body.flashEnabled === "on" || body.flashEnabled === true,
    flashSubtitle: String(body.flashSubtitle || "Limited time deals"),
    flashEndsAt: String(body.flashEndsAt || ""),
    flashLink: String(body.flashLink || "/products?sort=best-selling"),
    flashLinkLabel: String(body.flashLinkLabel || "See All"),
    flashBadgeText: String(body.flashBadgeText || "Flash deal"),
    flashStockText: String(body.flashStockText || "Deal available now"),
    flashDiscountPercent: Math.max(0, Number(body.flashDiscountPercent || 25) || 0),
    flashProductLimit: Math.min(12, Math.max(1, Number(body.flashProductLimit || 6) || 6)),
    flashProductSlugs: String(body.flashProductSlugs || ""),
    flashProductPrices: String(body.flashProductPrices || "{}"),
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
