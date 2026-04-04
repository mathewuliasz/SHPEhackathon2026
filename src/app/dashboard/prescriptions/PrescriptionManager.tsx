"use client";

import { useMemo, useState, useTransition } from "react";
import type { StoredPrescription } from "@/lib/prescription-store";
import styles from "./page.module.css";

type PrescriptionManagerProps = {
  initialPrescriptions: StoredPrescription[];
};

type PrescriptionFormState = {
  medication: string;
  dosage: string;
  startDate: string;
  endDate: string;
  doctor: string;
  status: "Active" | "Expired" | "Pending";
};

const emptyForm: PrescriptionFormState = {
  medication: "",
  dosage: "",
  startDate: "",
  endDate: "",
  doctor: "",
  status: "Active",
};

export function PrescriptionManager({
  initialPrescriptions,
}: PrescriptionManagerProps) {
  const [prescriptions, setPrescriptions] =
    useState<StoredPrescription[]>(initialPrescriptions);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<PrescriptionFormState>(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredPrescriptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return prescriptions;
    }

    return prescriptions.filter((item) =>
      [item.medication, item.doctor, item.dosage]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [prescriptions, query]);

  function setField<Key extends keyof PrescriptionFormState>(
    key: Key,
    value: PrescriptionFormState[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    startTransition(async () => {
      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; prescription?: StoredPrescription }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Could not save your prescription.");
        return;
      }

      if (data?.prescription) {
        setPrescriptions((current) => [data.prescription!, ...current]);
      }
      setForm(emptyForm);
      setSuccess("Prescription saved for your account.");
    });
  }

  return (
    <>
      <form className={styles.formCard} onSubmit={handleSubmit}>
        <div className={styles.formHeader}>
          <div>
            <h2 className={styles.formTitle}>Add prescription</h2>
            <p className={styles.formSubtitle}>
              Save a medication record to this signed-in user.
            </p>
          </div>
          <button type="submit" className={styles.renewButton} disabled={isPending}>
            {isPending ? "Saving..." : "Save Prescription"}
          </button>
        </div>

        <div className={styles.formGrid}>
          <label className={styles.field}>
            <span>Medication</span>
            <input
              type="text"
              value={form.medication}
              onChange={(event) => setField("medication", event.target.value)}
              placeholder="Lisinopril"
            />
          </label>

          <label className={styles.field}>
            <span>Dosage</span>
            <input
              type="text"
              value={form.dosage}
              onChange={(event) => setField("dosage", event.target.value)}
              placeholder="10mg — Once daily"
            />
          </label>

          <label className={styles.field}>
            <span>Start Date</span>
            <input
              type="date"
              value={form.startDate}
              onChange={(event) => setField("startDate", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>End Date</span>
            <input
              type="date"
              value={form.endDate}
              onChange={(event) => setField("endDate", event.target.value)}
            />
          </label>

          <label className={styles.field}>
            <span>Doctor</span>
            <input
              type="text"
              value={form.doctor}
              onChange={(event) => setField("doctor", event.target.value)}
              placeholder="Dr. Sarah Chen"
            />
          </label>

          <label className={styles.field}>
            <span>Status</span>
            <select
              value={form.status}
              onChange={(event) =>
                setField(
                  "status",
                  event.target.value as PrescriptionFormState["status"],
                )
              }
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Expired">Expired</option>
            </select>
          </label>
        </div>

        {error ? <p className={styles.formError}>{error}</p> : null}
        {success ? <p className={styles.formSuccess}>{success}</p> : null}
      </form>

      <label className={styles.search}>
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Search medications or doctors..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className={styles.tableShell}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Doctor</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.length > 0 ? (
              filteredPrescriptions.map((item) => (
                <tr key={item.id}>
                  <td className={styles.medication}>{item.medication}</td>
                  <td className={styles.dosage}>{item.dosage}</td>
                  <td>{item.startDate}</td>
                  <td>{item.endDate}</td>
                  <td>{item.doctor}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        item.status === "Active"
                          ? styles.statusActive
                          : item.status === "Expired"
                            ? styles.statusExpired
                            : styles.statusPending
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className={styles.actionCell}>
                    <span className={styles.detailsText}>Saved to your account</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className={styles.emptyState} colSpan={7}>
                  No prescriptions found for this account yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
