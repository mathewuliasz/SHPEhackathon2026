"use client";

import { useState } from "react";
import type { StoredReview } from "@/lib/review-store";
import { ReviewForm } from "./ReviewForm";
import styles from "./page.module.css";

type ReviewView = {
  name: string;
  role: string;
  location: string;
  quote: string;
  author: string;
  rating: number;
};

const accents = ["lavender", "violet", "sky"] as const;

type ReviewsClientProps = {
  initialReviews: ReviewView[];
};

export function ReviewsClient({ initialReviews }: ReviewsClientProps) {
  const [reviews, setReviews] = useState(initialReviews);

  function handleCreated(review: StoredReview) {
    const nextReview: ReviewView = {
      name: review.name,
      role: "Community Member",
      location: review.location,
      quote: review.content,
      author: review.name,
      rating: review.rating,
    };

    setReviews((current) => [nextReview, ...current]);
  }

  return (
    <>
      <section className={styles.formSection}>
        <div className={styles.formHeader}>
          <h2>Share your experience.</h2>
          <p>Let other patients know what your visit was like.</p>
        </div>

        <ReviewForm onCreated={handleCreated} />

        <div className={styles.shareRow}>
          <span>Share</span>
          <span>Twitter</span>
          <span>LinkedIn</span>
          <span>Email</span>
          <span>Print</span>
        </div>
      </section>

      <section className={styles.submittedSection}>
        <div className={styles.submittedHeader}>
          <h2>Recent community reviews</h2>
          <p>Newly submitted reviews appear below the featured testimonials.</p>
        </div>

        {reviews.length === 0 ? (
          <div className={styles.emptyState}>
            No submitted reviews yet. Be the first to share your experience.
          </div>
        ) : (
          <div className={styles.submittedList}>
            {reviews.map((review, index) => {
              const accent = accents[index % accents.length];

              return (
                <article
                  key={`${review.name}-${review.location}-${index}`}
                  className={styles.submittedCard}
                >
                  <div
                    className={`${styles.submittedAvatar} ${
                      accent === "lavender"
                        ? styles.avatarLavender
                        : accent === "violet"
                          ? styles.avatarViolet
                          : styles.avatarSky
                    }`}
                  >
                    {review.name.charAt(0)}
                  </div>

                  <div className={styles.submittedBody}>
                    <div className={styles.submittedTop}>
                      <div>
                        <h3>{review.name}</h3>
                        <p>{review.location}</p>
                      </div>
                      <div
                        className={styles.submittedStars}
                        aria-label={`${review.rating} out of 5 stars`}
                      >
                        {"★".repeat(review.rating)}
                        <span className={styles.starsDim}>
                          {"★".repeat(5 - review.rating)}
                        </span>
                      </div>
                    </div>

                    <p className={styles.submittedRole}>{review.role}</p>
                    <p className={styles.submittedText}>{review.quote}</p>
                    <div className={styles.submittedActions}>
                      <span>Public Comment</span>
                      <span>Direct Message</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
