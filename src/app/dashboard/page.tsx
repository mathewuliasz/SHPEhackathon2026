import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getLanguage, t } from "@/lib/language";
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
    title: "Lab Results",
    value: "3",
    detail: "Updated today",
    tone: "blue",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M9 2v6l-2 8a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4l-2-8V2" />
        <path d="M7 2h10" />
        <path d="M12 16h.01" />
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
  const lang = await getLanguage();
  const firstName = user?.fullName.split(" ")[0] ?? "Patient";
  const greeting = t(lang, "dash_greeting").replace("{name}", firstName);

  const translatedStats: StatCard[] = [
    { ...stats[0], title: t(lang, "dash_labResults"), detail: t(lang, "dash_updatedToday") },
    { ...stats[1], title: t(lang, "dash_upcomingAppointments"), detail: t(lang, "dash_nextTomorrow") },
    { ...stats[2], title: t(lang, "dash_unreadMessages"), detail: t(lang, "dash_fromConsultants") },
    { ...stats[3], title: t(lang, "dash_pendingReviews"), detail: t(lang, "dash_shareFeedback") },
  ];

  const translatedQuickLinks: QuickLink[] = [
    { title: t(lang, "dash_findSpecialist"), description: t(lang, "dash_findSpecialistDesc"), href: "/dashboard/schedule" },
    { title: t(lang, "dash_writeReview"), description: t(lang, "dash_writeReviewDesc"), href: "/reviews" },
    { title: t(lang, "dash_resetAccess"), description: t(lang, "dash_resetAccessDesc"), href: "/forgot-password" },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>{t(lang, "dash_todaySummary")}</p>
          <h1 className={styles.heroTitle}>{greeting}</h1>
          <p className={styles.heroText}>{t(lang, "dash_summaryText")}</p>

          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href="/dashboard/schedule">
              {t(lang, "dash_bookAppointment")}
            </Link>
            <Link className={styles.secondaryAction} href="/reviews">
              {t(lang, "dash_viewReviews")}
            </Link>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.heroGlow} />
          <div className={styles.heroCard}>
            <span className={styles.heroCardLabel}>{t(lang, "dash_nextCheckIn")}</span>
            <strong>{t(lang, "dash_nextCheckInTime")}</strong>
            <span>{t(lang, "dash_nextCheckInDesc")}</span>
          </div>
        </div>
      </section>

      <section className={styles.statsGrid}>
        {translatedStats.map((stat) => (
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
            {t(lang, "dash_triageBadge")}
          </div>
          <h2 className={styles.triageTitle}>
            {t(lang, "dash_triageTitle")}
          </h2>
          <p className={styles.triageDescription}>
            {t(lang, "dash_triageText")}
          </p>
          <Link className={styles.triageAction} href="/dashboard/triage">
            {t(lang, "dash_triageCta")}
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
            <p className={styles.sectionEyebrow}>{t(lang, "dash_quickActions")}</p>
            <h2 className={styles.sectionTitle}>{t(lang, "dash_continueWhereLeft")}</h2>
          </div>
          <Link className={styles.sectionLink} href="/dashboard/consultations">
            {t(lang, "dash_openConsultations")}
          </Link>
        </div>

        <div className={styles.quickGrid}>
          {translatedQuickLinks.map((item) => (
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
