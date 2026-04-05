import Link from "next/link";
import { getLanguage, t } from "@/lib/language";
import LanguageToggle from "@/components/LanguageToggle";
import { ResetPasswordForm } from "./ResetPasswordForm";
import styles from "../auth/page.module.css";

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = (await searchParams) ?? {};
  const token = params.token ?? "";
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
          <Link href="/#contact-us">{t(lang, "nav_contact")}</Link>
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
            <div className={styles.kicker}>{t(lang, "reset_pageKicker")}</div>
            <h1>{t(lang, "reset_pageTitle")}</h1>
            <p>{t(lang, "reset_pageText")}</p>
          </div>

          <div className={styles.formsShell}>
            <ResetPasswordForm token={token} />
          </div>
        </section>
      </main>
    </div>
  );
}
