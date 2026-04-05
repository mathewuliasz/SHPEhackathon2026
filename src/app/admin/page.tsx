import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getLanguage, t } from "@/lib/language";
import LanguageToggle from "@/components/LanguageToggle";
import AdminVolunteerApplications from "./AdminVolunteerApplications";
import styles from "./page.module.css";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

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
          <Link href="/volunteer">{t(lang, "vol_navVolunteer")}</Link>
          <Link href="/admin" aria-current="page">
            {t(lang, "admin_navAdmin")}
          </Link>
        </nav>

        <LanguageToggle />
      </header>

      <main className={styles.main}>
        <AdminVolunteerApplications />
      </main>
    </div>
  );
}
