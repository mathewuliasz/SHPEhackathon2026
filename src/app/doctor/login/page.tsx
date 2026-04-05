import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/app/auth/AuthCard";
import { getCurrentUser, getDefaultRouteForRole } from "@/lib/auth";
import styles from "../../auth/page.module.css";

export default async function DoctorLoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(getDefaultRouteForRole(user.role));
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
          <Link href="/doctor/login">Doctor Login</Link>
        </nav>

        <Link className={styles.headerCta} href="/">
          Back Home
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>Doctor Access</div>
            <h1>Sign in to manage upcoming visits and patient messages.</h1>
            <p>
              Licensed providers can access their appointment queue, review patient messages, and
              stay organized from one secure workspace.
            </p>

            <div className={styles.perks}>
              <div className={styles.perk}>
                <span className={styles.perkDot} />
                View your upcoming appointments in one dashboard
              </div>
              <div className={styles.perk}>
                <span className={styles.perkDot} />
                Respond to patient messages in consultation threads
              </div>
              <div className={styles.perk}>
                <span className={styles.perkDot} />
                Access only the doctor profile assigned to your account
              </div>
            </div>
          </div>

          <div className={styles.formsShell}>
            <AuthCard initialMode="signin" loginVariant="doctor" allowSignUp={false} />
          </div>
        </section>
      </main>
    </div>
  );
}
