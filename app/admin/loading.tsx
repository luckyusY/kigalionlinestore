export default function Loading() {
  return (
    <div className="page-skeleton admin-loading" role="status" aria-live="polite" aria-label="Loading admin">
      <div className="skeleton-line skeleton-heading small" />
      <div className="skeleton-category-row">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="skeleton-pill" />
        ))}
      </div>
      <div className="skeleton-panel" />
    </div>
  );
}
