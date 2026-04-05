import { getCurrentUser } from "@/lib/auth";
import { getLanguage, t } from "@/lib/language";
import { listMedicalRecordsForUser } from "@/lib/medical-record-store";
import styles from "../records/page.module.css";

function statusClassName(status: string) {
  if (status === "Borderline" || status === "Needs Attention") {
    return styles.statusBorderline;
  }

  return styles.statusNormal;
}

export default async function LabResultsPage() {
  const user = await getCurrentUser();
  const lang = await getLanguage();
  const records = user ? await listMedicalRecordsForUser(user.userId) : [];
  const labResults = records.filter((record) => record.category === "lab_results");

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t(lang, "labResults_title")}</h1>
          <p className={styles.subtitle}>{t(lang, "labResults_subtitle")}</p>
        </div>
      </div>

      {labResults.length === 0 ? (
        <article className={styles.emptyStateCard}>
          <h2 className={styles.cardTitle}>No lab results yet</h2>
          <p className={styles.cardSummary}>
            When lab records are added to your account, they will appear here.
          </p>
        </article>
      ) : (
        <div className={styles.grid}>
          {labResults.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.cardTop}>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                <span className={`${styles.status} ${statusClassName(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <p className={styles.cardMeta}>
                {item.doctor} • {item.recordDate}
              </p>
              <p className={styles.cardSummary}>{item.summary}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
