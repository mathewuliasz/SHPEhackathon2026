"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
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

type NotificationItem = {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  cta: string;
  href: string;
  tone: "blue" | "orange" | "green";
  unread: boolean;
};

const PATIENT_NOTIFICATION_STORAGE_KEY = "patient-read-notification-ids";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: "doctor" | "prescription" | "record" | "specialty";
};

export default function DashboardShell({
  children,
  user,
}: DashboardShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const pathname = usePathname();
  const { t } = useLanguage();
  const firstName = user.fullName.split(" ")[0] ?? "Patient";
  const notificationsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLLabelElement>(null);
  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications],
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PATIENT_NOTIFICATION_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        setReadNotificationIds(parsed.filter((item): item is string => typeof item === "string"));
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (searchValue.trim().length < 2) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      setSearchLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(searchValue.trim())}`)
        .then((response) => response.json())
        .then((data) => {
          if (!cancelled) {
            setSearchResults(Array.isArray(data.results) ? data.results : []);
            setSearchOpen(true);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setSearchResults([]);
          }
        })
        .finally(() => {
          if (!cancelled) {
            setSearchLoading(false);
          }
        });
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [searchValue]);

  useEffect(() => {
    let cancelled = false;

    setNotificationsLoading(true);
      fetch("/api/notifications")
        .then((response) => response.json())
        .then((data) => {
          if (!cancelled) {
            const incoming = Array.isArray(data.notifications) ? data.notifications : [];
            setNotifications(
              incoming.map((item: NotificationItem) => ({
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

      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
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
    window.localStorage.setItem(PATIENT_NOTIFICATION_STORAGE_KEY, JSON.stringify(nextIds));
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
  }

  function handleNotificationClick(id: string) {
    const nextIds = readNotificationIds.includes(id)
      ? readNotificationIds
      : [...readNotificationIds, id];
    setReadNotificationIds(nextIds);
    window.localStorage.setItem(PATIENT_NOTIFICATION_STORAGE_KEY, JSON.stringify(nextIds));
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

        <label className={styles.search} ref={searchRef}>
          <svg viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            placeholder={t("shell_searchPlaceholder")}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            onFocus={() => {
              if (searchValue.trim().length >= 2 || searchResults.length > 0) {
                setSearchOpen(true);
              }
            }}
          />

          {searchOpen ? (
            <div className={styles.searchPanel}>
              {searchLoading ? (
                <div className={styles.searchEmpty}>Searching...</div>
              ) : searchResults.length === 0 ? (
                <div className={styles.searchEmpty}>
                  {searchValue.trim().length < 2
                    ? "Type at least 2 characters."
                    : "No matching results found."}
                </div>
              ) : (
                <div className={styles.searchList}>
                  {searchResults.map((result) => (
                    <Link
                      key={result.id}
                      href={result.href}
                      className={styles.searchItem}
                      onClick={() => setSearchOpen(false)}
                    >
                      <span className={styles.searchItemCategory}>{result.category}</span>
                      <strong>{result.title}</strong>
                      <span>{result.subtitle}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </label>

        <div className={styles.topbarRight}>
          <div className={styles.notificationWrap} ref={notificationsRef}>
            <button
              type="button"
              className={styles.notificationButton}
              aria-label={t("shell_notifications")}
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
                    <strong>{t("shell_notifications")}</strong>
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
                    <div className={styles.notificationEmpty}>No notifications right now.</div>
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
          {menuItems.map((item) => {
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

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
