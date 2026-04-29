"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import Script from "next/script";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  CheckCircle,
  CloudUpload,
  Database,
  Edit3,
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  LogOut,
  PackagePlus,
  RefreshCw,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  X,
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

type FullProduct = {
  id: string | number;
  slug: string;
  name: string;
  description: string;
  price: number | null;
  priceDisplay: string;
  category: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
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
  interface Window { tinymce?: TinyMCE; }
}

const adminCategories = categories.filter((c) => c !== "All");

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

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type AdminTab = "manage" | "add" | "settings";

export default function AdminPage() {
  // ── Auth ────────────────────────────────────────────────────────────
  const [checkingSession, setCheckingSession] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Restore server session on mount
  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data: { authenticated?: boolean }) => setIsLoggedIn(Boolean(data.authenticated)))
      .catch(() => {})
      .finally(() => setCheckingSession(false));
  }, []);

  async function login(e: FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const r = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      if (r.ok) {
        setIsLoggedIn(true);
        setLoginPassword("");
      } else {
        const data = await r.json() as { error?: string };
        setLoginError(data.error || "Invalid username or password.");
      }
    } catch {
      setLoginError("Could not connect. Try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" }).catch(() => {});
    setIsLoggedIn(false);
    setLoginPassword("");
  }

  // ── Admin state ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<AdminTab>("manage");

  // Add product
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Manage products
  const [allProducts, setAllProducts] = useState<FullProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FullProduct>>({});
  const [editImageUrl, setEditImageUrl] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingEdit, setUploadingEdit] = useState(false);
  const [productSearch, setProductSearch] = useState("");

  // Settings
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [savingSettings, setSavingSettings] = useState(false);

  // Feedback
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const tinymceApiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || "no-api-key";
  const canUseEditor = tinymceApiKey !== "no-api-key";

  useEffect(() => {
    if (!editorLoaded || !window.tinymce?.init || window.tinymce.get("admin-description")) return;
    void window.tinymce.init({
      selector: "#admin-description",
      height: 260,
      menubar: false,
      branding: false,
      plugins: "lists link table code wordcount",
      toolbar: "undo redo | blocks | bold italic underline | bullist numlist | link table | removeformat code",
      content_style: "body { font-family: Inter, Arial, sans-serif; font-size: 14px; color: #111827; }",
    });
    return () => { window.tinymce?.get("admin-description")?.remove(); };
  }, [editorLoaded]);

  const loadAllProducts = useCallback(async () => {
    setProductsLoading(true);
    setError("");
    try {
      const r = await fetch("/api/products");
      const data = await r.json() as { products?: FullProduct[] };
      setAllProducts(data.products ?? []);
    } catch {
      setError("Could not load products.");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || activeTab !== "manage") return;
    const timer = window.setTimeout(() => void loadAllProducts(), 0);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn, activeTab, loadAllProducts]);

  const loadSettings = useCallback(async () => {
    const r = await fetch("/api/admin/settings");
    const data = await r.json() as { settings?: Partial<SiteSettings>; error?: string };
    if (!r.ok) { setError(data.error ?? "Could not load settings."); return; }
    setSettings({ ...defaultSettings, ...data.settings });
  }, []);

  useEffect(() => {
    if (!isLoggedIn || activeTab !== "settings") return;
    const timer = window.setTimeout(() => void loadSettings(), 0);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn, activeTab, loadSettings]);

  async function doUpload(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.set("file", file);
    try {
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await r.json() as { url?: string; error?: string };
      if (!r.ok) { setError(data.error ?? "Upload failed."); return null; }
      return data.url ?? null;
    } catch {
      setError("Upload failed — check Cloudinary config.");
      return null;
    }
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setStatus("");
    const form = event.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "");
    const description =
      window.tinymce?.get("admin-description")?.getContent({ format: "html" }) ||
      String(fd.get("description") ?? "");
    const priceVal = String(fd.get("price") ?? "").trim();

    try {
      const r = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: String(fd.get("slug") ?? "") || slugify(name),
          description,
          price: priceVal ? Number(priceVal) : null,
          priceDisplay: String(fd.get("priceDisplay") ?? ""),
          category: String(fd.get("category") ?? ""),
          image: imageUrl || String(fd.get("image") ?? ""),
          inStock: fd.get("inStock") === "on",
          featured: fd.get("featured") === "on",
        }),
      });
      const data = await r.json() as { product?: { name: string }; error?: string };
      if (!r.ok) { setError(data.error ?? "Could not save product."); return; }
      setStatus(`Saved "${data.product?.name}". Switch to All Products to see it.`);
      form.reset();
      setImageUrl("");
      window.tinymce?.get("admin-description")?.remove();
      setEditorLoaded(false);
      window.setTimeout(() => setEditorLoaded(Boolean(window.tinymce)), 0);
    } catch {
      setError("Save failed — check your connection.");
    } finally {
      setSaving(false);
    }
  }

  function startEdit(product: FullProduct) {
    setEditingId(String(product.id));
    setEditImageUrl(product.image);
    setEditForm({
      name: product.name,
      priceDisplay: product.priceDisplay,
      price: product.price,
      category: product.category,
      description: product.description,
      inStock: product.inStock,
      featured: Boolean(product.featured),
    });
    setError("");
    setStatus("");
  }

  async function saveEdit(product: FullProduct) {
    setSavingEdit(true);
    setError("");
    const isStatic = typeof product.id === "number";
    const payload = { ...editForm, image: editImageUrl || product.image };

    try {
      const r = isStatic
        ? await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, slug: product.slug }),
          })
        : await fetch(`/api/admin/products/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      const data = await r.json() as { error?: string };
      if (!r.ok) { setError(data.error ?? "Could not save changes."); return; }
      setStatus("Product saved successfully.");
      setEditingId(null);
      await loadAllProducts();
    } catch {
      setError("Save failed — check your connection.");
    } finally {
      setSavingEdit(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!window.confirm("Delete this product permanently?")) return;
    setError("");
    try {
      const r = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await r.json() as { error?: string };
      if (!r.ok) { setError(data.error ?? "Failed to delete."); return; }
      setStatus("Product deleted.");
      setAllProducts((prev) => prev.filter((p) => String(p.id) !== id));
      if (editingId === id) setEditingId(null);
    } catch {
      setError("Delete failed — check your connection.");
    }
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingSettings(true);
    setError("");
    setStatus("");
    const fd = new FormData(event.currentTarget);
    try {
      const r = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fd.entries())),
      });
      const data = await r.json() as { settings?: Partial<SiteSettings>; error?: string };
      if (!r.ok) { setError(data.error ?? "Could not save settings."); return; }
      setSettings({ ...defaultSettings, ...data.settings });
      setStatus("Site settings saved.");
    } catch {
      setError("Save failed — check your connection.");
    } finally {
      setSavingSettings(false);
    }
  }

  const filtered = allProducts.filter((p) => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  // ── Loading session check ───────────────────────────────────────────
  if (checkingSession) {
    return (
      <div style={{ display: "flex", minHeight: "70vh", alignItems: "center", justifyContent: "center" }}>
        <Loader2 size={28} className="admin-spin" color="#f97316" />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // LOGIN FORM
  // ══════════════════════════════════════════════════════════════════════
  if (!isLoggedIn) {
    return (
      <div style={{ display: "flex", minHeight: "80vh", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: 24 }}>
        <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: "#fff7ed", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <ShieldCheck size={28} color="#f97316" strokeWidth={2} />
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: "#111827", margin: "0 0 6px" }}>Admin Login</h1>
            <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>Kigali Online Store</p>
          </div>

          <form onSubmit={login}>
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#374151", marginBottom: 7 }}>
              Username
            </label>
            <input
              type="text"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              placeholder="admin"
              required
              autoFocus
              autoComplete="username"
              style={{
                width: "100%", boxSizing: "border-box",
                border: "1.5px solid #e5e7eb", borderRadius: 10,
                padding: "12px 14px", fontSize: 14, marginBottom: 14,
                outline: "none", fontFamily: "inherit",
              }}
            />
            <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#374151", marginBottom: 7 }}>
              Password
            </label>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <input
                type={showPassword ? "text" : "password"}
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your admin password"
                required
                autoComplete="current-password"
                style={{
                  width: "100%", boxSizing: "border-box",
                  border: "1.5px solid #e5e7eb", borderRadius: 10,
                  padding: "12px 44px 12px 14px", fontSize: 14,
                  outline: "none", fontFamily: "inherit",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute", top: "50%", right: 8, transform: "translateY(-50%)",
                  width: 34, height: 34, border: "none", borderRadius: 8,
                  background: "transparent", color: "#64748b", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {loginError && (
              <div style={{ color: "#b91c1c", fontSize: 13, marginBottom: 14, padding: "9px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8 }}>
                {loginError}
              </div>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              style={{
                width: "100%", background: loginLoading ? "#fb923c" : "#f97316", color: "#fff",
                border: "none", borderRadius: 10, padding: "13px",
                fontWeight: 800, fontSize: 15, cursor: loginLoading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loginLoading ? <Loader2 size={17} className="admin-spin" /> : <ShieldCheck size={17} />}
              {loginLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <Link href="/" style={{ display: "block", textAlign: "center", marginTop: 22, color: "#94a3b8", fontSize: 13, textDecoration: "none" }}>
            ← Back to store
          </Link>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════
  // ADMIN PANEL
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div style={{ background: "#f8fafc", minHeight: "80vh", padding: "28px 20px 64px" }}>
      {canUseEditor && (
        <Script
          src={`https://cdn.tiny.cloud/1/${tinymceApiKey}/tinymce/7/tinymce.min.js`}
          referrerPolicy="origin"
          onLoad={() => setEditorLoaded(true)}
        />
      )}

      <div style={{ maxWidth: 1240, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, gap: 12 }}>
          <div>
            <div className="section-label" style={{ display: "inline-flex" }}>
              <ShieldCheck size={12} strokeWidth={2.5} /> Admin
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#111827", letterSpacing: "-0.03em", margin: "4px 0 2px" }}>
              Store Admin
            </h1>
            <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>
              Manage products and site settings for Kigali Online Store.
            </p>
          </div>
          <button
            type="button"
            onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "9px 14px", fontWeight: 700, fontSize: 13, color: "#374151", cursor: "pointer", flexShrink: 0 }}
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>

        {/* ── Feedback ── */}
        {error && (
          <div className="admin-alert admin-alert-error" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ flex: 1 }}>{error}</span>
            <button type="button" onClick={() => setError("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit" }}><X size={14} /></button>
          </div>
        )}
        {status && !error && (
          <div className="admin-alert admin-alert-success" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle size={14} />
            <span style={{ flex: 1 }}>{status}</span>
            <button type="button" onClick={() => setStatus("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "inherit" }}><X size={14} /></button>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="admin-tab-bar">
          {(["manage", "add", "settings"] as AdminTab[]).map((tab) => {
            const meta = {
              manage:   { icon: <Database size={14} />,   label: "All Products" },
              add:      { icon: <PackagePlus size={14} />, label: "Add Product" },
              settings: { icon: <Settings2 size={14} />,  label: "Site Settings" },
            };
            return (
              <button
                key={tab}
                type="button"
                className={`admin-tab-btn${activeTab === tab ? " active" : ""}`}
                onClick={() => { setActiveTab(tab); setError(""); setStatus(""); }}
              >
                {meta[tab].icon} {meta[tab].label}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════
            Tab: All Products
        ══════════════════════════════════════════════════ */}
        {activeTab === "manage" && (
          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <input
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search by name or category…"
                style={{ flex: 1, minWidth: 200, border: "1.5px solid #e5e7eb", borderRadius: 10, padding: "9px 14px", fontSize: 14, outline: "none", background: "#fff" }}
              />
              <button
                type="button"
                onClick={() => void loadAllProducts()}
                disabled={productsLoading}
                style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <RefreshCw size={13} className={productsLoading ? "admin-spin" : ""} />
                {productsLoading ? "Loading…" : "Refresh"}
              </button>
            </div>

            {productsLoading && allProducts.length === 0 ? (
              <div className="admin-empty"><Loader2 size={20} className="admin-spin" style={{ display: "inline" }} /> Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="admin-empty">No products found.</div>
            ) : (
              <>
                <p style={{ color: "#94a3b8", fontSize: 12, fontWeight: 600, marginBottom: 10 }}>
                  {filtered.length} of {allProducts.length} products
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {filtered.map((product) => {
                    const isStatic = typeof product.id === "number";
                    const isEditing = editingId === String(product.id);

                    return (
                      <div key={product.id}>
                        {/* Product row */}
                        <div style={{
                          background: "#fff",
                          border: `1.5px solid ${isEditing ? "#f97316" : "#e5e7eb"}`,
                          borderRadius: isEditing ? "12px 12px 0 0" : 12,
                          padding: "11px 14px",
                          display: "flex", alignItems: "center", gap: 12,
                        }}>
                          <img
                            src={product.image}
                            alt=""
                            style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0, background: "#f1f5f9" }}
                            onError={(e) => { (e.currentTarget).style.background = "#f1f5f9"; (e.currentTarget).src = ""; }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {product.name}
                            </div>
                            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                              {product.category} · {product.priceDisplay}
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 5, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end", alignItems: "center" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 999, background: isStatic ? "#f1f5f9" : "#dbeafe", color: isStatic ? "#475569" : "#1e40af" }}>
                              {isStatic ? "Static" : "MongoDB"}
                            </span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 999, background: product.inStock ? "#dcfce7" : "#fee2e2", color: product.inStock ? "#15803d" : "#b91c1c" }}>
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </span>
                            {product.featured && (
                              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 999, background: "#fef3c7", color: "#92400e" }}>Featured</span>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                            <button
                              type="button"
                              onClick={() => (isEditing ? setEditingId(null) : startEdit(product))}
                              style={{ background: isEditing ? "#f97316" : "#f8fafc", color: isEditing ? "#fff" : "#374151", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "6px 11px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700 }}
                            >
                              {isEditing ? <X size={12} /> : <Edit3 size={12} />}
                              {isEditing ? "Close" : "Edit"}
                            </button>
                            {!isStatic && (
                              <button
                                type="button"
                                onClick={() => void deleteProduct(String(product.id))}
                                style={{ background: "#fef2f2", color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center" }}
                                title="Delete"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Inline edit panel */}
                        {isEditing && (
                          <div style={{ background: "#fff", border: "1.5px solid #f97316", borderTop: "1px solid #fed7aa", borderRadius: "0 0 12px 12px", padding: "20px 18px" }}>
                            {isStatic && (
                              <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#c2410c", marginBottom: 16, lineHeight: 1.5 }}>
                                This is a static product. Saving creates a MongoDB override that replaces it on the storefront.
                              </div>
                            )}
                            <div className="admin-panel-card" style={{ padding: 0, border: "none", boxShadow: "none" }}>
                              <div className="admin-field">
                                <label>Product Name</label>
                                <input value={editForm.name ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
                              </div>
                              <div className="admin-field">
                                <label>Category</label>
                                <select value={editForm.category ?? "Kitchen"} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}>
                                  {adminCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                              <div className="admin-field">
                                <label>Numeric Price</label>
                                <input type="number" value={editForm.price ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value ? Number(e.target.value) : null }))} />
                              </div>
                              <div className="admin-field">
                                <label>Displayed Price</label>
                                <input value={editForm.priceDisplay ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, priceDisplay: e.target.value }))} />
                              </div>
                              <div className="admin-field admin-field-full">
                                <label>Description</label>
                                <textarea rows={4} value={editForm.description ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} />
                              </div>
                              <div className="admin-field admin-field-full">
                                <label><ImagePlus size={13} /> Image</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setUploadingEdit(true);
                                    const url = await doUpload(file);
                                    setUploadingEdit(false);
                                    if (url) { setEditImageUrl(url); setStatus("Image uploaded to Cloudinary."); }
                                  }}
                                />
                                <input value={editImageUrl} onChange={(e) => setEditImageUrl(e.target.value)} placeholder="Cloudinary URL or path" />
                                {editImageUrl && <img src={editImageUrl} alt="Preview" className="admin-image-preview" />}
                                {uploadingEdit && <p className="admin-hint"><Loader2 size={12} className="admin-spin" style={{ display: "inline" }} /> Uploading to Cloudinary…</p>}
                              </div>
                              <div className="admin-checks admin-field-full">
                                <label>
                                  <input type="checkbox" checked={Boolean(editForm.inStock)} onChange={(e) => setEditForm((f) => ({ ...f, inStock: e.target.checked }))} />
                                  In Stock
                                </label>
                                <label>
                                  <input type="checkbox" checked={Boolean(editForm.featured)} onChange={(e) => setEditForm((f) => ({ ...f, featured: e.target.checked }))} />
                                  Featured
                                </label>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                              <button
                                type="button"
                                onClick={() => void saveEdit(product)}
                                disabled={savingEdit || uploadingEdit}
                                className="admin-submit"
                                style={{ flex: 1 }}
                              >
                                {savingEdit ? <Loader2 size={15} className="admin-spin" /> : uploadingEdit ? <CloudUpload size={15} /> : <Save size={15} />}
                                {uploadingEdit ? "Uploading…" : savingEdit ? "Saving…" : "Save Changes"}
                              </button>
                              <button type="button" onClick={() => setEditingId(null)} style={{ padding: "10px 18px", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            Tab: Add Product
        ══════════════════════════════════════════════════ */}
        {activeTab === "add" && (
          <form onSubmit={saveProduct} className="admin-panel-card">
            <div className="admin-field admin-field-full">
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
                {adminCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label>Numeric Price</label>
              <input name="price" type="number" min="0" placeholder="90000" />
            </div>
            <div className="admin-field">
              <label>Displayed Price</label>
              <input name="priceDisplay" placeholder="90,000 RWF" required />
            </div>
            <div className="admin-field admin-field-full">
              <label>Description</label>
              <textarea id="admin-description" name="description" placeholder="Write product details here…" rows={8} required />
              {!canUseEditor && <p className="admin-hint">TinyMCE key missing — plain textarea shown.</p>}
            </div>
            <div className="admin-field admin-field-full">
              <label><ImagePlus size={14} /> Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploading(true);
                  doUpload(file).then((url) => {
                    setUploading(false);
                    if (url) { setImageUrl(url); setStatus("Image uploaded to Cloudinary."); }
                  }).catch(() => setUploading(false));
                }}
              />
              <input name="image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Cloudinary URL or existing image path" required />
              {imageUrl && <img src={imageUrl} alt="Preview" className="admin-image-preview" />}
              {uploading && <p className="admin-hint"><Loader2 size={12} className="admin-spin" style={{ display: "inline" }} /> Uploading to Cloudinary…</p>}
            </div>
            <div className="admin-checks admin-field-full">
              <label><input name="inStock" type="checkbox" defaultChecked /> In Stock</label>
              <label><input name="featured" type="checkbox" /> Featured</label>
            </div>
            <div className="admin-field-full">
              <button type="submit" className="admin-submit" disabled={saving || uploading}>
                {saving ? <Loader2 size={17} className="admin-spin" /> : uploading ? <CloudUpload size={17} /> : <PackagePlus size={17} />}
                {uploading ? "Uploading…" : saving ? "Saving…" : "Save Product"}
              </button>
            </div>
          </form>
        )}

        {/* ══════════════════════════════════════════════════
            Tab: Site Settings
        ══════════════════════════════════════════════════ */}
        {activeTab === "settings" && (
          <form onSubmit={saveSettings} className="admin-panel-card admin-settings">
            <div className="admin-field admin-field-full">
              <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Changes are saved to MongoDB and take effect on the next storefront load.</p>
            </div>
            <div className="admin-field admin-field-full">
              <label>Store Name</label>
              <input name="storeName" value={settings.storeName} onChange={(e) => setSettings((s) => ({ ...s, storeName: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>Phone</label>
              <input name="phone" value={settings.phone} onChange={(e) => setSettings((s) => ({ ...s, phone: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>WhatsApp Number</label>
              <input name="whatsapp" value={settings.whatsapp} onChange={(e) => setSettings((s) => ({ ...s, whatsapp: e.target.value }))} />
            </div>
            <div className="admin-field admin-field-full">
              <label>Announcement</label>
              <input name="announcement" value={settings.announcement} onChange={(e) => setSettings((s) => ({ ...s, announcement: e.target.value }))} />
            </div>
            <div className="admin-field admin-field-full">
              <label>Delivery Text</label>
              <input name="deliveryText" value={settings.deliveryText} onChange={(e) => setSettings((s) => ({ ...s, deliveryText: e.target.value }))} />
            </div>
            <div className="admin-field admin-field-full">
              <label>Support Text</label>
              <input name="supportText" value={settings.supportText} onChange={(e) => setSettings((s) => ({ ...s, supportText: e.target.value }))} />
            </div>
            <div className="admin-field admin-field-full">
              <label>TikTok URL</label>
              <input name="tiktok" value={settings.tiktok} onChange={(e) => setSettings((s) => ({ ...s, tiktok: e.target.value }))} />
            </div>
            <div className="admin-field admin-field-full">
              <label>Instagram URL</label>
              <input name="instagram" value={settings.instagram} onChange={(e) => setSettings((s) => ({ ...s, instagram: e.target.value }))} />
            </div>
            <div className="admin-field admin-field-full">
              <label>Facebook URL</label>
              <input name="facebook" value={settings.facebook} onChange={(e) => setSettings((s) => ({ ...s, facebook: e.target.value }))} />
            </div>
            <div className="admin-field-full">
              <button type="submit" className="admin-submit" disabled={savingSettings}>
                {savingSettings ? <Loader2 size={17} className="admin-spin" /> : <ShieldCheck size={17} />}
                {savingSettings ? "Saving…" : "Save Site Settings"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
