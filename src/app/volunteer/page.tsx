import Link from "next/link";
import { getLanguage, t } from "@/lib/language";
import LanguageToggle from "@/components/LanguageToggle";
import styles from "./page.module.css";
import { VolunteerApplicationForm } from "./VolunteerApplicationForm";

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

export default async function VolunteerPage() {
  const lang = await getLanguage();

  const benefitCards = [
    { icon: "◔", titleKey: "vol_benefit1Title" as const, textKey: "vol_benefit1Text" as const },
    { icon: "◎", titleKey: "vol_benefit2Title" as const, textKey: "vol_benefit2Text" as const },
    { icon: "◌", titleKey: "vol_benefit3Title" as const, textKey: "vol_benefit3Text" as const },
    { icon: "▣", titleKey: "vol_benefit4Title" as const, textKey: "vol_benefit4Text" as const },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>⌘</span>
          <span className={styles.brandText}>{t(lang, "brand")}</span>
          <span className={styles.brandTag}>{t(lang, "vol_brandTag")}</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/dashboard/schedule">{t(lang, "vol_navBookAppointment")}</Link>
          <Link href="/about">{t(lang, "vol_navAbout")}</Link>
          <Link href="/volunteer" aria-current="page">
            {t(lang, "vol_navVolunteer")}
          </Link>
        </nav>

        <div className={styles.headerMeta}>
          <LanguageToggle />
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroBadge}>⌘</div>
          <span className={styles.kicker}>{t(lang, "vol_kicker")}</span>
          <h1>{t(lang, "vol_title")}</h1>
          <p>{t(lang, "vol_text")}</p>

          <div className={styles.benefitsGrid}>
            {benefitCards.map((card) => (
              <article key={card.titleKey} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{card.icon}</div>
                <h2>{t(lang, card.titleKey)}</h2>
                <p>{t(lang, card.textKey)}</p>
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
