"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./layout.module.css";
import LogoutButton from "@/app/dashboard/LogoutButton";

const menuItems = [
  { label: "Overview", href: "/doctor" },
  { label: "Upcoming Appointments", href: "/doctor#appointments" },
  { label: "Patient Messages", href: "/doctor#messages" },
  { label: "Schedule", href: "/dashboard/schedule" },
  { label: "Profile", href: "/doctor/profile" },
] as const;

export default function DoctorShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { fullName: string; email: string };
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const firstName = user.fullName.split(" ")[0] ?? "Doctor";

  return (
    <div className={styles.wrapper}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <button
            type="button"
            className={styles.menuToggle}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Toggle doctor navigation menu"
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 24 24">
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          </button>
          <Link href="/doctor" className={styles.brand}>
            <span className={styles.brandMark}>D</span>
            <span className={styles.brandText}>Doctor Workspace</span>
          </Link>
        </div>

        <div className={styles.topbarRight}>
          <Link href="/doctor/profile" className={styles.profile}>
            <span className={styles.profileAvatar}>{firstName.charAt(0)}</span>
            <div className={styles.profileText}>
              <strong>{user.fullName}</strong>
              <span>{user.email}</span>
            </div>
          </Link>
          <div className={styles.logoutSlot}>
            <LogoutButton />
          </div>
        </div>
      </header>

      <nav
        className={`${styles.menuBar} ${menuOpen ? styles.menuBarOpen : styles.menuBarClosed}`}
        aria-label="Doctor workspace navigation"
      >
        {menuItems.map((item) => {
          const isActive =
            item.href === "/doctor"
              ? pathname === "/doctor"
              : item.href === "/dashboard/schedule"
                ? pathname.startsWith("/dashboard/schedule")
                : pathname === "/doctor";

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
