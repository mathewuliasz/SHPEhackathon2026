"use client";

import { useEffect, useState, useTransition } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

type VolunteerApplication = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  medicalLicenseNumber: string;
  licensingState: string;
  primarySpecialty: string;
  yearsOfExperience: string | null;
  languages: string[];
  availability: string[];
  hoursPerMonth: string | null;
  motivation: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export default function AdminVolunteerApplications() {
  const { t } = useLanguage();
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/admin/volunteer-applications")
      .then(async (response) => {
        const data = (await response.json()) as {
          applications?: VolunteerApplication[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error ?? t("admin_loadError"));
        }

        setApplications(data.applications ?? []);
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  }, [t]);

  function updateStatus(applicationId: string, status: "approved" | "rejected") {
    setError("");

    startTransition(async () => {
      const response = await fetch("/api/admin/volunteer-applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status }),
      });

      const data = (await response.json().catch(() => null)) as
        | { application?: VolunteerApplication; error?: string }
        | null;

      if (!response.ok || !data?.application) {
        setError(data?.error ?? t("admin_updateError"));
        return;
      }

      setApplications((current) =>
        current.map((item) => (item.id === applicationId ? data.application! : item)),
      );
    });
  }

  return (
    <section className={styles.reviewPanel}>
      <div className={styles.reviewPanelHeader}>
        <div>
          <span className={styles.kicker}>{t("admin_kicker")}</span>
          <h2>{t("admin_title")}</h2>
          <p>{t("admin_text")}</p>
        </div>
      </div>

      {error ? <p className={styles.errorMessage}>{error}</p> : null}

      <div className={styles.applicationList}>
        {applications.map((application) => (
          <article key={application.id} className={styles.applicationCard}>
            <div className={styles.applicationHeader}>
              <div>
                <h3>
                  {application.firstName} {application.lastName}
                </h3>
                <p>
                  {application.primarySpecialty} · {application.licensingState}
                </p>
              </div>
              <span className={`${styles.statusBadge} ${styles[`status${capitalize(application.status)}`]}`}>
                {application.status}
              </span>
            </div>

            <div className={styles.applicationMeta}>
              <div><strong>{t("admin_email")}</strong> {application.email}</div>
              <div><strong>{t("admin_phone")}</strong> {application.phoneNumber || t("admin_notProvided")}</div>
              <div><strong>{t("admin_license")}</strong> {application.medicalLicenseNumber}</div>
              <div><strong>{t("admin_experience")}</strong> {application.yearsOfExperience || t("admin_notProvided")}</div>
              <div><strong>{t("admin_hoursMonth")}</strong> {application.hoursPerMonth || t("admin_notProvided")}</div>
              <div><strong>{t("admin_submitted")}</strong> {new Date(application.createdAt).toLocaleDateString()}</div>
            </div>

            <div className={styles.applicationBlock}>
              <strong>{t("admin_languages")}</strong>
              <p>{application.languages.length > 0 ? application.languages.join(", ") : t("admin_noneSelected")}</p>
            </div>

            <div className={styles.applicationBlock}>
              <strong>{t("admin_availability")}</strong>
              <p>{application.availability.length > 0 ? application.availability.join(", ") : t("admin_noneSelected")}</p>
            </div>

            <div className={styles.applicationBlock}>
              <strong>{t("admin_motivation")}</strong>
              <p>{application.motivation || t("admin_noMotivation")}</p>
            </div>

            <div className={styles.applicationActions}>
              <button
                type="button"
                className={styles.approveButton}
                onClick={() => updateStatus(application.id, "approved")}
                disabled={isPending}
              >
                {t("admin_approve")}
              </button>
              <button
                type="button"
                className={styles.rejectButton}
                onClick={() => updateStatus(application.id, "rejected")}
                disabled={isPending}
              >
                {t("admin_reject")}
              </button>
            </div>
          </article>
        ))}

        {applications.length === 0 && !error ? (
          <div className={styles.emptyState}>{t("admin_empty")}</div>
        ) : null}
      </div>
    </section>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
