import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDoctorById } from "@/scheduling/lib/scheduling-data";
import { listMedicalRecordsForDoctor } from "@/lib/medical-record-store";
import styles from "@/app/dashboard/records/page.module.css";

function statusClassName(status: string) {
  if (status === "Borderline" || status === "Needs Attention") {
    return styles.statusBorderline;
  }

  return styles.statusNormal;
}

export default async function DoctorLabResultsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/doctor/login");
  }

  if (user.role !== "doctor") {
    redirect(user.role === "admin" ? "/admin" : "/dashboard");
  }

  if (!user.doctorProfileId) {
    return (
      <section className={styles.page}>
        <article className={styles.emptyStateCard}>
          <h1 className={styles.title}>Doctor profile not linked</h1>
          <p className={styles.subtitle}>
            Link this doctor account to a doctor profile before reviewing lab results.
          </p>
        </article>
      </section>
    );
  }

  const doctor = await getDoctorById(user.doctorProfileId);

  if (!doctor) {
    return (
      <section className={styles.page}>
        <article className={styles.emptyStateCard}>
          <h1 className={styles.title}>Doctor record not found</h1>
          <p className={styles.subtitle}>
            The linked doctor profile could not be found in the doctors table.
          </p>
        </article>
      </section>
    );
  }

  const records = await listMedicalRecordsForDoctor(doctor.name);
  const labResults = records.filter((record) => record.category === "lab_results");

  return (
    <section className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Lab Results</h1>
          <p className={styles.subtitle}>
            Review lab records associated with {doctor.name} and prioritize follow-up.
          </p>
        </div>
      </div>

      {labResults.length === 0 ? (
        <article className={styles.emptyStateCard}>
          <h2 className={styles.cardTitle}>No lab results assigned yet</h2>
          <p className={styles.cardSummary}>
            When lab records reference this doctor, they will appear here automatically.
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
