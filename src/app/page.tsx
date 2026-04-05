import Link from "next/link";
import { listReviews } from "@/lib/review-store";
import { DoctorCarousel } from "./DoctorCarousel";
import { MouseTiltCard } from "./MouseTiltCard";
import LanguageToggle from "@/components/LanguageToggle";
import { getLanguage, t } from "@/lib/language";
import styles from "./page.module.css";

const serviceIcons = [
  { accent: "sky", icon: <ClipboardHeartIcon /> },
  { accent: "lavender", icon: <BrainShieldIcon /> },
  { accent: "violet", icon: <CareBasketIcon /> },
] as const;

const categoryIcons = [
  { key: "cat_doctorList" as const, icon: <DoctorIcon /> },
  { key: "cat_hospitals" as const, icon: <HospitalIcon /> },
  { key: "cat_departments" as const, icon: <DepartmentsIcon /> },
  { key: "cat_location" as const, icon: <LocationIcon /> },
  { key: "cat_disease" as const, icon: <CommunityIcon /> },
  { key: "cat_prescriptions" as const, icon: <PillIcon /> },
] as const;

const menuKeys = [
  { key: "nav_home" as const, href: "#top" },
  { key: "nav_about" as const, href: "/about" },
  { key: "nav_reviews" as const, href: "/reviews" },
  { key: "nav_contact" as const, href: "/contact" },
] as const;

const fallbackReviews = [
  {
    name: "Susan Parker, MD",
    location: "Chicago, IL",
    content:
      "The consultation flow felt smooth and thoughtful. I was able to connect quickly and leave with real confidence about next steps.",
    rating: 5,
  },
  {
    name: "Kevin Malone, DDS",
    location: "Richmond, VA",
    content:
      "Booking was straightforward and the care team followed up fast. The platform made the whole experience feel personal instead of rushed.",
    rating: 5,
  },
  {
    name: "Mark Flores, DO",
    location: "New York, NY",
    content:
      "I appreciated how easy it was to review details, ask questions, and get support without bouncing between multiple systems.",
    rating: 5,
  },
] as const;

type ReviewCard = {
  name: string;
  location: string;
  content: string;
  rating: number;
};

