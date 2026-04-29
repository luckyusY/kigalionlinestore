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

type SiteSettings = {
  storeName: string;
  phone: string;
  whatsapp: string;
  deliveryText: string;
  announcement: string;
  supportText: string;
  tiktok: string;
  instagram: string;
  facebook: string;
};

declare global {
  interface Window {
    tinymce?: TinyMCE;
  }
}

const adminCategories = categories.filter((category) => category !== "All");

const defaultSettings: SiteSettings = {
  storeName: "Kigali Online Store",
  phone: "0784 734 956",
  whatsapp: "250784734956",
  deliveryText: "Fast Kigali delivery",
  announcement: "WhatsApp ordering available",
  supportText: "WhatsApp Orders",
  tiktok: "https://www.tiktok.com/@kigalionlinestore",
  instagram: "https://www.instagram.com/kigali_online_store/",
  facebook: "https://web.facebook.com/kigalionlinestore/",
};

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
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [savingSettings, setSavingSettings] = useState(false);

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

  const loadSettings = useCallback(async () => {
    if (!adminSecret) return;

    setError("");
    const response = await fetch("/api/admin/settings", {
      headers: authHeaders,
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Could not load site settings.");
      return;
    }

    setSettings({ ...defaultSettings, ...data.settings });
    setStatus("Loaded site settings from MongoDB.");
  }, [adminSecret, authHeaders]);

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!adminSecret) {
      setError("Enter the admin secret before saving settings.");
      return;
    }

    window.localStorage.setItem("kigali-admin-secret", adminSecret);
    setSavingSettings(true);
    setError("");
    setStatus("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    setSavingSettings(false);

    if (!response.ok) {
      setError(data.error || "Could not save site settings.");
      return;
    }

    setSettings({ ...defaultSettings, ...data.settings });
    setStatus("Saved site settings to MongoDB.");
  }

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
              Add products, upload product images, and manage core site settings.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={loadSettings}
              style={{ background: "#0f766e", color: "#fff", border: "none", borderRadius: 12, padding: "12px 18px", fontWeight: 800, cursor: "pointer" }}
            >
              Load Site Settings
            </button>
            <button
              type="button"
              onClick={loadRecentProducts}
              style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 12, padding: "12px 18px", fontWeight: 800, cursor: "pointer" }}
            >
              Load Recent Products
            </button>
          </div>
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

          <div className="admin-side-stack">
            <form onSubmit={saveSettings} className="admin-panel-card admin-settings">
              <h2>Site Settings</h2>
              <p>Save storefront text, contact info, and social links to MongoDB.</p>

              <div className="admin-field admin-field-full">
                <label>Store Name</label>
                <input
                  name="storeName"
                  value={settings.storeName}
                  onChange={(event) => setSettings((current) => ({ ...current, storeName: event.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label>Phone</label>
                <input
                  name="phone"
                  value={settings.phone}
                  onChange={(event) => setSettings((current) => ({ ...current, phone: event.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label>WhatsApp Number</label>
                <input
                  name="whatsapp"
                  value={settings.whatsapp}
                  onChange={(event) => setSettings((current) => ({ ...current, whatsapp: event.target.value }))}
                />
              </div>
              <div className="admin-field admin-field-full">
                <label>Announcement</label>
                <input
                  name="announcement"
                  value={settings.announcement}
                  onChange={(event) => setSettings((current) => ({ ...current, announcement: event.target.value }))}
                />
              </div>
              <div className="admin-field admin-field-full">
                <label>Delivery Text</label>
                <input
                  name="deliveryText"
                  value={settings.deliveryText}
                  onChange={(event) => setSettings((current) => ({ ...current, deliveryText: event.target.value }))}
                />
              </div>
              <div className="admin-field admin-field-full">
                <label>Support Text</label>
                <input
                  name="supportText"
                  value={settings.supportText}
                  onChange={(event) => setSettings((current) => ({ ...current, supportText: event.target.value }))}
                />
              </div>
              <div className="admin-field admin-field-full">
                <label>TikTok</label>
                <input
                  name="tiktok"
                  value={settings.tiktok}
                  onChange={(event) => setSettings((current) => ({ ...current, tiktok: event.target.value }))}
                />
              </div>
              <div className="admin-field admin-field-full">
                <label>Instagram</label>
                <input
                  name="instagram"
                  value={settings.instagram}
                  onChange={(event) => setSettings((current) => ({ ...current, instagram: event.target.value }))}
                />
              </div>
              <div className="admin-field admin-field-full">
                <label>Facebook</label>
                <input
                  name="facebook"
                  value={settings.facebook}
                  onChange={(event) => setSettings((current) => ({ ...current, facebook: event.target.value }))}
                />
              </div>

              <button type="submit" className="admin-submit" disabled={savingSettings}>
                {savingSettings ? <Loader2 size={17} className="admin-spin" /> : <ShieldCheck size={17} />}
                {savingSettings ? "Saving Settings..." : "Save Site Settings"}
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
    </div>
  );
}
