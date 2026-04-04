"use client";

import { useMemo, useState, useTransition } from "react";
import type { StoredMedicalRecord } from "@/lib/medical-record-store";
import styles from "./page.module.css";

type TabId = "lab-results" | "visit-history" | "uploads";

type RecordCard = {
  id: string;
  title: string;
  doctor: string;
  date: string;
  summary: string;
  status: string;
  tone:
    | "normal"
    | "borderline"
    | "completed"
    | "reviewed"
    | "needs-attention";
  sourceFileName?: string;
};

const labResults: RecordCard[] = [
  {
    id: "lab-cbc",
    title: "Complete Blood Count (CBC)",
    doctor: "Dr. Sarah Chen",
    date: "2024-05-20",
    summary: "All values within normal range.",
    status: "Normal",
    tone: "normal",
  },
  {
    id: "lab-hba1c",
    title: "HbA1c Test",
    doctor: "Dr. James Patel",
    date: "2024-04-15",
    summary: "HbA1c: 6.2% — Monitor closely.",
    status: "Borderline",
    tone: "borderline",
  },
  {
    id: "lab-lipid",
    title: "Lipid Panel",
    doctor: "Dr. Sarah Chen",
    date: "2024-03-10",
    summary: "LDL: 95 mg/dL, HDL: 55 mg/dL.",
    status: "Normal",
    tone: "normal",
  },
];

const visitHistory: RecordCard[] = [
  {
    id: "visit-annual",
    title: "Annual Physical Exam",
    doctor: "Dr. Maria Lopez",
    date: "2024-01-08",
    summary: "Routine annual checkup. No concerns.",
    status: "Completed",
    tone: "completed",
  },
  {
    id: "visit-cardio",
    title: "Cardiology Follow-up",
    doctor: "Dr. Sarah Chen",
    date: "2024-02-22",
    summary: "Blood pressure stable. Continue current regimen.",
    status: "Completed",
    tone: "completed",
  },
];

const tabs: Array<{
  id: TabId;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    id: "lab-results",
    label: "Lab Results",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="m12 3 2.8 5.6 6.2.9-4.5 4.4 1.1 6.1L12 17.3 6.4 20l1.1-6.1L3 9.5l6.2-.9L12 3Z" />
      </svg>
    ),
  },
  {
    id: "visit-history",
    label: "Visit History",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="5" y="4" width="14" height="16" rx="2" />
        <path d="M9 2v4" />
        <path d="M15 2v4" />
        <path d="M8 10h8" />
      </svg>
    ),
  },
  {
    id: "uploads",
    label: "Uploads",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 16V4" />
        <path d="m7 9 5-5 5 5" />
        <path d="M5 20h14" />
      </svg>
    ),
  },
];

function mapUploadedRecord(record: StoredMedicalRecord): RecordCard {
  return {
    id: record.id,
    title: record.title,
    doctor: record.doctor,
    date: record.recordDate,
    summary: record.summary,
    status: record.status,
    tone:
      record.status === "Needs Attention"
        ? "needs-attention"
        : record.status === "Borderline"
          ? "borderline"
          : record.status === "Normal"
            ? "normal"
            : "reviewed",
    sourceFileName: record.sourceFileName,
  };
}

function getCards(tab: TabId, uploadedRecords: RecordCard[]) {
  if (tab === "visit-history") {
    return visitHistory;
  }

  if (tab === "uploads") {
    return uploadedRecords;
  }

  return labResults;
}

function statusClassName(tone: RecordCard["tone"]) {
  switch (tone) {
    case "completed":
      return styles.statusCompleted;
    case "reviewed":
      return styles.statusReviewed;
    case "needs-attention":
      return styles.statusNeedsAttention;
    case "borderline":
      return styles.statusBorderline;
    default:
      return styles.statusNormal;
  }
}

export function RecordsWorkspace({
  initialUploadedRecords,
}: {
  initialUploadedRecords: StoredMedicalRecord[];
}) {
  const [activeTab, setActiveTab] = useState<TabId>("visit-history");
  const [uploadedRecords, setUploadedRecords] = useState<RecordCard[]>(
    initialUploadedRecords.map(mapUploadedRecord),
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cards = useMemo(
    () => getCards(activeTab, uploadedRecords),
    [activeTab, uploadedRecords],
  );

  async function uploadFile(file: File) {
    setError("");
    setSuccess("");
    setActiveTab("uploads");

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/records", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; record?: StoredMedicalRecord }
        | null;

      if (!response.ok) {
        setError(data?.error ?? "Could not scan and save this report.");
        return;
      }

      if (data?.record) {
        setUploadedRecords((current) => [mapUploadedRecord(data.record!), ...current]);
      }

      setSuccess("Report scanned and saved to this user account.");
    });
  }

  function handleFileSelection(fileList: FileList | null) {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    void uploadFile(file);
  }

  return (
    <>
      <input
        id="recordUploadInput"
        className={styles.hiddenInput}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(event) => {
          handleFileSelection(event.target.files);
          event.currentTarget.value = "";
        }}
      />

      <div className={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "uploads" ? (
        <div
          className={styles.uploadZone}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault();
            handleFileSelection(event.dataTransfer.files);
          }}
        >
          <span className={styles.uploadIcon}>
            <svg viewBox="0 0 24 24">
              <path d="M12 16V4" />
              <path d="m7 9 5-5 5 5" />
              <path d="M5 20h14" />
            </svg>
          </span>
          <strong>Drag & drop files here</strong>
          <p>PDF screenshots as images, JPG, PNG, or WEBP up to 10MB</p>
          <label htmlFor="recordUploadInput" className={styles.browseButton}>
            {isPending ? "Scanning..." : "Browse Files"}
          </label>
          {error ? <p className={styles.formError}>{error}</p> : null}
          {success ? <p className={styles.formSuccess}>{success}</p> : null}
        </div>
      ) : null}

      <div className={styles.grid}>
        {cards.length > 0 ? (
          cards.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <span className={`${styles.status} ${statusClassName(item.tone)}`}>
                  {item.status}
                </span>
              </div>

              <p className={styles.cardMeta}>
                {item.doctor} • {item.date}
              </p>
              <p className={styles.cardSummary}>{item.summary}</p>
              {item.sourceFileName ? (
                <p className={styles.cardSource}>Source: {item.sourceFileName}</p>
              ) : null}
            </article>
          ))
        ) : (
          <div className={styles.emptyState}>
            No uploaded records yet. Add a report image to generate a web summary.
          </div>
        )}
      </div>
    </>
  );
}
