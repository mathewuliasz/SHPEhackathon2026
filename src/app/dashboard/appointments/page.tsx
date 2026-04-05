"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { getAvailabilityForDoctor } from "@/scheduling/lib/scheduling-data";
import type { Availability } from "@/scheduling/types/scheduling";
import styles from "./page.module.css";

type AppointmentRow = {
  id: string;
  doctor_id: string;
  doctor_name: string;
  date: string;
  time: string;
  zoom_join_url?: string | null;
};

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const p = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${p}`;
}

function isPast(date: string, time: string): boolean {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, m] = time.split(":").map(Number);
  return new Date(y, mo - 1, d, h, m).getTime() < Date.now();
}

export default function ManageAppointments() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Reschedule modal state
  const [rescheduleTarget, setRescheduleTarget] = useState<AppointmentRow | null>(null);
  const [availSlots, setAvailSlots] = useState<Map<string, string[]>>(new Map());
  const [rescheduleDate, setRescheduleDate] = useState<string | null>(null);
  const [rescheduleTime, setRescheduleTime] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  async function handleCancel(appt: AppointmentRow) {
    if (!confirm(t("appts_confirmCancel"))) return;
    setActionLoading(appt.id);
    try {
      const res = await fetch(`/api/appointments/${appt.id}/cancel`, {
        method: "POST",
      });
      if (res.ok) {
        setAppointments((prev) => prev.filter((a) => a.id !== appt.id));
      }
    } catch {
      alert(t("appts_cancelFailed"));
    } finally {
      setActionLoading(null);
    }
  }

  async function openReschedule(appt: AppointmentRow) {
    setRescheduleTarget(appt);
    setRescheduleDate(null);
    setRescheduleTime(null);
    setLoadingSlots(true);

    try {
      // Fetch availability for the current month and next month
      const now = new Date();
      const months = [
        { year: now.getFullYear(), month: now.getMonth() },
        {
          year: now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear(),
          month: now.getMonth() === 11 ? 0 : now.getMonth() + 1,
        },
      ];

      const allAvail: Availability[] = [];
      for (const { year, month } of months) {
        const data = await getAvailabilityForDoctor(appt.doctor_id, year, month);
        allAvail.push(...data);
      }

      const map = new Map<string, string[]>();
      const today = now.toISOString().split("T")[0];
      for (const a of allAvail) {
        if (a.date >= today && a.slots.length > 0) {
          // Filter out past/near-future slots for today
          const filteredSlots = a.date === today
            ? a.slots.filter((slot) => {
                const [h, m] = slot.split(":").map(Number);
                const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
                return slotTime.getTime() - now.getTime() >= 30 * 60 * 1000;
              })
            : a.slots;
          if (filteredSlots.length > 0) {
            map.set(a.date, filteredSlots);
          }
        }
      }
      setAvailSlots(map);
    } catch {
      setAvailSlots(new Map());
    } finally {
      setLoadingSlots(false);
    }
  }

  async function handleReschedule() {
    if (!rescheduleTarget || !rescheduleDate || !rescheduleTime) return;
    setActionLoading(rescheduleTarget.id);
    try {
      const res = await fetch(`/api/appointments/${rescheduleTarget.id}/reschedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: rescheduleDate, time: rescheduleTime }),
      });
      if (res.ok) {
        const data = await res.json();
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === rescheduleTarget.id
              ? { ...a, date: data.appointment.date, time: data.appointment.time }
              : a
          )
        );
        setRescheduleTarget(null);
      } else {
        alert(t("appts_rescheduleFailed"));
      }
    } catch {
      alert(t("appts_rescheduleFailed"));
    } finally {
      setActionLoading(null);
    }
  }

  const upcoming = appointments.filter((a) => !isPast(a.date, a.time));
  const past = appointments.filter((a) => isPast(a.date, a.time));
  const slotsForDate = rescheduleDate ? availSlots.get(rescheduleDate) ?? [] : [];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t("appts_title")}</h1>
        <p className={styles.subtitle}>{t("appts_subtitle")}</p>
      </div>

      {loading ? (
        <div className={styles.loading}>{t("appts_loading")}</div>
      ) : upcoming.length === 0 && past.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4" />
              <path d="M8 3v4" />
              <path d="M3 10h18" />
            </svg>
          </div>
          <p className={styles.emptyTitle}>{t("appts_emptyTitle")}</p>
          <p className={styles.emptyText}>{t("appts_emptyText")}</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h2 className={styles.sectionLabel}>{t("appts_upcoming")}</h2>
              <div className={styles.list}>
                {upcoming.map((appt) => (
                  <div key={appt.id} className={styles.card}>
                    <div className={styles.cardInfo}>
                      <div className={styles.doctorName}>{appt.doctor_name}</div>
                      <div className={styles.dateTime}>
                        {formatDate(appt.date)} &middot; {formatTime(appt.time)}
                      </div>
                    </div>
                    <div className={styles.cardActions}>
                      <button
                        className={styles.rescheduleBtn}
                        onClick={() => openReschedule(appt)}
                        disabled={actionLoading === appt.id}
                      >
                        {t("appts_reschedule")}
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => handleCancel(appt)}
                        disabled={actionLoading === appt.id}
                      >
                        {t("appts_cancel")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className={styles.sectionLabel}>{t("appts_past")}</h2>
              <div className={styles.list}>
                {past.map((appt) => (
                  <div key={appt.id} className={`${styles.card} ${styles.cardPast}`}>
                    <div className={styles.cardInfo}>
                      <div className={styles.doctorName}>{appt.doctor_name}</div>
                      <div className={styles.dateTime}>
                        {formatDate(appt.date)} &middot; {formatTime(appt.time)}
                      </div>
                    </div>
                    <span className={styles.pastBadge}>{t("appts_completed")}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <div className={styles.overlay} onClick={() => setRescheduleTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{t("appts_rescheduleTitle")}</h2>
              <button
                className={styles.modalClose}
                onClick={() => setRescheduleTarget(null)}
              >
                &times;
              </button>
            </div>

            <p className={styles.modalSubtitle}>
              {rescheduleTarget.doctor_name} &mdash;{" "}
              {formatDate(rescheduleTarget.date)} {t("appts_at")}{" "}
              {formatTime(rescheduleTarget.time)}
            </p>

            {loadingSlots ? (
              <div className={styles.loading}>{t("appts_loadingSlots")}</div>
            ) : availSlots.size === 0 ? (
              <p className={styles.noSlots}>{t("appts_noSlots")}</p>
            ) : (
              <>
                <div className={styles.fieldLabel}>{t("appts_selectDate")}</div>
                <div className={styles.dateGrid}>
                  {[...availSlots.keys()].sort().map((date) => (
                    <button
                      key={date}
                      className={`${styles.dateChip} ${date === rescheduleDate ? styles.dateChipActive : ""}`}
                      onClick={() => {
                        setRescheduleDate(date);
                        setRescheduleTime(null);
                      }}
                    >
                      {formatDate(date)}
                    </button>
                  ))}
                </div>

                {rescheduleDate && (
                  <>
                    <div className={styles.fieldLabel}>{t("appts_selectTime")}</div>
                    <div className={styles.timeGrid}>
                      {slotsForDate.map((slot) => (
                        <button
                          key={slot}
                          className={`${styles.timeChip} ${slot === rescheduleTime ? styles.timeChipActive : ""}`}
                          onClick={() => setRescheduleTime(slot)}
                        >
                          {formatTime(slot)}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                <button
                  className={styles.confirmBtn}
                  disabled={!rescheduleDate || !rescheduleTime || actionLoading === rescheduleTarget.id}
                  onClick={handleReschedule}
                >
                  {actionLoading === rescheduleTarget.id
                    ? t("appts_rescheduling")
                    : t("appts_confirmReschedule")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
