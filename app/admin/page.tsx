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
  Images,
  Loader2,
  LogOut,
  PackagePlus,
  Plus,
  RefreshCw,
  Save,
  Settings2,
  ShieldCheck,
  Star,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { categories } from "@/lib/products";
import { type HeroSlide, heroSlides as defaultHeroSlides } from "@/lib/hero-slides";

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
  images?: string[];
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
  flashTitle: string;
  flashEnabled: boolean;
  flashEndsAt: string;
  flashLink: string;
  flashProductSlugs: string;
};

type AdminReview = {
  id: string;
  productSlug: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
};

type PopularProduct = FullProduct & {
  viewCount?: number;
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
  flashTitle: "Flash Sales",
  flashEnabled: true,
  flashEndsAt: "",
  flashLink: "/products?sort=best-selling",
  flashProductSlugs: "",
};

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function imageList(primary: string, images: string[]) {
  return Array.from(new Set([primary, ...images].map((image) => image.trim()).filter(Boolean)));
}

function formatRwfPrice(price: number | null | undefined) {
  return typeof price === "number" && Number.isFinite(price)
    ? `${price.toLocaleString("en-US")} RWF`
    : "Contact for price";
}

type AdminTab = "manage" | "add" | "hero" | "settings" | "reviews" | "popular";

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
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Manage products
  const [allProducts, setAllProducts] = useState<FullProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [importingStatic, setImportingStatic] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<FullProduct>>({});
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImageUrls, setEditImageUrls] = useState<string[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingEdit, setUploadingEdit] = useState(false);
  const [stockUpdatingId, setStockUpdatingId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");

  // Settings
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [flashProductSearch, setFlashProductSearch] = useState("");

  // Reviews
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  // Popular products
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);
  const [popularLoading, setPopularLoading] = useState(false);

  // Hero slides
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [heroLoading, setHeroLoading] = useState(false);
  const [savingHero, setSavingHero] = useState(false);
  const [heroUploadingField, setHeroUploadingField] = useState<string | null>(null);

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

  useEffect(() => {
    if (!editorLoaded || !editingId || !window.tinymce?.init || window.tinymce.get("admin-edit-description")) return;

    void window.tinymce.init({
      selector: "#admin-edit-description",
      height: 240,
      menubar: false,
      branding: false,
      plugins: "lists link table code wordcount",
      toolbar: "undo redo | blocks | bold italic underline | bullist numlist | link table | removeformat code",
      content_style: "body { font-family: Inter, Arial, sans-serif; font-size: 14px; color: #111827; }",
    });

    return () => { window.tinymce?.get("admin-edit-description")?.remove(); };
  }, [editorLoaded, editingId]);

  const loadAllProducts = useCallback(async () => {
    setProductsLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/products");
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

  useEffect(() => {
    if (!isLoggedIn || activeTab !== "settings" || allProducts.length > 0) return;
    const timer = window.setTimeout(() => void loadAllProducts(), 0);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn, activeTab, allProducts.length, loadAllProducts]);

  const loadReviews = useCallback(async () => {
    setReviewsLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/reviews");
      const data = await r.json() as { reviews?: AdminReview[]; error?: string };
      if (!r.ok) { setError(data.error ?? "Could not load reviews."); return; }
      setReviews(data.reviews ?? []);
    } catch {
      setError("Could not load reviews.");
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || activeTab !== "reviews") return;
    const timer = window.setTimeout(() => void loadReviews(), 0);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn, activeTab, loadReviews]);

  const loadPopularProducts = useCallback(async () => {
    setPopularLoading(true);
    setError("");
    try {
      const r = await fetch("/api/admin/views");
      const data = await r.json() as { products?: PopularProduct[]; error?: string };
      if (!r.ok) { setError(data.error ?? "Could not load popular products."); return; }
      setPopularProducts(data.products ?? []);
    } catch {
      setError("Could not load popular products.");
    } finally {
      setPopularLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || activeTab !== "popular") return;
    const timer = window.setTimeout(() => void loadPopularProducts(), 0);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn, activeTab, loadPopularProducts]);

  const loadHeroSlides = useCallback(async () => {
    setHeroLoading(true);
    try {
      const r = await fetch("/api/admin/hero-slides");
      const data = await r.json() as { slides?: HeroSlide[] };
      setHeroSlides(data.slides ?? defaultHeroSlides);
    } catch {
      setError("Could not load hero slides.");
    } finally {
      setHeroLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn || activeTab !== "hero") return;
    const timer = window.setTimeout(() => void loadHeroSlides(), 0);
    return () => window.clearTimeout(timer);
  }, [isLoggedIn, activeTab, loadHeroSlides]);

  async function saveHeroSlides() {
    setSavingHero(true);
    setError("");
    setStatus("");
    try {
      const r = await fetch("/api/admin/hero-slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: heroSlides }),
      });
      const data = await r.json() as { error?: string };
      if (!r.ok) { setError(data.error ?? "Could not save hero slides."); return; }
      setStatus("Hero slides saved. They will appear on the storefront immediately.");
    } catch {
      setError("Save failed — check your connection.");
    } finally {
      setSavingHero(false);
    }
  }

  async function uploadHeroImage(file: File, slideIndex: number, field: keyof HeroSlide) {
    const fieldKey = `${slideIndex}-${String(field)}`;
    setHeroUploadingField(fieldKey);
    const url = await doUpload(file);
    if (url) {
      setHeroSlides((prev) => prev.map((slide, i) =>
        i === slideIndex ? { ...slide, [field]: url } : slide
      ));
    }
    setHeroUploadingField(null);
  }

  function updateHeroSlide(index: number, field: keyof HeroSlide, value: string) {
    setHeroSlides((prev) => prev.map((slide, i) =>
      i === index ? { ...slide, [field]: value } : slide
    ));
  }

  function addHeroSlide() {
    setHeroSlides((prev) => [
      ...prev,
      { image: "", title: "New Slide", price: "0 RWF", oldPrice: "0 RWF", link: "/products", accent: "Limited time offer" },
    ]);
  }

  function removeHeroSlide(index: number) {
    setHeroSlides((prev) => prev.filter((_, i) => i !== index));
  }

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

  async function uploadMany(files: FileList | null, onUploaded: (urls: string[]) => void) {
    if (!files?.length) return;

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const url = await doUpload(file);
      if (url) uploaded.push(url);
    }

    if (uploaded.length > 0) {
      onUploaded(uploaded);
      setStatus(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded to Cloudinary.`);
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
    const numericPrice = priceVal ? Number(priceVal) : null;

    try {
      const r = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug: String(fd.get("slug") ?? "") || slugify(name),
          description,
          price: numericPrice,
          priceDisplay: formatRwfPrice(numericPrice),
          category: String(fd.get("category") ?? ""),
          image: imageUrl || String(fd.get("image") ?? ""),
          images: imageList(imageUrl || String(fd.get("image") ?? ""), imageUrls),
          inStock: fd.get("inStock") === "on",
          featured: fd.get("featured") === "on",
        }),
      });
      const data = await r.json() as { product?: { name: string }; error?: string };
      if (!r.ok) { setError(data.error ?? "Could not save product."); return; }
      setStatus(`Saved "${data.product?.name}". Switch to All Products to see it.`);
      form.reset();
      setImageUrl("");
      setImageUrls([]);
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
    setPendingDeleteId(null);
    setEditImageUrl(product.image);
    setEditImageUrls(imageList(product.image, product.images ?? []));
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
    const editorDescription = window.tinymce
      ?.get("admin-edit-description")
      ?.getContent({ format: "html" });
    const payload = {
      ...editForm,
      description: editorDescription || editForm.description,
      priceDisplay: formatRwfPrice(editForm.price),
      image: editImageUrl || product.image,
      images: imageList(editImageUrl || product.image, editImageUrls),
    };

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

  async function toggleStock(product: FullProduct) {
    const productId = String(product.id);
    const nextInStock = !product.inStock;
    setStockUpdatingId(productId);
    setError("");
    setStatus("");

    try {
      const isStatic = typeof product.id === "number";
      const payload = {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        priceDisplay: product.priceDisplay,
        category: product.category,
        image: product.image,
        images: imageList(product.image, product.images ?? []),
        inStock: nextInStock,
        featured: Boolean(product.featured),
      };
      const r = isStatic
        ? await fetch("/api/admin/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/admin/products/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inStock: nextInStock }),
          });

      const data = await r.json() as { error?: string };
      if (!r.ok) { setError(data.error ?? "Could not update stock status."); return; }
      setStatus(nextInStock ? "Product is visible on the website again." : "Product hidden from the website until marked in stock.");
      setAllProducts((prev) => prev.map((item) =>
        String(item.id) === productId ? { ...item, inStock: nextInStock } : item
      ));
      if (editingId === productId) setEditForm((form) => ({ ...form, inStock: nextInStock }));
      await loadAllProducts();
    } catch {
      setError("Stock update failed — check your connection.");
    } finally {
      setStockUpdatingId(null);
    }
  }

  async function deleteProduct(id: string) {
    setError("");
    try {
      const r = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await r.json() as { error?: string };
      if (!r.ok) { setError(data.error ?? "Failed to delete."); return; }
      setStatus("Product deleted.");
      setAllProducts((prev) => prev.filter((p) => String(p.id) !== id));
      if (editingId === id) setEditingId(null);
      setPendingDeleteId(null);
    } catch {
      setError("Delete failed — check your connection.");
    }
  }

  async function importStaticProducts() {
    const confirmed = window.confirm(
      "Upload every static product image to Cloudinary and save all static products to MongoDB?"
    );
    if (!confirmed) return;

    setImportingStatic(true);
    setError("");
    setStatus("");

    try {
      const response = await fetch("/api/admin/products/import-static", { method: "POST" });
      const data = await response.json() as { imported?: number; skipped?: number; failed?: Array<{ slug: string; error: string }>; error?: string };

      if (!response.ok) {
        setError(data.error || "Could not import static products.");
        return;
      }

      const failedCount = data.failed?.length || 0;
      const skippedCount = data.skipped || 0;
      const parts: string[] = [`Imported ${data.imported || 0} static products`];
      if (skippedCount > 0) parts.push(`${skippedCount} previously deleted skipped`);
      if (failedCount > 0) parts.push(`${failedCount} failed`);
      setStatus(`${parts.join(" · ")}.`);
      await loadAllProducts();
    } catch {
      setError("Import failed. Check Cloudinary and MongoDB settings.");
    } finally {
      setImportingStatic(false);
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

  const flashSlugs = settings.flashProductSlugs
    .split(/[\n,]+/)
    .map((slug) => slug.trim())
    .filter(Boolean);
  const flashSlugSet = new Set(flashSlugs);
  const flashSearch = flashProductSearch.trim().toLowerCase();
  const selectedFlashProducts = flashSlugs
    .map((slug) => allProducts.find((product) => product.slug === slug))
    .filter((product): product is FullProduct => Boolean(product));
  const flashProductOptions = allProducts
    .filter((product) => {
      if (!flashSearch) return true;
      return (
        product.name.toLowerCase().includes(flashSearch) ||
        product.slug.toLowerCase().includes(flashSearch) ||
        product.category.toLowerCase().includes(flashSearch)
      );
    })
    .slice(0, 18);

  function updateFlashProducts(slugs: string[]) {
    setSettings((current) => ({ ...current, flashProductSlugs: slugs.join("\n") }));
  }

  function toggleFlashProduct(slug: string) {
    updateFlashProducts(
      flashSlugSet.has(slug)
        ? flashSlugs.filter((selectedSlug) => selectedSlug !== slug)
        : [...flashSlugs, slug]
    );
  }

  function formatDateTimeLocal(date: Date) {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
  }

  function setFlashEndsIn(hours: number) {
    setSettings((current) => ({
      ...current,
      flashEndsAt: formatDateTimeLocal(new Date(Date.now() + hours * 60 * 60 * 1000)),
    }));
  }

  async function deleteReview(id: string) {
    setDeletingReviewId(id);
    setError("");
    setStatus("");
    try {
      const r = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const data = await r.json() as { error?: string };
      if (!r.ok) { setError(data.error ?? "Could not delete review."); return; }
      setReviews((prev) => prev.filter((review) => review.id !== id));
      setStatus("Review deleted.");
    } catch {
      setError("Could not delete review.");
    } finally {
      setDeletingReviewId(null);
    }
  }

  function reviewDate(value: string) {
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
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
          {(["manage", "add", "hero", "settings", "reviews", "popular"] as AdminTab[]).map((tab) => {
            const meta = {
              manage:   { icon: <Database size={14} />,   label: "All Products" },
              add:      { icon: <PackagePlus size={14} />, label: "Add Product" },
              hero:     { icon: <Images size={14} />,      label: "Hero Slides" },
              settings: { icon: <Settings2 size={14} />,  label: "Site Settings" },
              reviews:  { icon: <Star size={14} />,       label: "Reviews" },
              popular:  { icon: <TrendingUp size={14} />,  label: "Popular" },
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
                disabled={productsLoading || importingStatic}
                style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <RefreshCw size={13} className={productsLoading ? "admin-spin" : ""} />
                {productsLoading ? "Loading…" : "Refresh"}
              </button>
              <button
                type="button"
                onClick={() => void importStaticProducts()}
                disabled={productsLoading || importingStatic}
                aria-label="Save static products to MongoDB"
                title="Save static products to MongoDB"
                style={{ background: "transparent", border: "none", padding: 4, cursor: importingStatic ? "wait" : "pointer", display: "flex", alignItems: "center", opacity: importingStatic ? 0.5 : 0.55, transition: "opacity 120ms" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = importingStatic ? "0.5" : "0.55"; }}
              >
                {importingStatic ? (
                  <Loader2 size={18} className="admin-spin" color="#0f766e" />
                ) : (
                  <img src="/kos-logo-full.svg" alt="" width={72} height={18} style={{ display: "block" }} />
                )}
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
                    const productId = String(product.id);
                    const isConfirmingDelete = pendingDeleteId === productId;

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
                              onClick={() => void toggleStock(product)}
                              disabled={stockUpdatingId === productId}
                              style={{
                                background: product.inStock ? "#fff7ed" : "#ecfdf5",
                                color: product.inStock ? "#c2410c" : "#047857",
                                border: `1.5px solid ${product.inStock ? "#fed7aa" : "#a7f3d0"}`,
                                borderRadius: 8,
                                padding: "6px 11px",
                                cursor: stockUpdatingId === productId ? "wait" : "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                fontSize: 12,
                                fontWeight: 800,
                              }}
                              title={product.inStock ? "Hide from website" : "Show on website"}
                            >
                              {stockUpdatingId === productId ? (
                                <Loader2 size={12} className="admin-spin" />
                              ) : product.inStock ? (
                                <EyeOff size={12} />
                              ) : (
                                <Eye size={12} />
                              )}
                              {product.inStock ? "Mark Out" : "Mark In"}
                            </button>
                            <button
                              type="button"
                              onClick={() => (isEditing ? setEditingId(null) : startEdit(product))}
                              style={{ background: isEditing ? "#f97316" : "#f8fafc", color: isEditing ? "#fff" : "#374151", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "6px 11px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700 }}
                            >
                              {isEditing ? <X size={12} /> : <Edit3 size={12} />}
                              {isEditing ? "Close" : "Edit"}
                            </button>
                            {!isStatic && (
                              isConfirmingDelete ? (
                                <div className="admin-delete-confirm">
                                  <span>Delete?</span>
                                  <button
                                    type="button"
                                    onClick={() => void deleteProduct(productId)}
                                    className="danger"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPendingDeleteId(null)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPendingDeleteId(productId);
                                    setEditingId(null);
                                  }}
                                  style={{ background: "#fef2f2", color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: 8, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 800 }}
                                  title="Delete"
                                >
                                  <Trash2 size={12} />
                                  Delete
                                </button>
                              )
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
                                <label>Price (RWF)</label>
                                <input type="number" value={editForm.price ?? ""} onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value ? Number(e.target.value) : null }))} />
                              </div>
                              <div className="admin-field">
                                <label>Customer Price Label</label>
                                <input value={formatRwfPrice(editForm.price)} readOnly />
                                <p className="admin-hint">Generated automatically from Price (RWF).</p>
                              </div>
                              <div className="admin-field admin-field-full">
                                <label>Description</label>
                                <textarea
                                  id="admin-edit-description"
                                  rows={6}
                                  value={editForm.description ?? ""}
                                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                                />
                                {!canUseEditor && <p className="admin-hint">TinyMCE key missing - plain textarea shown.</p>}
                              </div>
                              <div className="admin-field admin-field-full">
                                <label><ImagePlus size={13} /> Product Images</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={async (e) => {
                                    setUploadingEdit(true);
                                    await uploadMany(e.target.files, (urls) => {
                                      setEditImageUrl((current) => current || urls[0]);
                                      setEditImageUrls((current) => imageList(editImageUrl || urls[0], [...current, ...urls]));
                                    });
                                    setUploadingEdit(false);
                                  }}
                                />
                                <input
                                  value={editImageUrl}
                                  onChange={(e) => {
                                    setEditImageUrl(e.target.value);
                                    setEditImageUrls((current) => imageList(e.target.value, current));
                                  }}
                                  placeholder="Main image URL or path"
                                />
                                <textarea
                                  rows={3}
                                  value={editImageUrls.join("\n")}
                                  onChange={(e) => setEditImageUrls(e.target.value.split(/\r?\n/).map((image) => image.trim()).filter(Boolean))}
                                  placeholder="Extra image URLs, one per line"
                                />
                                {editImageUrls.length > 0 && (
                                  <div className="admin-gallery-preview">
                                    {editImageUrls.map((url) => (
                                      <div key={url} className="admin-gallery-thumb">
                                        <img src={url} alt="" />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const remaining = editImageUrls.filter((image) => image !== url);
                                            setEditImageUrls(remaining);
                                            if (editImageUrl === url) setEditImageUrl(remaining[0] || "");
                                          }}
                                          aria-label="Remove image"
                                        >
                                          <X size={13} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {uploadingEdit && <p className="admin-hint"><Loader2 size={12} className="admin-spin" style={{ display: "inline" }} /> Uploading to Cloudinary...</p>}
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
              <label>Price (RWF)</label>
              <input name="price" type="number" min="0" placeholder="90000" />
              <p className="admin-hint">Leave empty to show Contact for price. RWF is added automatically.</p>
            </div>
            <div className="admin-field admin-field-full">
              <label>Description</label>
              <textarea id="admin-description" name="description" placeholder="Write product details here…" rows={8} required />
              {!canUseEditor && <p className="admin-hint">TinyMCE key missing — plain textarea shown.</p>}
            </div>
            <div className="admin-field admin-field-full">
              <label><ImagePlus size={14} /> Product Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  setUploading(true);
                  uploadMany(e.target.files, (urls) => {
                    setImageUrl((current) => current || urls[0]);
                    setImageUrls((current) => imageList(imageUrl || urls[0], [...current, ...urls]));
                  }).then(() => {
                    setUploading(false);
                  }).catch(() => setUploading(false));
                }}
              />
              <input
                name="image"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setImageUrls((current) => imageList(e.target.value, current));
                }}
                placeholder="Main image URL or existing image path"
                required
              />
              <textarea
                rows={3}
                value={imageUrls.join("\n")}
                onChange={(e) => setImageUrls(e.target.value.split(/\r?\n/).map((image) => image.trim()).filter(Boolean))}
                placeholder="Extra image URLs, one per line"
              />
              {imageUrls.length > 0 && (
                <div className="admin-gallery-preview">
                  {imageUrls.map((url) => (
                    <div key={url} className="admin-gallery-thumb">
                      <img src={url} alt="" />
                      <button
                        type="button"
                        onClick={() => {
                          const remaining = imageUrls.filter((image) => image !== url);
                          setImageUrls(remaining);
                          if (imageUrl === url) setImageUrl(remaining[0] || "");
                        }}
                        aria-label="Remove image"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {uploading && <p className="admin-hint"><Loader2 size={12} className="admin-spin" style={{ display: "inline" }} /> Uploading to Cloudinary...</p>}
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
            Tab: Hero Slides
        ══════════════════════════════════════════════════ */}
        {activeTab === "hero" && (
          <div>
            <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
              Manage the carousel images on the homepage hero section. Upload your designed promotional posts for each slide.
            </p>

            {heroLoading ? (
              <div className="admin-empty"><Loader2 size={20} className="admin-spin" style={{ display: "inline" }} /> Loading slides…</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {heroSlides.map((slide, index) => {
                  const isUploading = (field: string) => heroUploadingField === `${index}-${field}`;

                  return (
                    <div key={index} style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 14, padding: "20px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>Slide {index + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeHeroSlide(index)}
                          style={{ background: "#fef2f2", color: "#ef4444", border: "1.5px solid #fecaca", borderRadius: 8, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700 }}
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>

                      {/* Image slot */}
                      <div style={{ marginBottom: 14 }}>
                        <label style={{ display: "block", fontWeight: 700, fontSize: 12, color: "#374151", marginBottom: 6 }}>
                          <ImagePlus size={11} style={{ display: "inline", marginRight: 4 }} />
                          Slide Image
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          {slide.image && (
                            <img
                              src={slide.image}
                              alt=""
                              style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1.5px solid #e5e7eb", flexShrink: 0 }}
                            />
                          )}
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 6, background: "#f8fafc", border: "1.5px dashed #cbd5e1", borderRadius: 8, padding: "9px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#475569" }}>
                              {isUploading("image") ? <Loader2 size={13} className="admin-spin" /> : <CloudUpload size={13} />}
                              {isUploading("image") ? "Uploading…" : "Upload your designed image"}
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) void uploadHeroImage(file, index, "image");
                                }}
                              />
                            </label>
                            <input
                              value={slide.image}
                              onChange={(e) => updateHeroSlide(index, "image", e.target.value)}
                              placeholder="Or paste image URL"
                              style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "8px 10px", fontSize: 12, outline: "none", width: "100%", boxSizing: "border-box" }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Text fields */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 6 }}>
                        <div className="admin-field" style={{ margin: 0 }}>
                          <label>Title</label>
                          <input value={slide.title} onChange={(e) => updateHeroSlide(index, "title", e.target.value)} placeholder="Product name" />
                        </div>
                        <div className="admin-field" style={{ margin: 0 }}>
                          <label>Accent line</label>
                          <input value={slide.accent} onChange={(e) => updateHeroSlide(index, "accent", e.target.value)} placeholder="Limited time offer" />
                        </div>
                        <div className="admin-field" style={{ margin: 0 }}>
                          <label>Price</label>
                          <input value={slide.price} onChange={(e) => updateHeroSlide(index, "price", e.target.value)} placeholder="65,000 RWF" />
                        </div>
                        <div className="admin-field" style={{ margin: 0 }}>
                          <label>Old Price (crossed out)</label>
                          <input value={slide.oldPrice} onChange={(e) => updateHeroSlide(index, "oldPrice", e.target.value)} placeholder="92,000 RWF" />
                        </div>
                        <div className="admin-field" style={{ margin: 0, gridColumn: "1 / -1" }}>
                          <label>Shop Now link</label>
                          <input value={slide.link} onChange={(e) => updateHeroSlide(index, "link", e.target.value)} placeholder="/products/product-slug" />
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addHeroSlide}
                  style={{ background: "#f8fafc", border: "2px dashed #cbd5e1", borderRadius: 14, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#64748b", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
                >
                  <Plus size={16} /> Add Slide
                </button>

                <button
                  type="button"
                  onClick={() => void saveHeroSlides()}
                  disabled={savingHero || heroUploadingField !== null}
                  className="admin-submit"
                >
                  {savingHero ? <Loader2 size={17} className="admin-spin" /> : <Save size={17} />}
                  {savingHero ? "Saving…" : "Save All Slides"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            Tab: Popular Products
        ══════════════════════════════════════════════════ */}
        {activeTab === "popular" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
              <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Products ranked by real customer views.</p>
              <button
                type="button"
                onClick={() => void loadPopularProducts()}
                disabled={popularLoading}
                style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <RefreshCw size={13} className={popularLoading ? "admin-spin" : ""} />
                {popularLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {popularLoading && popularProducts.length === 0 ? (
              <div className="admin-empty"><Loader2 size={20} className="admin-spin" style={{ display: "inline" }} /> Loading popular products...</div>
            ) : popularProducts.length === 0 ? (
              <div className="admin-empty">No product views recorded yet.</div>
            ) : (
              <div className="admin-popular-list">
                {popularProducts.map((product, index) => (
                  <article key={product.slug} className="admin-popular-row">
                    <span>#{index + 1}</span>
                    <img src={product.image} alt="" />
                    <div>
                      <strong>{product.name}</strong>
                      <small>{product.category} · {product.slug}</small>
                    </div>
                    <b>{(product.viewCount ?? 0).toLocaleString("en-US")} views</b>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            Tab: Reviews
        ══════════════════════════════════════════════════ */}
        {activeTab === "reviews" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
              <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>Manage customer reviews shown on product pages.</p>
              <button
                type="button"
                onClick={() => void loadReviews()}
                disabled={reviewsLoading}
                style={{ background: "#111827", color: "#fff", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <RefreshCw size={13} className={reviewsLoading ? "admin-spin" : ""} />
                {reviewsLoading ? "Loading..." : "Refresh"}
              </button>
            </div>

            {reviewsLoading && reviews.length === 0 ? (
              <div className="admin-empty"><Loader2 size={20} className="admin-spin" style={{ display: "inline" }} /> Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="admin-empty">No customer reviews yet.</div>
            ) : (
              <div className="admin-review-list">
                {reviews.map((review) => (
                  <article key={review.id} className="admin-review-card">
                    <div>
                      <strong>{review.name}</strong>
                      <span>{reviewDate(review.createdAt)} · {review.productSlug}</span>
                    </div>
                    <div className="admin-review-stars" aria-label={`${review.rating} stars`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} size={14} fill={index < review.rating ? "#f59e0b" : "transparent"} />
                      ))}
                    </div>
                    <p>{review.comment}</p>
                    <button
                      type="button"
                      onClick={() => void deleteReview(review.id)}
                      disabled={deletingReviewId === review.id}
                    >
                      {deletingReviewId === review.id ? <Loader2 size={13} className="admin-spin" /> : <Trash2 size={13} />}
                      Delete Review
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
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
            <div className="admin-field admin-field-full" style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
              <label>Flash Sales Section</label>
              <p style={{ color: "#64748b", fontSize: 12, margin: 0 }}>Control the homepage red flash-sales block, countdown, link, and which product slugs appear.</p>
            </div>
            <div className="admin-checks admin-field-full">
              <label>
                <input
                  name="flashEnabled"
                  type="checkbox"
                  checked={settings.flashEnabled}
                  onChange={(e) => setSettings((s) => ({ ...s, flashEnabled: e.target.checked }))}
                />
                Show Flash Sales on homepage
              </label>
            </div>
            <div className="admin-field">
              <label>Flash Title</label>
              <input name="flashTitle" value={settings.flashTitle} onChange={(e) => setSettings((s) => ({ ...s, flashTitle: e.target.value }))} />
            </div>
            <div className="admin-field">
              <label>Countdown Ends At</label>
              <input name="flashEndsAt" type="datetime-local" value={settings.flashEndsAt} onChange={(e) => setSettings((s) => ({ ...s, flashEndsAt: e.target.value }))} />
              <div className="admin-flash-quick-actions">
                <button type="button" onClick={() => setFlashEndsIn(12)}>12h</button>
                <button type="button" onClick={() => setFlashEndsIn(24)}>24h</button>
                <button type="button" onClick={() => setFlashEndsIn(72)}>3 days</button>
                <button type="button" onClick={() => setSettings((s) => ({ ...s, flashEndsAt: "" }))}>No timer</button>
              </div>
            </div>
            <div className="admin-field admin-field-full">
              <label>See All Link</label>
              <input name="flashLink" value={settings.flashLink} onChange={(e) => setSettings((s) => ({ ...s, flashLink: e.target.value }))} />
            </div>
            <div className="admin-field admin-field-full">
              <label>Flash Product Slugs</label>
              <textarea
                name="flashProductSlugs"
                rows={4}
                value={settings.flashProductSlugs}
                onChange={(e) => setSettings((s) => ({ ...s, flashProductSlugs: e.target.value }))}
                placeholder="mini-steppers&#10;air-fryer&#10;blender-8in1"
              />
              <p className="admin-hint">One slug per line, or separate with commas. Leave empty to use the first available products.</p>
            </div>
            <div className="admin-field admin-field-full">
              <label>Pick Flash Sale Products</label>
              <input
                type="search"
                value={flashProductSearch}
                onChange={(e) => setFlashProductSearch(e.target.value)}
                placeholder="Search product name, slug, or category"
              />
              {selectedFlashProducts.length > 0 ? (
                <div className="admin-flash-selected">
                  {selectedFlashProducts.map((product) => (
                    <button key={product.slug} type="button" onClick={() => toggleFlashProduct(product.slug)}>
                      <img src={product.image} alt="" />
                      <span>{product.name}</span>
                      <X size={13} />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="admin-hint">No flash products selected. The homepage will use the newest available products.</p>
              )}
              <div className="admin-flash-picker">
                {productsLoading ? (
                  <div className="admin-empty">Loading products...</div>
                ) : flashProductOptions.length > 0 ? (
                  flashProductOptions.map((product) => (
                    <button
                      key={product.slug}
                      type="button"
                      className={flashSlugSet.has(product.slug) ? "selected" : ""}
                      onClick={() => toggleFlashProduct(product.slug)}
                    >
                      <img src={product.image} alt="" />
                      <span>
                        <strong>{product.name}</strong>
                        <small>{product.priceDisplay} · {product.slug}</small>
                      </span>
                      {flashSlugSet.has(product.slug) ? <CheckCircle size={17} /> : <Plus size={17} />}
                    </button>
                  ))
                ) : (
                  <div className="admin-empty">No products match that search.</div>
                )}
              </div>
              <p className="admin-hint">Selected products appear first on the homepage Flash Sales row, in the order shown above.</p>
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
