import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;
  return Boolean(adminSecret && request.headers.get("x-admin-secret") === adminSecret);
}

function signCloudinaryUpload(timestamp: number, apiSecret: string) {
  return crypto
    .createHash("sha1")
    .update(`folder=kigali-online-store&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Image file is required." }, { status: 400 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const uploadData = new FormData();
  uploadData.set("file", file);
  uploadData.set("folder", "kigali-online-store");
  uploadData.set("api_key", apiKey);
  uploadData.set("timestamp", String(timestamp));
  uploadData.set("signature", signCloudinaryUpload(timestamp, apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: uploadData,
  });

  const result = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: result?.error?.message || "Cloudinary upload failed." },
      { status: response.status }
    );
  }

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
  });
}
