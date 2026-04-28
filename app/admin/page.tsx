"use client";

/* eslint-disable @next/next/no-img-element */

import Script from "next/script";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  CloudUpload,
  ImagePlus,
  KeyRound,
  Loader2,
  PackagePlus,
  ShieldCheck,
} from "lucide-react";
import { categories } from "@/lib/products";

type TinyEditor = {
  getContent: (options?: { format?: string }) => string;
  remove: () => void;
};

type TinyMCE = {
  init: (options: Record<string, unknown>) => Promise<TinyEditor[]>;
  get: (id: string) => TinyEditor | null;
};

type AdminProduct = {
  id: string;
  name: string;
  category: string;
  priceDisplay: string;
  image: string;
  createdAt?: string;
};

declare global {
  interface Window {
    tinymce?: TinyMCE;
  }
}

const adminCategories = categories.filter((category) => category !== "All");

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminPage() {
  const [adminSecret, setAdminSecret] = useState(() =>
    typeof window !== "undefined" ? window.localStorage.getItem("kigali-admin-secret") || "" : ""
  );
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [recentProducts, setRecentProducts] = useState<AdminProduct[]>([]);

  const tinymceApiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key";
  const canUseEditor = tinymceApiKey !== "no-api-key";

  useEffect(() => {
    if (!editorLoaded || !window.tinymce?.init || window.tinymce.get("admin-description")) {
      return;
    }

    void window.tinymce.init({
      selector: "#admin-description",
      height: 260,
      menubar: false,
      branding: false,
      plugins: "lists link table code wordcount",
      toolbar:
        "undo redo | blocks | bold italic underline | bullist numlist | link table | removeformat code",
      content_style:
        "body { font-family: Inter, Arial, sans-serif; font-size: 14px; color: #111827; }",
    });

    return () => {
      window.tinymce?.get("admin-description")?.remove();
    };
  }, [editorLoaded]);

  const authHeaders = useMemo(
    () => ({
      "x-admin-secret": adminSecret,
    }),
    [adminSecret]
  );

  const loadRecentProducts = useCallback(async () => {
    if (!adminSecret) return;

    setError("");
    const response = await fetch("/api/admin/products", {
      headers: authHeaders,
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not load products.");
      return;
    }

    setRecentProducts(data.products || []);
  }, [adminSecret, authHeaders]);

  async function uploadImage(file: File) {
    if (!adminSecret) {
      setError("Enter the admin secret before uploading.");
      return;
    }

    setUploading(true);
    setError("");
    setStatus("");

    const formData = new FormData();
    formData.set("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      headers: authHeaders,
      body: formData,
    });
    const data = await response.json();

    setUploading(false);

    if (!response.ok) {
      setError(data.error || "Upload failed.");
      return;
    }

    setImageUrl(data.url);
    setStatus("Image uploaded to Cloudinary.");
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminSecret) {
      setError("Enter the admin secret before saving.");
      return;
    }

    window.localStorage.setItem("kigali-admin-secret", adminSecret);
    setSaving(true);
    setError("");
    setStatus("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") || "");
    const description =
      window.tinymce?.get("admin-description")?.getContent({ format: "html" }) ||
      String(formData.get("description") || "");
    const priceValue = String(formData.get("price") || "").trim();

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        slug: String(formData.get("slug") || "") || slugify(name),
        description,
        price: priceValue ? Number(priceValue) : null,
        priceDisplay: String(formData.get("priceDisplay") || ""),
        category: String(formData.get("category") || ""),
        image: imageUrl || String(formData.get("image") || ""),
        inStock: formData.get("inStock") === "on",
        featured: formData.get("featured") === "on",
      }),
    });
    const data = await response.json();

    setSaving(false);

    if (!response.ok) {
      setError(data.error || "Could not save product.");
      return;
    }

    setStatus(`Saved ${data.product.name} to MongoDB.`);
    form.reset();
    setImageUrl("");
    window.tinymce?.get("admin-description")?.remove();
    setEditorLoaded(false);
    window.setTimeout(() => setEditorLoaded(Boolean(window.tinymce)), 0);
    await loadRecentProducts();
  }

  return (
    <div style={{ background: "#f8fafc", minHeight: "80vh", padding: "28px 20px 64px" }}>
      {canUseEditor && (
        <Script
          src={`https://cdn.tiny.cloud/1/${tinymceApiKey}/tinymce/7/tinymce.min.js`}
          referrerPolicy="origin"
          onLoad={() => setEditorLoaded(true)}
        />
      )}

      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
          <div>
            <div className="section-label" style={{ display: "inline-flex" }}>
              <ShieldCheck size={12} strokeWidth={2.5} /> Admin
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: "#111827", letterSpacing: "-0.03em" }}>
              Product Admin Panel
            </h1>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>
              Add store products, upload product images, and save listings to MongoDB.
            </p>
          </div>
          <button
            type="button"
            onClick={loadRecentProducts}
            style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 12, padding: "12px 18px", fontWeight: 800, cursor: "pointer" }}
          >
            Load Recent Products
          </button>
        </div>

        <div className="admin-grid">
          <form onSubmit={saveProduct} className="admin-panel-card">
            <div className="admin-field admin-field-full">
              <label>
                <KeyRound size={14} /> Admin Secret
              </label>
              <input
                type="password"
                value={adminSecret}
                onChange={(event) => setAdminSecret(event.target.value)}
                placeholder="Enter ADMIN_SECRET"
                autoComplete="current-password"
              />
            </div>

            <div className="admin-field">
              <label>Product Name</label>
              <input name="name" placeholder="Silver Crest Air Fryer" required />
            </div>

            <div className="admin-field">
              <label>Slug</label>
              <input name="slug" placeholder="silver-crest-air-fryer" />
            </div>

            <div className="admin-field">
              <label>Category</label>
              <select name="category" defaultValue="Kitchen" required>
                {adminCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label>Numeric Price</label>
              <input name="price" type="number" min="0" placeholder="90000" />
            </div>

            <div className="admin-field admin-field-full">
              <label>Displayed Price</label>
              <input name="priceDisplay" placeholder="90,000 RWF" required />
            </div>

            <div className="admin-field admin-field-full">
              <label>Description</label>
              <textarea
                id="admin-description"
                name="description"
                placeholder="Write product details here..."
                rows={8}
                required
              />
              {!canUseEditor && (
                <p className="admin-hint">TinyMCE key is missing, so the plain editor is shown.</p>
              )}
            </div>

            <div className="admin-field admin-field-full">
              <label>
                <ImagePlus size={14} /> Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadImage(file);
                }}
              />
              <input
                name="image"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="Cloudinary URL or existing image path"
                required
              />
              {imageUrl && <img src={imageUrl} alt="Uploaded product preview" className="admin-image-preview" />}
            </div>

            <div className="admin-checks">
              <label>
                <input name="inStock" type="checkbox" defaultChecked /> In stock
              </label>
              <label>
                <input name="featured" type="checkbox" /> Featured
              </label>
            </div>

            {error && <div className="admin-alert admin-alert-error">{error}</div>}
            {status && <div className="admin-alert admin-alert-success">{status}</div>}

            <button type="submit" className="admin-submit" disabled={saving || uploading}>
              {saving || uploading ? (
                <Loader2 size={17} className="admin-spin" />
              ) : uploading ? (
                <CloudUpload size={17} />
              ) : (
                <PackagePlus size={17} />
              )}
              {uploading ? "Uploading..." : saving ? "Saving..." : "Save Product"}
            </button>
          </form>

          <aside className="admin-panel-card admin-recent">
            <h2>Recent MongoDB Products</h2>
            <p>Products created through this panel will appear here after loading.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {recentProducts.length === 0 ? (
                <div className="admin-empty">No products loaded yet.</div>
              ) : (
                recentProducts.map((product) => (
                  <div key={product.id} className="admin-product-row">
                    <img src={product.image} alt="" />
                    <div>
                      <strong>{product.name}</strong>
                      <span>{product.category} / {product.priceDisplay}</span>
                    </div>
                    <CheckCircle size={16} color="#16a34a" />
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
