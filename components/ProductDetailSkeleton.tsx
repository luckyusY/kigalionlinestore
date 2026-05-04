import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="product-detail-page product-detail-skeleton" role="status" aria-live="polite" aria-label="Loading product">
      <div className="product-breadcrumb-wrap">
        <div className="product-breadcrumb">
          <div className="skeleton-line skeleton-line-short" />
        </div>
      </div>
      <div className="product-detail-shell">
        <div className="product-detail-card">
          <div className="product-media-panel">
            <div className="product-detail-img skeleton-box" />
          </div>
          <div className="product-detail-info skeleton-detail-info">
            <div className="skeleton-line skeleton-kicker" />
            <div className="skeleton-line skeleton-heading" />
            <div className="skeleton-line skeleton-heading small" />
            <div className="skeleton-price-panel">
              <div className="skeleton-line skeleton-line-price" />
              <div className="skeleton-line skeleton-line-short" />
            </div>
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-line-short" />
            <div className="skeleton-actions vertical">
              <div className="skeleton-pill wide" />
              <div className="skeleton-pill wide" />
              <div className="skeleton-pill wide" />
            </div>
          </div>
        </div>
        <section className="product-reviews-section">
          <div className="skeleton-section-heading">
            <div className="skeleton-line skeleton-heading small" />
            <div className="skeleton-line skeleton-line-short" />
          </div>
        </section>
        <ProductGridSkeleton count={4} />
      </div>
    </div>
  );
}
