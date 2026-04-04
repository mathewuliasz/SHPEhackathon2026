"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./layout.module.css";
import LogoutButton from "./LogoutButton";

type DashboardShellProps = {
  children: React.ReactNode;
  user: {
    fullName: string;
    email: string;
  };
};

const menuItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5 10.5V20h5v-5h4v5h5v-9.5" />
      </svg>
    ),
  },
  {
    label: "Prescriptions",
    href: "/dashboard/prescriptions",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M8 7.5 16.5 16a3.18 3.18 0 1 1-4.5 4.5L3.5 12A3.18 3.18 0 0 1 8 7.5Z" />
        <path d="m14 5 5 5" />
      </svg>
    ),
  },
  {
    label: "Consultants",
    href: "/dashboard/consultations",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.9 8.9 0 0 1-3.5-.7L3 21l1.8-5.1A8.5 8.5 0 1 1 21 11.5Z" />
      </svg>
    ),
  },
  {
    label: "Medical Records",
    href: "/dashboard/records",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
        <path d="M3 10h18" />
      </svg>
    ),
  },
  {
    label: "Analytics",
    href: "/reviews",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M4 20h16" />
        <path d="M7 16V9" />
        <path d="M12 16V5" />
        <path d="M17 16v-7" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.56V21a2 2 0 0 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.57 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87A1.7 1.7 0 0 0 3 13.91H3a2 2 0 0 1 0-4h.09a1.7 1.7 0 0 0 1.57-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9.09A1.7 1.7 0 0 0 10.66 3H10.74a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1.11 1.57 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09A1.7 1.7 0 0 0 21 10.66V10.74a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.26Z" />
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
            <span className={styles.brandMark}>M</span>
            <span className={styles.brandText}>Medical Dashboard</span>
          </Link>
        </div>

        <label className={styles.search}>
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder="Search patients, prescriptions, records..."
          />
        </label>

        <div className={styles.topbarRight}>
          <button type="button" className={styles.notificationButton} aria-label="Notifications">
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
            <span className={styles.brandMark}>M</span>
            <span className={styles.brandText}>Medical Dashboard</span>
          </Link>
        </div>

        <nav className={styles.drawerNav}>
          {menuItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
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