export default async function Home() {
  const lang = await getLanguage();
  let reviewCards: ReviewCard[] = [...fallbackReviews];

  try {
    const storedReviews = await listReviews(3);

    if (storedReviews.length > 0) {
      reviewCards = storedReviews.map((review) => ({
        name: review.name,
        location: review.location,
        content: review.content,
        rating: review.rating,
      }));
    }
  } catch {
    reviewCards = [...fallbackReviews];
  }

  const services = [
    { titleKey: "service1_title" as const, descKey: "service1_desc" as const, accent: "sky", icon: serviceIcons[0].icon },
    { titleKey: "service2_title" as const, descKey: "service2_desc" as const, accent: "lavender", icon: serviceIcons[1].icon },
    { titleKey: "service3_title" as const, descKey: "service3_desc" as const, accent: "violet", icon: serviceIcons[2].icon },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a className={styles.brand} href="#top">
          {t(lang, "brand")}
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {menuKeys.map((item) => (
            <Link key={item.key} href={item.href}>
              {t(lang, item.key)}
            </Link>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <LanguageToggle />
          <Link className={styles.headerSecondaryCta} href="/auth">
            {t(lang, "nav_login")}
          </Link>
          <Link className={styles.headerCta} href="/auth?mode=signup">
            {t(lang, "nav_getStarted")}
          </Link>
        </div>
      </header>

      <main className={styles.main} id="top">
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>
              <span className={styles.kickerIcon}>🏥</span>
              {t(lang, "hero_kicker")}
            </div>

            <h1 className={styles.heroTitle}>
              {t(lang, "hero_title_1")}<span>{t(lang, "hero_title_accent")}</span>{t(lang, "hero_title_2")}
            </h1>

            <p className={styles.heroText}>
              {t(lang, "hero_text_1")}<strong>{t(lang, "hero_text_bold")}</strong>{t(lang, "hero_text_2")}
            </p>

            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/auth">
                {t(lang, "hero_bookAppointment")}
              </Link>
              <Link className={styles.secondaryButton} href="/about">
                {t(lang, "hero_learnMore")}
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.visualGlow} />
            <MouseTiltCard className={styles.visualTilt}>
              <div className={styles.visualPanel}>
              <div className={styles.badgeCard}>
                <span className={styles.badgeDot} />
                {t(lang, "hero_virtualSupport")}
              </div>

              <DoctorCarousel />

              <div className={styles.statsStrip}>
                <div>
                  <strong>{t(lang, "hero_doctorCount")}</strong>
                  <span>{t(lang, "hero_doctorLabel")}</span>
                </div>
                <div>
                  <strong>{t(lang, "hero_rating")}</strong>
                  <span>{t(lang, "hero_ratingLabel")}</span>
                </div>
                <div>
                  <strong>{t(lang, "hero_responseTime")}</strong>
                  <span>{t(lang, "hero_responseLabel")}</span>
                </div>
              </div>
              </div>
            </MouseTiltCard>
          </div>
        </section>

        <section className={styles.section} id="about-us">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionKicker}>{t(lang, "services_kicker")}</div>
            <h2>{t(lang, "services_title")}</h2>
            <p>{t(lang, "services_text")}</p>
          </div>

          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <MouseTiltCard key={service.titleKey}>
                <article className={styles.serviceCard}>
                  <div
                    className={`${styles.serviceIcon} ${
                      styles[`serviceIcon${capitalize(service.accent)}`]
                    }`}
                  >
                    {service.icon}
                  </div>
                  <h3>{t(lang, service.titleKey)}</h3>
                  <p>{t(lang, service.descKey)}</p>
                  <Link href="/contact">{t(lang, "services_learnMore")}</Link>
                </article>
              </MouseTiltCard>
            ))}
          </div>
        </section>

        <section className={styles.section} id="profile">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionKicker}>{t(lang, "categories_kicker")}</div>
            <h2>{t(lang, "categories_title")}</h2>
            <p>{t(lang, "categories_text")}</p>
          </div>

          <div className={styles.categoryGrid}>
            {categoryIcons.map((category) => (
              <MouseTiltCard key={category.key}>
                <article className={styles.categoryCard}>
                  <div className={styles.categoryIcon}>{category.icon}</div>
                  <h3>{t(lang, category.key)}</h3>
                </article>
              </MouseTiltCard>
            ))}
          </div>
        </section>

        <section className={styles.contactBand} id="contact-us">
          <div>
            <span className={styles.contactEyebrow}>{t(lang, "contact_eyebrow")}</span>
            <h2>{t(lang, "contact_title")}</h2>
          </div>
          <a className={styles.primaryButton} href="mailto:care@shpehealth.com">
            {t(lang, "contact_cta")}
          </a>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionKicker}>{t(lang, "reviews_kicker")}</div>
            <h2>{t(lang, "reviews_title")}</h2>
            <p>{t(lang, "reviews_text")}</p>
          </div>

          <div className={styles.reviewCardGrid}>
            {reviewCards.map((review) => (
              <MouseTiltCard key={`${review.name}-${review.location}`}>
                <article className={styles.reviewPreviewCard}>
                  <div className={styles.reviewPreviewTop}>
                    <div className={styles.reviewPreviewAvatar}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h3>{review.name}</h3>
                      <p>{review.location}</p>
                    </div>
                  </div>

                  <div
                    className={styles.reviewPreviewStars}
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {"★".repeat(review.rating)}
                    <span className={styles.reviewPreviewStarsDim}>
                      {"★".repeat(5 - review.rating)}
                    </span>
                  </div>

                  <p className={styles.reviewPreviewText}>{review.content}</p>
                </article>
              </MouseTiltCard>
            ))}
          </div>

          <div className={styles.reviewPreviewAction}>
            <Link className={styles.secondaryButton} href="/reviews">
              {t(lang, "reviews_readAll")}
            </Link>
          </div>
        </section>

        <section className={styles.bottomCtas}>
          <MouseTiltCard>
            <article className={styles.advicePanel}>
              <div className={styles.adviceIcon}>
                <SupportIcon />
              </div>
              <div className={styles.bottomCtaCopy}>
                <h2>{t(lang, "bottom_adviceTitle")}</h2>
                <p>{t(lang, "bottom_adviceText")}</p>
                <Link className={styles.bottomPrimaryButton} href="/contact">
                  {t(lang, "bottom_adviceCta")}
                </Link>
              </div>
            </article>
          </MouseTiltCard>

          <article className={styles.reviewsPanel} id="reviews">
            <div className={styles.bottomCtaCopy}>
              <h2>{t(lang, "bottom_storiesTitle")}</h2>
              <p>{t(lang, "bottom_storiesText")}</p>
              <Link className={styles.bottomSecondaryButton} href="/reviews">
                {t(lang, "bottom_storiesCta")}
              </Link>
            </div>
            <div className={styles.reviewsIcon}>
              <ClipboardCheckIcon />
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function ClipboardHeartIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="18" y="14" width="28" height="36" rx="6" stroke="currentColor" strokeWidth="3" />
      <path d="M26 14.5C26 11.5 28.5 9 31.5 9H32.5C35.5 9 38 11.5 38 14.5V18H26V14.5Z" stroke="currentColor" strokeWidth="3" />
      <path
        d="M32 38.5L29.2 35.9C27.1 33.9 27 30.6 29 28.7C30.4 27.3 32.6 27.3 34 28.7C35.4 27.3 37.6 27.3 39 28.7C41 30.6 40.9 33.9 38.8 35.9L36 38.5L34 40.4L32 38.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BrainShieldIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M24 42C19 42 15 38 15 33C15 29.7 16.8 26.8 19.5 25.2C19.6 19.6 24.1 15 29.8 15C35.4 15 40 19.5 40.1 25.1C43 26.6 45 29.7 45 33.2C45 38.1 41.1 42 36.2 42H24Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M22 24C24.5 26 26 28.4 26 31V42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 20V42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M42 24C39.5 26 38 28.4 38 31V42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M49 38L54 41V47C54 51 50.8 54.4 47 55C43.2 54.4 40 51 40 47V41L45 38H49Z" fill="currentColor" />
    </svg>
  );
}

function CareBasketIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 27H46L43 46H21L18 27Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <path d="M24 27C24 20.9 27.6 16 32 16C36.4 16 40 20.9 40 27" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M25 34H39" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M25 40H39" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M49 20C52.3 20 55 22.7 55 26C55 31 49 35 49 35C49 35 43 31 43 26C43 22.7 45.7 20 49 20Z" fill="currentColor" />
    </svg>
  );
}

function DoctorIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="20" r="8" fill="currentColor" />
      <path d="M20 50C20 40.6 25.4 34 32 34C38.6 34 44 40.6 44 50V54H20V50Z" fill="currentColor" />
      <path d="M18 26H23V31H28" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HospitalIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M18 54V20L32 12L46 20V54H18Z" fill="currentColor" />
      <path d="M32 21V34" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M25.5 27.5H38.5" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function DepartmentsIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="12" y="24" width="16" height="22" rx="4" stroke="currentColor" strokeWidth="3" />
      <rect x="36" y="24" width="16" height="22" rx="4" stroke="currentColor" strokeWidth="3" />
      <rect x="24" y="12" width="16" height="18" rx="4" stroke="currentColor" strokeWidth="3" />
      <path d="M32 30V36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 35H20.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M44 35H44.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M32 54C32 54 46 40.8 46 28C46 20.3 39.7 14 32 14C24.3 14 18 20.3 18 28C18 40.8 32 54 32 54Z"
        fill="currentColor"
      />
      <circle cx="32" cy="28" r="5.5" fill="#fff" />
    </svg>
  );
}

function CommunityIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="6" fill="currentColor" />
      <circle cx="40" cy="22" r="5" fill="currentColor" opacity="0.85" />
      <path d="M14 48C14 40.3 18.5 35 24 35C29.5 35 34 40.3 34 48V52H14V48Z" fill="currentColor" />
      <path d="M33 50C33 43.7 36.7 39 41.5 39C46.3 39 50 43.7 50 50V52H33V50Z" fill="currentColor" opacity="0.85" />
      <circle cx="49" cy="18" r="3" fill="currentColor" />
      <circle cx="54" cy="24" r="2.5" fill="currentColor" />
      <circle cx="56" cy="16" r="2" fill="currentColor" />
    </svg>
  );
}

function PillIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M24 18C28.4 13.6 35.6 13.6 40 18L46 24C50.4 28.4 50.4 35.6 46 40L34 52C29.6 56.4 22.4 56.4 18 52L12 46C7.6 41.6 7.6 34.4 12 30L24 18Z"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path d="M23 41L41 23" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <path
        d="M13 56H35C40.5 56 45.8 53.9 49.9 50.1L62.1 39C65.5 35.9 70.8 35.5 74.6 38L83 43.4C85.9 45.3 86.7 49.2 84.8 52.1C84.3 52.9 83.5 53.6 82.7 54.1L43.2 77.1C39.2 79.4 34.7 80.7 30.1 80.7H13V56Z"
        fill="currentColor"
      />
      <path d="M5 53H16V83H5V53Z" fill="currentColor" />
      <rect x="43" y="7" width="39" height="34" rx="8" stroke="currentColor" strokeWidth="4" />
      <path d="M56 21H70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M56 30H67" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M57 41L54 54L66 42" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

function ClipboardCheckIcon() {
  return (
    <svg viewBox="0 0 96 96" fill="none" aria-hidden="true">
      <rect x="22" y="14" width="46" height="68" rx="10" stroke="currentColor" strokeWidth="4" />
      <rect x="35" y="8" width="20" height="12" rx="6" fill="currentColor" />
      <path d="M33 34H57" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M33 47H57" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M33 60H52" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <circle cx="68" cy="62" r="16" fill="currentColor" />
      <path
        d="M60 62.5L66.2 68.7L76.5 55.5"
        stroke="#2f55db"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
