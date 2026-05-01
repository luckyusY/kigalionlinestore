"use client";

import { useEffect } from "react";

export default function ProductViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `viewed-product-${slug}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
    fetch(`/api/products/${encodeURIComponent(slug)}/views`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
