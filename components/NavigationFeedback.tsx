"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

function isInternalUrl(url: URL) {
  return url.origin === window.location.origin;
}

export default function NavigationFeedback() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = window.setTimeout(() => {
      setLoading(false);
      timeoutRef.current = null;
    }, 0);
  }, [pathname, searchParams]);

  useEffect(() => {
    const startLoading = () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setLoading(true);
      timeoutRef.current = window.setTimeout(() => setLoading(false), 8000);
    };

    const handleClick = (event: MouseEvent) => {
      if (isModifiedClick(event)) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const url = new URL(href, window.location.href);
      if (!isInternalUrl(url)) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      startLoading();
    };

    const handleSubmit = (event: SubmitEvent) => {
      const target = event.target;
      if (target instanceof HTMLFormElement) startLoading();
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("submit", handleSubmit, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("submit", handleSubmit, true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className={`route-loading ${loading ? "is-active" : ""}`} aria-live="polite" aria-atomic="true">
      <div className="route-loading-bar" />
      <div className="route-loading-pill">
        <span />
        Loading...
      </div>
    </div>
  );
}
