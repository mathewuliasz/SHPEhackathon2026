import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, getDefaultRouteForRole } from "@/lib/auth";
import { AuthCard } from "./AuthCard";
import styles from "./page.module.css";

const perks = [
  "Book faster with saved patient details",
  "Track upcoming appointments and reviews",
  "Access virtual care updates in one place",
] as const;

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

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          SHPE Health Care
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/#profile">Profile</Link>
          <Link href="/#reviews">Reviews</Link>
          <Link href="/#contact-us">Contact Us</Link>
        </nav>

        <Link className={styles.headerCta} href="/">
          Back Home
        </Link>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>Secure Access</div>
            <h1>Book your appointment through a calm, secure account flow.</h1>
            <p>
              Sign in to manage your care or create an account to schedule your
              first online consultation with SHPE Health Care.
            </p>

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
