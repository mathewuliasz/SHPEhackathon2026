import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { getLanguage, t } from "@/lib/language";
import { getConsultationDoctors } from "@/scheduling/lib/scheduling-data";
import type { ConsultationDoctor } from "@/scheduling/types/scheduling";
import styles from "./page.module.css";

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DoctorCard({ doctor, lang }: { doctor: ConsultationDoctor; lang: import("@/lib/translations").Lang }) {
  const initials = doctor.name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const nextAppointment = doctor.appointments[0];

  return (
    <Link
      href={`/dashboard/consultations/${doctor.id}`}
      className={styles.doctorCard}
    >
      <div className={styles.avatar}>{initials}</div>
      <div className={styles.doctorInfo}>
        <div className={styles.doctorName}>{doctor.name}</div>
        <div className={styles.doctorSpecialty}>{doctor.specialty_name}</div>
        <div className={styles.appointmentMeta}>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>
              <svg viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            {nextAppointment
              ? formatDate(nextAppointment.date)
              : t(lang, "consult_noDate")}
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon}>
              <svg viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </span>
            {doctor.appointments.length}{" "}
            {doctor.appointments.length !== 1
              ? t(lang, "consult_appointments")
              : t(lang, "consult_appointment")}
          </span>
        </div>
      </div>
      <span className={styles.arrow}>&rsaquo;</span>
    </Link>
  );
}

export default async function Consultations() {
  const user = await getCurrentUser();
  if (!user) return null;

  const lang = await getLanguage();
  const doctors = await getConsultationDoctors(user.userId);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>{t(lang, "consult_title")}</h1>
        <p className={styles.pageSubtitle}>{t(lang, "consult_subtitle")}</p>
      </div>

      {doctors.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div className={styles.emptyTitle}>{t(lang, "consult_emptyTitle")}</div>
          <div className={styles.emptyText}>{t(lang, "consult_emptyText")}</div>
        </div>
      ) : (
        <div className={styles.doctorGrid}>
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
