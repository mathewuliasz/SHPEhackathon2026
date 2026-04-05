import { getLanguage, t } from "@/lib/language";
import styles from "../records/page.module.css";

type LabResult = {
  id: string;
  title: string;
  doctor: string;
  date: string;
  summary: string;
  status: string;
  tone: "normal" | "borderline";
};

const labResults: LabResult[] = [
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

function statusClassName(tone: LabResult["tone"]) {
  return tone === "borderline" ? styles.statusBorderline : styles.statusNormal;
}

export default async function LabResultsPage() {
  const lang = await getLanguage();

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t(lang, "labResults_title")}</h1>
          <p className={styles.subtitle}>{t(lang, "labResults_subtitle")}</p>
        </div>
      </div>

      <div className={styles.grid}>
        {labResults.map((item) => (
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
          </article>
        ))}
      </div>
    </section>
  );
}
