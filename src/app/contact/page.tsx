import Link from "next/link";
import { getLanguage, t } from "@/lib/language";
import LanguageToggle from "@/components/LanguageToggle";
import styles from "./page.module.css";

const contactMethods = [
  {
    eyebrowKey: "contact_method1Eyebrow",
    titleKey: "contact_method1Title",
    textKey: "contact_method1Text",
    href: "mailto:care@shpemedical.org",
    ctaKey: "contact_method1Cta",
    tone: "blue",
  },
  {
    eyebrowKey: "contact_method2Eyebrow",
    titleKey: "contact_method2Title",
    textKey: "contact_method2Text",
    href: "/auth",
    ctaKey: "contact_method2Cta",
    tone: "mint",
  },
  {
    eyebrowKey: "contact_method3Eyebrow",
    titleKey: "contact_method3Title",
    textKey: "contact_method3Text",
    href: "/volunteer",
    ctaKey: "contact_method3Cta",
    tone: "sky",
  },
] as const;

const supportFacts = [
  { valueKey: "contact_fact1Value", labelKey: "contact_fact1Label" },
  { valueKey: "contact_fact2Value", labelKey: "contact_fact2Label" },
  { valueKey: "contact_fact3Value", labelKey: "contact_fact3Label" },
] as const;

const expectations = [
  { titleKey: "contact_expect1Title", textKey: "contact_expect1Text" },
  { titleKey: "contact_expect2Title", textKey: "contact_expect2Text" },
  { titleKey: "contact_expect3Title", textKey: "contact_expect3Text" },
] as const;

export default async function ContactPage() {
  const lang = await getLanguage();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          {t(lang, "brand")}
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">{t(lang, "nav_home")}</Link>
          <Link href="/about">{t(lang, "nav_about")}</Link>
          <Link href="/reviews">{t(lang, "nav_reviews")}</Link>
          <Link href="/contact" aria-current="page">
            {t(lang, "nav_contact")}
          </Link>
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

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.heroKicker}>{t(lang, "contact_pageKicker")}</span>
            <h1>{t(lang, "contact_pageTitle")}</h1>
            <p>{t(lang, "contact_pageText")}</p>

            <div className={styles.heroActions}>
              <a className={styles.primaryCta} href="mailto:care@shpemedical.org">
                {t(lang, "contact_primaryCta")}
              </a>
              <Link className={styles.secondaryCta} href="/dashboard/schedule">
                {t(lang, "contact_secondaryCta")}
              </Link>
            </div>
          </div>

          <aside className={styles.heroPanel}>
            <div className={styles.panelHeader}>
              <span>{t(lang, "contact_panelEyebrow")}</span>
              <h2>{t(lang, "contact_panelTitle")}</h2>
              <p>{t(lang, "contact_panelText")}</p>
            </div>

            <div className={styles.factGrid}>
              {supportFacts.map((item) => (
                <div key={item.labelKey} className={styles.factCard}>
                  <strong>{t(lang, item.valueKey)}</strong>
                  <span>{t(lang, item.labelKey)}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className={styles.methodSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>{t(lang, "contact_methodsKicker")}</span>
            <h2>{t(lang, "contact_methodsTitle")}</h2>
            <p>{t(lang, "contact_methodsText")}</p>
          </div>

          <div className={styles.methodGrid}>
            {contactMethods.map((method) => (
              <article
                key={method.titleKey}
                className={`${styles.methodCard} ${styles[`methodCard${capitalize(method.tone)}`]}`}
              >
                <span className={styles.methodEyebrow}>{t(lang, method.eyebrowKey)}</span>
                <h3>{t(lang, method.titleKey)}</h3>
                <p>{t(lang, method.textKey)}</p>
                {method.href.startsWith("mailto:") ? (
                  <a className={styles.methodCta} href={method.href}>
                    {t(lang, method.ctaKey)}
                  </a>
                ) : (
                  <Link className={styles.methodCta} href={method.href}>
                    {t(lang, method.ctaKey)}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className={styles.expectSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionKicker}>{t(lang, "contact_expectKicker")}</span>
            <h2>{t(lang, "contact_expectTitle")}</h2>
          </div>

          <div className={styles.expectGrid}>
            {expectations.map((item, index) => (
              <article key={item.titleKey} className={styles.expectCard}>
                <div className={styles.expectIndex}>0{index + 1}</div>
                <div>
                  <h3>{t(lang, item.titleKey)}</h3>
                  <p>{t(lang, item.textKey)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.ctaBand}>
          <div>
            <span className={styles.sectionKicker}>{t(lang, "contact_bannerKicker")}</span>
            <h2>{t(lang, "contact_bannerTitle")}</h2>
            <p>{t(lang, "contact_bannerText")}</p>
          </div>
          <div className={styles.bandActions}>
            <Link className={styles.bandSecondary} href="/volunteer">
              {t(lang, "contact_bannerSecondary")}
            </Link>
            <Link className={styles.bandPrimary} href="/auth">
              {t(lang, "contact_bannerPrimary")}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
