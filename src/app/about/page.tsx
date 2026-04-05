import Link from "next/link";
import { getLanguage, t } from "@/lib/language";
import LanguageToggle from "@/components/LanguageToggle";
import styles from "./page.module.css";

export default async function AboutPage() {
  const lang = await getLanguage();

  const impactStats = [
    { valueKey: "about_stat1Value", labelKey: "about_stat1Label" },
    { valueKey: "about_stat2Value", labelKey: "about_stat2Label" },
    { valueKey: "about_stat3Value", labelKey: "about_stat3Label" },
    { valueKey: "about_stat4Value", labelKey: "about_stat4Label" },
  ] as const;

  const storyHighlights = [
    { titleKey: "about_highlight1Title", textKey: "about_highlight1Text", tone: "blue", icon: "★" },
    { titleKey: "about_highlight2Title", textKey: "about_highlight2Text", tone: "mint", icon: "文" },
    { titleKey: "about_highlight3Title", textKey: "about_highlight3Text", tone: "sky", icon: "⌂" },
  ] as const;

  const audiences = [
    "about_audience1",
    "about_audience2",
    "about_audience3",
    "about_audience4",
    "about_audience5",
  ] as const;

  const values = [
    { titleKey: "about_value1Title", textKey: "about_value1Text", icon: "♡", featured: false },
    { titleKey: "about_value2Title", textKey: "about_value2Text", icon: "◍", featured: true },
    { titleKey: "about_value3Title", textKey: "about_value3Text", icon: "◌", featured: false },
    { titleKey: "about_value4Title", textKey: "about_value4Text", icon: "⌘", featured: false },
  ] as const;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          {t(lang, "brand")}
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">{t(lang, "nav_home")}</Link>
          <Link href="/about" aria-current="page">
            {t(lang, "nav_about")}
          </Link>
          <Link href="/reviews">{t(lang, "nav_reviews")}</Link>
          <Link href="/#contact-us">{t(lang, "nav_contact")}</Link>
        </nav>

        <div className={styles.headerActions}>
          <LanguageToggle />
          <Link className={styles.headerSecondaryCta} href="/auth">
            {t(lang, "about_logIn")}
          </Link>
          <Link className={styles.headerCta} href="/auth?mode=signup">
            {t(lang, "about_getStarted")}
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.heroKicker}>{t(lang, "about_heroKicker")}</span>
            <h1>{t(lang, "about_heroTitle")}</h1>
            <p>{t(lang, "about_heroText")}</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryCta} href="/dashboard/schedule">
                {t(lang, "about_bookFreeConsult")}
              </Link>
              <Link className={styles.secondaryCta} href="/volunteer">
                {t(lang, "about_imADoctor")}
              </Link>
            </div>
          </div>

          <aside className={styles.heroStats}>
            <div className={styles.statsGrid}>
              {impactStats.map((item) => (
                <div key={item.labelKey} className={styles.statItem}>
                  <strong>{t(lang, item.valueKey)}</strong>
                  <span>{t(lang, item.labelKey)}</span>
                </div>
              ))}
            </div>
            <div className={styles.quoteBlock}>
              <p>&quot;{t(lang, "about_heroQuote")}&quot;</p>
              <span>{t(lang, "about_heroQuoteAttrib")}</span>
            </div>
          </aside>
        </section>

        <section className={styles.storySection}>
          <div className={styles.storyCopy}>
            <span className={styles.sectionKicker}>{t(lang, "about_storyKicker")}</span>
            <h2>
              {t(lang, "about_storyTitle")}
            </h2>
            <p>{t(lang, "about_storyText1")}</p>
            <p>{t(lang, "about_storyText2")}</p>
            <blockquote>
              &ldquo;{t(lang, "about_storyQuote")}&rdquo;
            </blockquote>
          </div>

          <div className={styles.storyCards}>
            {storyHighlights.map((item) => (
              <article
                key={item.titleKey}
                className={`${styles.storyCard} ${styles[`storyCard${capitalize(item.tone)}`]}`}
              >
                <div className={styles.storyIcon}>{item.icon}</div>
                <div>
                  <h3>{t(lang, item.titleKey)}</h3>
                  <p>{t(lang, item.textKey)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.audienceSection}>
          <span className={styles.sectionKicker}>{t(lang, "about_audienceKicker")}</span>
          <h2>{t(lang, "about_audienceTitle")}</h2>
          <p className={styles.sectionIntro}>{t(lang, "about_audienceText")}</p>

          <div className={styles.audienceList}>
            {audiences.map((key, index) => (
              <div
                key={key}
                className={`${styles.audienceItem} ${index === 2 ? styles.audienceItemActive : ""}`}
              >
                <span className={styles.audienceCheck}>✓</span>
                <span>{t(lang, key)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.valuesSection}>
          <span className={styles.sectionKicker}>{t(lang, "about_valuesKicker")}</span>
          <h2>{t(lang, "about_valuesTitle")}</h2>

          <div className={styles.valuesGrid}>
            {values.map((item) => (
              <article
                key={item.titleKey}
                className={`${styles.valueCard} ${item.featured ? styles.valueCardFeatured : ""}`}
              >
                <div className={styles.valueIcon}>{item.icon}</div>
                <h3>{t(lang, item.titleKey)}</h3>
                <p>{t(lang, item.textKey)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.volunteerBanner}>
          <div>
            <span className={styles.bannerKicker}>{t(lang, "about_volunteerKicker")}</span>
            <h2>{t(lang, "about_volunteerTitle")}</h2>
            <p>{t(lang, "about_volunteerText")}</p>
          </div>
          <Link className={styles.bannerCta} href="/volunteer">
            {t(lang, "about_volunteerCta")}
          </Link>
        </section>

        <section className={styles.dualCards}>
          <article className={styles.ctaCardBlue}>
            <div className={styles.ctaIcon}>♥</div>
            <h3>{t(lang, "about_consultTitle")}</h3>
            <p>{t(lang, "about_consultText")}</p>
            <Link className={styles.cardCta} href="/dashboard/schedule">
              {t(lang, "about_bookFreeConsult")}
            </Link>
          </article>

          <article className={styles.ctaCardNavy}>
            <div className={styles.ctaIcon}>⌘</div>
            <h3>{t(lang, "about_doctorTitle")}</h3>
            <p>{t(lang, "about_doctorText")}</p>
            <Link className={styles.cardCta} href="/volunteer">
              {t(lang, "about_volunteerCta")}
            </Link>
          </article>
        </section>
      </main>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
