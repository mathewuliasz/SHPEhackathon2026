import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import styles from "./page.module.css";

type StatCard = {
  title: string;
  value: string;
  detail: string;
  tone: "blue" | "teal" | "slate";
  icon: React.ReactNode;
};

type QuickLink = {
  title: string;
  description: string;
  href: string;
};

const stats: StatCard[] = [
  {
    title: "Active Prescriptions",
    value: "3",
    detail: "Updated today",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M8 7.5 16.5 16a3.18 3.18 0 1 1-4.5 4.5L3.5 12A3.18 3.18 0 0 1 8 7.5Z" />
        <path d="m14 5 5 5" />
      </svg>
    ),
  },
  {
    title: "Upcoming Appointments",
    value: "2",
    detail: "Next: Tomorrow 10:00 AM",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4" />
        <path d="M8 3v4" />
        <path d="M3 10h18" />
        <path d="m9.5 15 1.8 1.8L15 13" />
      </svg>
    ),
  },
  {
    title: "Unread Messages",
    value: "3",
    detail: "From 2 consultants",
    tone: "teal",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.9 8.9 0 0 1-3.5-.7L3 21l1.8-5.1A8.5 8.5 0 1 1 21 11.5Z" />
      </svg>
    ),
  },
  {
    title: "Pending Reviews",
    value: "1",
    detail: "Share your latest care feedback",
    tone: "slate",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="m4 20 4.5-1 9-9a2.1 2.1 0 0 0-3-3l-9 9L4 20Z" />
        <path d="m13.5 6.5 4 4" />
      </svg>
    ),
  },
];

const quickLinks: QuickLink[] = [
  {
    title: "Find a specialist",
    description: "Browse doctors by specialty and compare providers.",
    href: "/dashboard/doctors",
  },
  {
    title: "Write a review",
    description: "Leave feedback after a visit and help other patients.",
    href: "/reviews",
  },
  {
    title: "Reset account access",
    description: "Manage password recovery and security settings.",
    href: "/forgot-password",
  },
];

function StatIcon({
  tone,
  children,
}: {
  tone: StatCard["tone"];
  children: React.ReactNode;
}) {
  return <span className={`${styles.statIcon} ${styles[`statIcon${tone[0].toUpperCase()}${tone.slice(1)}`]}`}>{children}</span>;
}

export default async function Dashboard() {
  const user = await getCurrentUser();
  const firstName = user?.fullName.split(" ")[0] ?? "Patient";

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Today&apos;s Summary</p>
          <h1 className={styles.heroTitle}>Good morning, {firstName}</h1>
          <p className={styles.heroText}>
            Here is your health summary for today. Review appointments, messages,
            prescriptions, and next steps in one place.
          </p>

          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="/dashboard/doctors">
              Book Appointment
            </Link>
            <Link className={styles.secondaryAction} href="/reviews">
              View Reviews
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroGlow} />
          <div className={styles.heroCard}>
            <span className={styles.heroCardLabel}>Next Check-In</span>
            <strong>Tomorrow, 10:00 AM</strong>
            <span>Internal medicine follow-up with your care team.</span>
          </div>
        </div>
      </section>

      <section className={styles.statsGrid}>
        {stats.map((stat) => (
          <article key={stat.title} className={styles.statCard}>
            <StatIcon tone={stat.tone}>{stat.icon}</StatIcon>

            <div className={styles.statContent}>
              <h2 className={styles.statTitle}>{stat.title}</h2>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statDetail}>{stat.detail}</p>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.triageCard}>
        <div className={styles.triageGlow} />
        <div className={styles.triageInner}>
          <div className={styles.triageBadge}>
            <span className={styles.triagePulse} />
            AI-Powered
          </div>
          <h2 className={styles.triageTitle}>
            Not sure which specialist you need?
          </h2>
          <p className={styles.triageDescription}>
            Describe your symptoms and our AI triage assistant will analyze them
            and recommend the right type of doctor — then book directly.
          </p>
          <Link className={styles.triageAction} href="/dashboard/triage">
            Start Symptom Check
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className={styles.triageVisual} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.triageIconLarge}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
      </section>

      <section className={styles.quickSection}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Quick Actions</p>
            <h2 className={styles.sectionTitle}>Continue where you left off</h2>
          </div>
          <Link className={styles.sectionLink} href="/dashboard/consultations">
            Open consultations
          </Link>
        </div>

        <div className={styles.quickGrid}>
          {quickLinks.map((item) => (
            <Link key={item.title} href={item.href} className={styles.quickCard}>
              <div>
                <h3 className={styles.quickTitle}>{item.title}</h3>
                <p className={styles.quickDescription}>{item.description}</p>
              </div>
              <span className={styles.quickArrow}>
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14" />
                  <path d="m13 5 7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
