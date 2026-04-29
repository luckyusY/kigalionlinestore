import crypto from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { adminUnauthorized, verifyAdminSession } from "@/lib/admin-auth";
import { getDb } from "@/lib/mongodb";
import { products } from "@/lib/products";

export const runtime = "nodejs";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function imageMimeType(filePath: string) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".png") return "image/png";
  if (extension === ".webp") return "image/webp";
  return "image/jpeg";
}

function signCloudinaryUpload(timestamp: number, apiSecret: string, publicId: string) {
  return crypto
    .createHash("sha1")
    .update(`folder=kigali-online-store&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
}

async function uploadStaticImage(imagePath: string, productSlug: string) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary is not configured.");
  }

  if (!imagePath.startsWith("/")) return imagePath;

  const localPath = path.join(process.cwd(), "public", imagePath);
  const file = await readFile(localPath);
  const timestamp = Math.round(Date.now() / 1000);
  const publicId = slugify(productSlug);

  const uploadData = new FormData();
  uploadData.set("file", `data:${imageMimeType(localPath)};base64,${file.toString("base64")}`);
  uploadData.set("folder", "kigali-online-store");
  uploadData.set("public_id", publicId);
  uploadData.set("api_key", apiKey);
  uploadData.set("timestamp", String(timestamp));
  uploadData.set("signature", signCloudinaryUpload(timestamp, apiSecret, publicId));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: uploadData,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.error?.message || `Could not upload ${imagePath}.`);
  }

  return String(result.secure_url);
}

export async function POST(request: NextRequest) {
  if (!verifyAdminSession(request)) return adminUnauthorized();

  const db = await getDb();
  const collection = db.collection("products");
  const imported: string[] = [];
  const failed: Array<{ slug: string; error: string }> = [];

  for (const product of products) {
    try {
      const existing = await collection.findOne<{ image?: string }>({ slug: product.slug });
      const cloudinaryImage = existing?.image?.includes("res.cloudinary.com")
        ? existing.image
        : await uploadStaticImage(product.image, product.slug);

      const now = new Date();
      await collection.updateOne(
        { slug: product.slug },
        {
          $set: {
            ...product,
            image: cloudinaryImage,
            images: [cloudinaryImage],
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true }
      );

      imported.push(product.slug);
    } catch (error) {
      failed.push({
        slug: product.slug,
        error: error instanceof Error ? error.message : "Import failed.",
      });
    }
  }

  return NextResponse.json({
    imported: imported.length,
    failed,
  });
}
