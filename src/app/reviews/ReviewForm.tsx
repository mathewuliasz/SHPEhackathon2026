"use client";

import { useRouter } from "next/navigation";
import type { StoredReview } from "@/lib/review-store";
import { useState, useTransition } from "react";
import styles from "./page.module.css";

type ReviewFormProps = {
  onCreated?: (review: StoredReview) => void;
};

export function ReviewForm({ onCreated }: ReviewFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    location: "",
    content: "",
    rating: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function setField<Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; review?: StoredReview }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Could not submit your review.");
        return;
      }

      setSuccess("Your review has been saved.");
      setForm({
        name: "",
        location: "",
        content: "",
        rating: 0,
      });
      if (data?.review) {
        onCreated?.(data.review);
      }
      router.refresh();
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formRow}>
        <label className={styles.field}>
          <span>Name (optional)</span>
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(event) => setField("name", event.target.value)}
          />
        </label>

        <label className={styles.field}>
          <span>City, State</span>
          <input
            type="text"
            placeholder="City, State"
            value={form.location}
            onChange={(event) => setField("location", event.target.value)}
          />
        </label>
      </div>

      <label className={`${styles.field} ${styles.fieldLarge}`}>
        <span>Describe your experience.</span>
        <textarea
          rows={5}
          placeholder="Tell us about your visit"
          value={form.content}
          onChange={(event) => setField("content", event.target.value)}
        />
      </label>

      <div className={styles.formFooter}>
        <div className={styles.ratingBlock}>
          <span>Select a rating.</span>
          <div className={styles.ratingStars} role="radiogroup" aria-label="Review rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.ratingStarButton} ${
                  star <= form.rating ? styles.ratingStarActive : ""
                }`}
                onClick={() => setField("rating", star)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                aria-pressed={star === form.rating}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <button className={styles.submitButton} type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </div>

      {error ? <p className={styles.formError}>{error}</p> : null}
      {success ? <p className={styles.formSuccess}>{success}</p> : null}
    </form>
  );
}
