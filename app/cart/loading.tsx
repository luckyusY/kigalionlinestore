export default function Loading() {
  return (
    <div className="cart-page page-skeleton" role="status" aria-live="polite" aria-label="Loading cart">
      <div className="cart-shell">
        <div className="cart-heading">
          <div>
            <div className="skeleton-line skeleton-heading small" />
            <div className="skeleton-line skeleton-line-short" />
          </div>
        </div>
        <section className="cart-grid">
          <div className="cart-items skeleton-panel" />
          <aside className="cart-summary skeleton-panel" />
        </section>
      </div>
    </div>
  );
}
