import { getCurrentUser } from "@/lib/auth";
import { listMedicalRecordsForUser } from "@/lib/medical-record-store";
import styles from "./page.module.css";
import { RecordsWorkspace } from "./RecordsWorkspace";

export default async function RecordsPage() {
  const user = await getCurrentUser();
  const records = user ? await listMedicalRecordsForUser(user.userId) : [];
  const uploadedRecords = records.filter((record) => record.category === "uploads");

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Medical Records</h1>
          <p className={styles.subtitle}>View and manage your health records.</p>
        </div>

        <label htmlFor="recordUploadInput" className={styles.uploadButton}>
          <svg viewBox="0 0 24 24">
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Upload New Record
        </label>
      </div>

      <RecordsWorkspace initialUploadedRecords={uploadedRecords} />
    </section>
  );
}
