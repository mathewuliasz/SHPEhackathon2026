import Link from "next/link";
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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          SHPE Health Care
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/reviews">Reviews</Link>
          <Link href="/#contact-us">Contact Us</Link>
        </nav>

        <Link className={styles.headerCta} href="/auth">
          Back to Login
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>Reset Password</div>
            <h1>Create a new password for your account.</h1>
            <p>
              Use the secure reset link to finish updating your account password.
            </p>
          </div>

          <div className={styles.formsShell}>
            <ResetPasswordForm token={token} />
          </div>
        </section>
      </main>
    </div>
  );
}
