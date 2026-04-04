import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import styles from "./layout.module.css";
import Chatbot from "./Chatbot";
import LogoutButton from "./LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          Medi<span className={styles.logoAccent}>Track</span>
        </div>
        <nav className={styles.nav}>
          <a className={styles.navItemActive} href="/dashboard">
            <span className={styles.navIcon}>
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </span>
            Dashboard
          </a>
          <a className={styles.navItem} href="/dashboard/doctors">
            <span className={styles.navIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
                <path d="M9 21v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
              </svg>
            </span>
            {"Doctor's via Specialty"}
          </a>
          <a className={styles.navItem} href="/dashboard/consultations">
            <span className={styles.navIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            Your Consultation/Chats
          </a>
          <a className={styles.navItem} href="/dashboard/prescriptions">
            <span className={styles.navIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
                <path d="M9 14h6" />
                <path d="M9 18h6" />
              </svg>
            </span>
            View Current Prescriptions
          </a>
          <a className={styles.navItem} href="/dashboard/records">
            <span className={styles.navIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            Medical Records/Meetings
          </a>
          <a className={styles.navItem} href="/dashboard/profile">
            <span className={styles.navIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            Your Profile
          </a>
        </nav>
        <div className={styles.userPanel}>
          <strong>{user.fullName}</strong>
          <span>{user.email}</span>
        </div>
        <LogoutButton />
      </aside>
      <main className={styles.content}>{children}</main>
      <Chatbot />
    </div>
  );
}
