import Link from "next/link";
import styles from "./page.module.css";
import { VolunteerApplicationForm } from "./VolunteerApplicationForm";

const benefitCards = [
  {
    icon: "◔",
    title: "Flexible Hours",
    text: "Volunteer as little as 1 hour/week. Completely on your schedule.",
  },
  {
    icon: "◎",
    title: "100% Online",
    text: "All consultations are virtual. No travel, no clinic setup needed.",
  },
  {
    icon: "◌",
    title: "Real Impact",
    text: "Directly help underserved families who would otherwise go without care.",
  },
  {
    icon: "▣",
    title: "Coordinated Support",
    text: "Our team handles scheduling, translation, and admin. You just show up.",
  },
] as const;

const languages = [
  "Spanish / Espanol",
  "English / Ingles",
  "Portuguese / Portugues",
  "French / Frances",
] as const;

const availability = [
  "Weekday mornings",
  "Weekday afternoons",
  "Weekday evenings",
  "Weekend mornings",
  "Weekend afternoons",
] as const;

const specialties = [
  "General Practice",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
] as const;

const experienceRanges = ["0-2 years", "3-5 years", "6-10 years", "10+ years"] as const;
const monthlyHours = ["1-4 hours", "5-8 hours", "9-12 hours", "12+ hours"] as const;

export default function VolunteerPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>⌘</span>
          <span className={styles.brandText}>SHPE Medical</span>
          <span className={styles.brandTag}>Sin Fines de Lucro</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/dashboard/schedule">Book Appointment</Link>
          <Link href="/about">About Us</Link>
          <Link href="/volunteer" aria-current="page">
            Volunteer
          </Link>
        </nav>

        <div className={styles.headerMeta}>
          <button className={styles.notification} type="button" aria-label="Notifications">
            !
            <span>3</span>
          </button>
          <div className={styles.profilePill}>
            <span className={styles.profileAvatar}>YT</span>
            <div>
              <strong>Yi Team</strong>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBadge}>⌘</div>
          <span className={styles.kicker}>Unete · Join Us</span>
          <h1>Volunteer as a Healthcare Professional</h1>
          <p>
            Give back to the community by offering free online consultations to
            low-income Hispanic families. Your expertise changes lives.
          </p>

          <div className={styles.benefitsGrid}>
            {benefitCards.map((card) => (
              <article key={card.title} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{card.icon}</div>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.formShell}>
          <VolunteerApplicationForm
            specialties={specialties}
            experienceRanges={experienceRanges}
            languages={languages}
            availability={availability}
            monthlyHours={monthlyHours}
          />
        </section>
      </main>
    </div>
  );
}
