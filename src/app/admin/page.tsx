import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          SHPE Medical
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/volunteer">Volunteer</Link>
          <Link href="/admin" aria-current="page">
            Admin
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <AdminVolunteerApplications />
      </main>
    </div>
  );
}
