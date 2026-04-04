import Link from "next/link";
import { listReviews } from "@/lib/review-store";
import { ReviewsClient } from "./ReviewsClient";
import styles from "./page.module.css";

const reviews = [
  {
    name: "Susan Parker, MD",
    role: "Primary Care Doctor",
    location: "Chicago, IL",
    quote:
      "The consultation flow felt smooth and thoughtful. I was able to connect quickly, review recommendations clearly, and leave with real confidence about next steps.",
    author: "Millie",
    accent: "lavender",
  },
  {
    name: "Kevin Malone, DDS",
    role: "Dentist",
    location: "Richmond, VA",
    quote:
      "Booking was straightforward and the care team followed up fast. The platform made the whole experience feel personal instead of rushed.",
    author: "Anonymous",
    accent: "violet",
  },
  {
    name: "Mark Flores, DO",
    role: "Primary Care Doctor",
    location: "New York, NY",
    quote:
      "I appreciated how easy it was to review details, ask questions, and get support without bouncing between multiple systems.",
    author: "Max",
    accent: "sky",
  },
] as const;

export default async function ReviewsPage() {
  let storedReviews = [] as Awaited<ReturnType<typeof listReviews>>;

  try {
    storedReviews = await listReviews();
  } catch {
    storedReviews = [];
  }

  const submittedReviews = storedReviews.map((review) => ({
    name: review.name,
    role: "Community Member",
    location: review.location,
    quote: review.content,
    author: review.name,
    rating: review.rating,
  }));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          SHPE Health Care
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/reviews" aria-current="page">
            Reviews
          </Link>
          <Link href="/#contact-us">Contact Us</Link>
        </nav>

        <div className={styles.headerActions}>
          <Link className={styles.headerSecondaryCta} href="/auth">
            Log In
          </Link>
          <Link className={styles.headerCta} href="/auth?mode=signup">
            Get Started
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.kicker}>Patient Reviews</div>
          <h1>Here&apos;s what our customers have to say.</h1>
        </section>

        <section className={styles.reviewList}>
          {reviews.map((review, index) => (
            <article key={review.name} className={styles.reviewCard}>
              <div
                className={`${styles.avatarFrame} ${
                  review.accent === "lavender"
                    ? styles.avatarLavender
                    : review.accent === "violet"
                      ? styles.avatarViolet
                      : styles.avatarSky
                }`}
              >
                <div className={styles.avatarPhoto}>
                  <div
                    className={`${styles.avatarFigure} ${styles[`avatarFigure${index + 1}`]}`}
                  />
                </div>
              </div>

              <div className={styles.reviewCopy}>
                <h2>{review.name}</h2>
                <p className={styles.role}>{review.role}</p>
                <p className={styles.location}>{review.location}</p>

                <div className={styles.stars} aria-label="5 out of 5 stars">
                  {"★★★★★"}
                </div>

                <blockquote className={styles.quote}>
                  <span className={styles.quoteMark}>“</span>
                  <p>{review.quote}</p>
                  <footer>-{review.author}</footer>
                </blockquote>
              </div>
            </article>
          ))}
        </section>

        <ReviewsClient initialReviews={submittedReviews} />
      </main>
    </div>
  );
}
