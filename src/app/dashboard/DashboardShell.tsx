"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./layout.module.css";
import LogoutButton from "./LogoutButton";

type DashboardShellProps = {
  children: React.ReactNode;
  user: {
    fullName: string;
    email: string;
    role: string;
  };
};

const menuItems = [
  {
    labelKey: "sidebar_dashboard",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10.5V20h5v-5h4v5h5v-9.5" />
      </svg>
    ),
  },
  {
    labelKey: "admin_navAdmin",
    href: "/dashboard/admin",
    isAdminOnly: true,
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
  {
    labelKey: "sidebar_doctors",
    href: "/dashboard/schedule",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M9 21v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
      </svg>
    ),
  },
  {
    labelKey: "sidebar_consultations",
    href: "/dashboard/consultations",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.9 8.9 0 0 1-3.5-.7L3 21l1.8-5.1A8.5 8.5 0 1 1 21 11.5Z" />
      </svg>
    ),
  },
  {
    labelKey: "sidebar_triage",
    href: "/dashboard/triage",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm1 15h-2v-2h2Zm0-4h-2V7h2Z" />
      </svg>
    ),
  },
  {
    labelKey: "sidebar_labResults",
    href: "/dashboard/lab-results",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M9 2v6l-2 8a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4l-2-8V2" />
        <path d="M7 2h10" />
        <path d="M12 16h.01" />
      </svg>
    ),
  },
  {
    labelKey: "sidebar_records",
    href: "/dashboard/records",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    labelKey: "sidebar_profile",
    href: "/dashboard/profile",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function DashboardShell({
  children,
  user,
}: DashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  const firstName = user.fullName.split(" ")[0] ?? "Patient";

  return (
    <div className={styles.wrapper}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <button
            type="button"
            className={styles.menuToggle}
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <svg viewBox="0 0 24 24">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>

          <Link href="/dashboard" className={styles.brand}>
            <span className={styles.brandMark}>{t("shell_brandMark")}</span>
            <span className={styles.brandText}>{t("shell_brandText")}</span>
          </Link>
        </div>

        <label className={styles.search}>
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder={t("shell_searchPlaceholder")}
          />
        </label>

        <div className={styles.topbarRight}>
          <button type="button" className={styles.notificationButton} aria-label={t("shell_notifications")}>
            <svg viewBox="0 0 24 24">
              <path d="M15 17H5.5a1.5 1.5 0 0 1-1.2-2.4L6 12.5V10a6 6 0 1 1 12 0v2.5l1.7 2.1a1.5 1.5 0 0 1-1.2 2.4H15" />
              <path d="M10 20a2 2 0 0 0 4 0" />
            </svg>
            <span className={styles.notificationBadge}>2</span>
          </button>

          <div className={styles.profile}>
            <span className={styles.profileAvatar}>{firstName.charAt(0)}</span>
            <div className={styles.profileText}>
              <strong>{user.fullName}</strong>
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation menu"
        />
      ) : null}

      <aside
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.drawerHeader}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <svg viewBox="0 0 24 24">
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>

          <Link href="/dashboard" className={styles.brand}>
            <span className={styles.brandMark}>{t("shell_brandMark")}</span>
            <span className={styles.brandText}>{t("shell_brandText")}</span>
          </Link>
        </div>

        <nav className={styles.drawerNav}>
          {menuItems
            .filter((item) => !item.isAdminOnly || user.role === "admin")
            .map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.labelKey}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {t(item.labelKey)}
                </Link>
              );
            })}
        </nav>

        <div className={styles.drawerFooter}>
          <LogoutButton />
        </div>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
