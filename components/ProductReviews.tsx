"use client";

import { FormEvent, useState } from "react";
import { Send, Star } from "lucide-react";
import type { ProductReview, ReviewSummary } from "@/lib/reviews";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function RatingStars({ rating, label }: { rating: number; label?: string }) {
  return (
    <span className="review-stars" aria-label={label ?? `${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < Math.round(rating);
        return <Star key={index} size={15} fill={filled ? "#f59e0b" : "transparent"} strokeWidth={2.2} />;
      })}
    </span>
  );
}

export default function ProductReviews({
  productSlug,
  initialSummary,
}: {
  productSlug: string;
  initialSummary: ReviewSummary;
}) {
  const [summary, setSummary] = useState(initialSummary);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  const ratingLabel = summary.reviewCount
    ? `${summary.averageRating.toFixed(1)} from ${summary.reviewCount} review${summary.reviewCount === 1 ? "" : "s"}`
    : "No reviews yet";

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const response = await fetch(`/api/products/${encodeURIComponent(productSlug)}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, rating, comment }),
    });
    const data = await response.json();

    if (!response.ok) {
      setStatus("error");
      setMessage(data.error ?? "Could not save your review.");
      return;
    }

    setSummary(data);
    setName("");
    setRating(5);
    setComment("");
    setStatus("saved");
    setMessage("Thanks, your review has been added.");
  }

  return (
    <section className="product-reviews-section" id="reviews">
      <div className="product-reviews-heading">
        <div>
          <div className="section-label" style={{ display: "inline-flex" }}>Customer reviews</div>
          <h2>Reviews from shoppers</h2>
        </div>
        <div className="review-summary-card">
          <strong>{summary.reviewCount ? summary.averageRating.toFixed(1) : "0.0"}</strong>
          <RatingStars rating={summary.averageRating} label={ratingLabel} />
          <span>{ratingLabel}</span>
        </div>
      </div>

      <div className="product-reviews-grid">
        <form className="review-form" onSubmit={submitReview}>
          <h3>Write a review</h3>

          <label>
            Your name
            <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required />
          </label>

          <fieldset>
            <legend>Your rating</legend>
            <div className="review-rating-control">
              {Array.from({ length: 5 }, (_, index) => {
                const value = index + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    className={value <= rating ? "active" : ""}
                    onClick={() => setRating(value)}
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  >
                    <Star size={21} fill={value <= rating ? "#f59e0b" : "transparent"} />
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label>
            Review
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={900}
              minLength={8}
              rows={5}
              required
            />
          </label>

          <button type="submit" disabled={status === "saving"}>
            <Send size={16} />
            {status === "saving" ? "Submitting..." : "Submit review"}
          </button>
          {message && <p className={status === "error" ? "review-error" : "review-success"}>{message}</p>}
        </form>

        <div className="review-list">
          {summary.reviews.length ? (
            summary.reviews.map((review: ProductReview) => (
              <article key={review.id || `${review.name}-${review.createdAt}`} className="review-card">
                <div>
                  <strong>{review.name}</strong>
                  <span>{formatDate(review.createdAt)}</span>
                </div>
                <RatingStars rating={review.rating} />
                <p>{review.comment}</p>
              </article>
            ))
          ) : (
            <div className="review-empty">
              <strong>No reviews yet</strong>
              <p>Be the first shopper to share what you think about this product.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
