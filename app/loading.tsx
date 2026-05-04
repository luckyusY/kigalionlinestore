import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="temu-page page-skeleton" role="status" aria-live="polite" aria-label="Loading page">
      <section className="skeleton-hero">
        <aside className="skeleton-side-menu">
          {Array.from({ length: 7 }, (_, index) => (
            <div key={index} className="skeleton-line" />
          ))}
        </aside>
        <div className="skeleton-hero-main">
          <div className="skeleton-line skeleton-kicker" />
          <div className="skeleton-line skeleton-heading" />
          <div className="skeleton-line skeleton-heading small" />
          <div className="skeleton-pill wide" />
        </div>
        <div className="skeleton-hero-product" />
      </section>

      <section className="skeleton-flash">
        <div className="skeleton-flash-header">
          <div className="skeleton-line skeleton-line-title" />
          <div className="skeleton-line skeleton-line-short" />
        </div>
        <div className="jumia-flash-row">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="skeleton-flash-card">
              <div className="skeleton-box skeleton-flash-image" />
              <div className="skeleton-line" />
              <div className="skeleton-line skeleton-line-short" />
            </div>
          ))}
        </div>
      </section>

      <div className="skeleton-section-heading">
        <div className="skeleton-line skeleton-heading small" />
        <div className="skeleton-line skeleton-line-short" />
      </div>
      <ProductGridSkeleton count={12} />
    </div>
  );
}
