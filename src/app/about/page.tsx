import Link from "next/link";
import styles from "./page.module.css";

const highlights = [
  {
    title: "Mission First",
    text: "We make online care easier to access, easier to understand, and easier to trust.",
  },
  {
    title: "Licensed Experts",
    text: "Our care network is built around credentialed professionals and patient-first guidance.",
  },
  {
    title: "Digital Convenience",
    text: "Appointments, records, and care planning stay organized in one clear experience.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          SHPE Health Care
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/about" aria-current="page">
            About Us
          </Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/#contact-us">Contact Us</Link>
        </nav>

        <Link className={styles.headerCta} href="/auth">
          Book Appointment
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.copy}>
            <div className={styles.kicker}>About SHPE Health Care</div>
            <h1>Healthcare guidance designed for clarity, trust, and access.</h1>
            <p>
              SHPE Health Care connects patients with licensed professionals for
              virtual support, practical care planning, and a smoother digital
              healthcare experience.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryButton} href="/auth">
                Book Appointment
              </Link>
              <Link className={styles.secondaryButton} href="/">
                Back Home
              </Link>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.heroStat}>
              <strong>120+</strong>
              <span>Certified doctors available online</span>
            </div>
            <div className={styles.heroStat}>
              <strong>4.9/5</strong>
              <span>Average patient satisfaction rating</span>
            </div>
            <div className={styles.heroStat}>
              <strong>24/7</strong>
              <span>Access to guidance and appointment support</span>
            </div>
          </div>
        </section>

        <section className={styles.story}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionKicker}>Who We Are</div>
            <h2>A modern healthcare front door for everyday care needs.</h2>
            <p>
              We built SHPE Health Care to reduce the friction patients feel
              when trying to find reliable online care. Our approach combines
              clinical access, clear communication, and a simple digital
              experience.
            </p>
          </div>

          <div className={styles.highlightGrid}>
            {highlights.map((item) => (
              <article key={item.title} className={styles.highlightCard}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.values}>
          <div className={styles.valuesPanel}>
            <div>
              <div className={styles.sectionKicker}>Our Promise</div>
              <h2>We focus on better access, better guidance, and better follow-through.</h2>
            </div>
            <ul className={styles.valueList}>
              <li>Clear communication before, during, and after appointments.</li>
              <li>Patient-centered recommendations grounded in licensed care.</li>
              <li>Digital tools that keep your healthcare details organized.</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
