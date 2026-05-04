import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="temu-page page-skeleton" role="status" aria-live="polite" aria-label="Loading products">
      <section className="temu-feed-header skeleton-feed-header">
        <div>
          <div className="skeleton-line skeleton-heading small" />
          <div className="skeleton-line skeleton-line-short" />
        </div>
        <div className="skeleton-pill wide" />
      </section>
      <div className="skeleton-category-row">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="skeleton-pill" />
        ))}
      </div>
      <ProductGridSkeleton count={18} />
    </div>
  );
}
