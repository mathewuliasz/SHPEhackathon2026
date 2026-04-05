"use client";

import { useEffect, useState, useTransition } from "react";
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
          throw new Error(data.error ?? "Unable to load volunteer applications.");
        }

        setApplications(data.applications ?? []);
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  }, []);

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
        setError(data?.error ?? "Unable to update volunteer application.");
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
          <span className={styles.kicker}>Admin Review</span>
          <h2>Volunteer Access Approvals</h2>
          <p>Review incoming volunteer applications and approve or reject access.</p>
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
              <div><strong>Email:</strong> {application.email}</div>
              <div><strong>Phone:</strong> {application.phoneNumber || "Not provided"}</div>
              <div><strong>License:</strong> {application.medicalLicenseNumber}</div>
              <div><strong>Experience:</strong> {application.yearsOfExperience || "Not provided"}</div>
              <div><strong>Hours/Month:</strong> {application.hoursPerMonth || "Not provided"}</div>
              <div><strong>Submitted:</strong> {new Date(application.createdAt).toLocaleDateString()}</div>
            </div>

            <div className={styles.applicationBlock}>
              <strong>Languages</strong>
              <p>{application.languages.length > 0 ? application.languages.join(", ") : "None selected"}</p>
            </div>

            <div className={styles.applicationBlock}>
              <strong>Availability</strong>
              <p>{application.availability.length > 0 ? application.availability.join(", ") : "None selected"}</p>
            </div>

            <div className={styles.applicationBlock}>
              <strong>Motivation</strong>
              <p>{application.motivation || "No motivation statement provided."}</p>
            </div>

            <div className={styles.applicationActions}>
              <button
                type="button"
                className={styles.approveButton}
                onClick={() => updateStatus(application.id, "approved")}
                disabled={isPending}
              >
                Approve
              </button>
              <button
                type="button"
                className={styles.rejectButton}
                onClick={() => updateStatus(application.id, "rejected")}
                disabled={isPending}
              >
                Reject
              </button>
            </div>
          </article>
        ))}

        {applications.length === 0 && !error ? (
          <div className={styles.emptyState}>No volunteer applications submitted yet.</div>
        ) : null}
      </div>
    </section>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
