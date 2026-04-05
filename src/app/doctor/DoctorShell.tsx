"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./layout.module.css";
import LogoutButton from "@/app/dashboard/LogoutButton";

const menuItems = [
  { label: "Dashboard", href: "/doctor" },
  { label: "Upcoming Appointments", href: "/doctor#appointments" },
  { label: "Patient Messages", href: "/doctor#messages" },
  { label: "Lab Results", href: "/doctor/lab-results" },
  { label: "Schedule", href: "/dashboard/schedule" },
  { label: "Profile", href: "/doctor/profile" },
] as const;

type DoctorNotification = {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  cta: string;
  href: string;
  tone: "blue" | "orange" | "green";
  unread: boolean;
};

const DOCTOR_NOTIFICATION_STORAGE_KEY = "doctor-read-notification-ids";

export default function DoctorShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { fullName: string; email: string };
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notifications, setNotifications] = useState<DoctorNotification[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const firstName = user.fullName.split(" ")[0] ?? "Doctor";
  const notificationsRef = useRef<HTMLDivElement>(null);
  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications],
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DOCTOR_NOTIFICATION_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        setReadNotificationIds(parsed.filter((item): item is string => typeof item === "string"));
      }
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;

    setNotificationsLoading(true);
    fetch("/api/doctor/notifications")
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) {
          const incoming = Array.isArray(data.notifications) ? data.notifications : [];
          setNotifications(
            incoming.map((item: DoctorNotification) => ({
              ...item,
              unread: !readNotificationIds.includes(item.id),
            })),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setNotifications([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setNotificationsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [readNotificationIds]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!notificationsRef.current?.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    if (notificationsOpen) {
      document.addEventListener("mousedown", handlePointerDown);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [notificationsOpen]);

  function handleMarkAllRead() {
    const nextIds = Array.from(new Set([...readNotificationIds, ...notifications.map((item) => item.id)]));
    setReadNotificationIds(nextIds);
    window.localStorage.setItem(DOCTOR_NOTIFICATION_STORAGE_KEY, JSON.stringify(nextIds));
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  }

  function handleNotificationClick(id: string) {
    const nextIds = readNotificationIds.includes(id)
      ? readNotificationIds
      : [...readNotificationIds, id];
    setReadNotificationIds(nextIds);
    window.localStorage.setItem(DOCTOR_NOTIFICATION_STORAGE_KEY, JSON.stringify(nextIds));
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
    setNotificationsOpen(false);
  }

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
          <div className={styles.notificationWrap} ref={notificationsRef}>
            <button
              type="button"
              className={styles.notificationButton}
              aria-label="Open doctor notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen((current) => !current)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M15 17H5.5a1.5 1.5 0 0 1-1.2-2.4L6 12.5V10a6 6 0 1 1 12 0v2.5l1.7 2.1a1.5 1.5 0 0 1-1.2 2.4H15" />
                <path d="M10 20a2 2 0 0 0 4 0" />
              </svg>
              {unreadCount > 0 ? (
                <span className={styles.notificationBadge}>{unreadCount}</span>
              ) : null}
            </button>

            {notificationsOpen ? (
              <div className={styles.notificationPanel}>
                <div className={styles.notificationPanelHeader}>
                  <div className={styles.notificationPanelTitle}>
                    <strong>Notifications</strong>
                    {unreadCount > 0 ? (
                      <span className={styles.notificationCount}>{unreadCount}</span>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className={styles.markAllButton}
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                  >
                    Mark all as read
                  </button>
                </div>

                <div className={styles.notificationList}>
                  {notificationsLoading ? (
                    <div className={styles.notificationEmpty}>Loading notifications...</div>
                  ) : notifications.length === 0 ? (
                    <div className={styles.notificationEmpty}>No doctor notifications right now.</div>
                  ) : (
                    notifications.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`${styles.notificationItem} ${styles[`notificationItem${capitalize(item.tone)}`]}`}
                        onClick={() => handleNotificationClick(item.id)}
                      >
                        <span className={`${styles.notificationIcon} ${styles[`notificationIcon${capitalize(item.tone)}`]}`}>
                          {item.tone === "blue" ? "✓" : item.tone === "orange" ? "⊕" : "●"}
                        </span>
                        <div className={styles.notificationBody}>
                          <div className={styles.notificationItemTop}>
                            <strong>{item.title}</strong>
                            {item.unread ? <span className={styles.notificationDot} /> : null}
                          </div>
                          <span className={styles.notificationTimestamp}>{item.timestamp}</span>
                          <p>{item.description}</p>
                          <span className={styles.notificationCta}>{item.cta}</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ) : null}
          </div>

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
        className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`}
        aria-label="Doctor workspace navigation"
        aria-hidden={!menuOpen}
      >
        <div className={styles.drawerHeader}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => setMenuOpen(false)}
            aria-label="Close doctor navigation menu"
          >
            <svg viewBox="0 0 24 24">
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          </button>
          <Link href="/doctor" className={styles.brand} onClick={() => setMenuOpen(false)}>
            <span className={styles.brandMark}>D</span>
            <span className={styles.brandText}>Doctor Workspace</span>
          </Link>
        </div>

        <div className={styles.drawerNav}>
          {menuItems.map((item) => {
            const isActive =
              item.href === "/doctor"
                ? pathname === "/doctor"
                : item.href === "/doctor/lab-results"
                  ? pathname.startsWith("/doctor/lab-results")
                  : item.href === "/doctor/profile"
                    ? pathname.startsWith("/doctor/profile")
                    : item.href === "/dashboard/schedule"
                      ? pathname.startsWith("/dashboard/schedule")
                      : false;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {menuOpen ? (
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => setMenuOpen(false)}
          aria-label="Close doctor navigation menu"
        />
      ) : null}

      <main className={styles.content}>{children}</main>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
