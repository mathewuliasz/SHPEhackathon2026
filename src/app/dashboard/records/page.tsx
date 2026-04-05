import { getCurrentUser } from "@/lib/auth";
import { getLanguage, t } from "@/lib/language";
import { listMedicalRecordsForUser } from "@/lib/medical-record-store";
import styles from "./page.module.css";
import { RecordsWorkspace } from "./RecordsWorkspace";

export default async function RecordsPage() {
  const user = await getCurrentUser();
  const lang = await getLanguage();
  const records = user ? await listMedicalRecordsForUser(user.userId) : [];
  const uploadedRecords = records.filter((record) => record.category === "uploads");

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t(lang, "records_title")}</h1>
          <p className={styles.subtitle}>{t(lang, "records_subtitle")}</p>
        </div>

        <label htmlFor="recordUploadInput" className={styles.uploadButton}>
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          {t(lang, "records_upload")}
        </label>
      </div>

      <RecordsWorkspace initialUploadedRecords={uploadedRecords} />
    </section>
  );
}
