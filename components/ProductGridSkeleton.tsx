export default function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <section className="temu-product-grid skeleton-product-grid" aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-product-card">
          <div className="skeleton-box skeleton-product-image" />
          <div className="skeleton-product-body">
            <div className="skeleton-line skeleton-line-title" />
            <div className="skeleton-line skeleton-line-short" />
            <div className="skeleton-line skeleton-line-price" />
            <div className="skeleton-actions">
              <div className="skeleton-pill" />
              <div className="skeleton-pill" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
