import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import styles from "../auth/page.module.css";

export default function ForgotPasswordPage() {
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
            <div className={styles.kicker}>Password Help</div>
            <h1>Reset access to your account.</h1>
            <p>
              Enter your account email and we&apos;ll generate a secure reset link
              for your password.
            </p>
          </div>

          <div className={styles.formsShell}>
            <ForgotPasswordForm />
          </div>
        </section>
      </main>
    </div>
  );
}
