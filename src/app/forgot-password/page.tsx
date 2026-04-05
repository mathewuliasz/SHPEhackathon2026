import Link from "next/link";
import { getLanguage, t } from "@/lib/language";
import LanguageToggle from "@/components/LanguageToggle";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import styles from "../auth/page.module.css";

export default async function ForgotPasswordPage() {
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
          <Link href="/contact">{t(lang, "nav_contact")}</Link>
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LanguageToggle />
          <Link className={styles.headerCta} href="/auth">
            {t(lang, "nav_backToLogin")}
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>{t(lang, "forgot_pageKicker")}</div>
            <h1>{t(lang, "forgot_pageTitle")}</h1>
            <p>{t(lang, "forgot_pageText")}</p>
          </div>

          <div className={styles.formsShell}>
            <ForgotPasswordForm />
          </div>
        </section>
      </main>
    </div>
  );
}
