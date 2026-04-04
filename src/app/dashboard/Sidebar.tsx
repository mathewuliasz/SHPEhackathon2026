"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./layout.module.css";
import LogoutButton from "./LogoutButton";

type SidebarProps = {
  user: { fullName: string; email: string };
};

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    exact: true,
  },
  {
    href: "/dashboard/doctors",
    label: "Doctor's via Specialty",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="M9 21v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
      </svg>
    ),
  },
  {
    href: "/dashboard/consultations",
    label: "Your Consultation/Chats",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "/dashboard/prescriptions",
    label: "View Current Prescriptions",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 14h6" />
        <path d="M9 18h6" />
      </svg>
    ),
  },
  {
    href: "/dashboard/records",
    label: "Medical Records/Meetings",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    href: "/dashboard/profile",
    label: "Your Profile",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        Medi<span className={styles.logoAccent}>Track</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? styles.navItemActive : styles.navItem}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.userPanel}>
        <strong>{user.fullName}</strong>
        <span>{user.email}</span>
      </div>
      <LogoutButton />
    </aside>
  );
}
