import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getDefaultRouteForRole } from "@/lib/auth";
import { getLanguage, t } from "@/lib/language";
import LanguageToggle from "@/components/LanguageToggle";
import { AuthCard } from "./AuthCard";
import styles from "./page.module.css";

type AuthPageProps = {
  searchParams?: Promise<{
    mode?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const params = (await searchParams) ?? {};
  const isSignUp = params.mode === "signup";
  const user = await getCurrentUser();

  if (user) {
    redirect(getDefaultRouteForRole(user.role));
  }

  const lang = await getLanguage();
  const perks = [
    t(lang, "auth_perk1"),
    t(lang, "auth_perk2"),
    t(lang, "auth_perk3"),
  ];

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
          <Link className={styles.headerCta} href="/">
            {t(lang, "auth_backHome")}
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>{t(lang, "auth_pageKicker")}</div>
            <h1>{t(lang, "auth_pageTitle")}</h1>
            <p>{t(lang, "auth_pageText")}</p>

            <div className={styles.perks}>
              {perks.map((perk) => (
                <div key={perk} className={styles.perk}>
                  <span className={styles.perkDot} />
                  {perk}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formsShell}>
            <AuthCard initialMode={isSignUp ? "signup" : "signin"} />
          </div>
        </section>
      </main>
    </div>
  );
}
