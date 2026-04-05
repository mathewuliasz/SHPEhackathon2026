import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDoctorById } from "@/scheduling/lib/scheduling-data";
import styles from "./page.module.css";

function getInitials(name: string) {
  return name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default async function DoctorProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/doctor/login");
  }

  if (user.role !== "doctor") {
    redirect(user.role === "admin" ? "/admin" : "/dashboard");
  }

  if (!user.doctorProfileId) {
    return (
      <div className={styles.emptyState}>
        <h1>Doctor profile not linked</h1>
        <p>Link this doctor account to a doctor profile in `app_users.doctor_id` first.</p>
      </div>
    );
  }

  const doctor = await getDoctorById(user.doctorProfileId);

  if (!doctor) {
    return (
      <div className={styles.emptyState}>
        <h1>Doctor record not found</h1>
        <p>The linked doctor profile could not be found in the `doctors` table.</p>
      </div>
    );
  }

  const initials = getInitials(doctor.name);

  return (
    <div className={styles.page}>
      <section className={styles.heroCard}>
        <div className={styles.heroIdentity}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <span className={styles.kicker}>Doctor Profile</span>
            <h1>{doctor.name}</h1>
            <p>
              Manage your professional identity, linked account, and the profile details
              patients see across the platform.
            </p>
          </div>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statCard}>
            <span>Account Role</span>
            <strong>Doctor</strong>
          </div>
          <div className={styles.statCard}>
            <span>Linked Account</span>
            <strong>{user.email}</strong>
          </div>
        </div>
      </section>

      <section className={styles.profileSummary}>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Display Name</span>
          <strong>{doctor.name}</strong>
          <p>Name shown to patients throughout appointments and messaging.</p>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Doctor Profile ID</span>
          <strong>{user.doctorProfileId}</strong>
          <p>Linked record used for scheduling, consultations, and dashboard access.</p>
        </article>
        <article className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Contact Email</span>
          <strong>{user.email}</strong>
          <p>Primary account email used for authentication and notifications.</p>
        </article>
      </section>

      <section className={styles.grid}>
        <article className={styles.card}>
          <h2>Account Details</h2>
          <div className={styles.detailList}>
            <div className={styles.detailItem}>
              <span>Full name</span>
              <strong>{user.fullName}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Doctor profile ID</span>
              <strong>{user.doctorProfileId}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Role</span>
              <strong>Doctor</strong>
            </div>
          </div>
        </article>

        <article className={styles.card}>
          <h2>Professional Details</h2>
          <div className={styles.detailList}>
            <div className={styles.detailItem}>
              <span>Display name</span>
              <strong>{doctor.name}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Bio</span>
              <strong>{doctor.bio}</strong>
            </div>
            <div className={styles.detailItem}>
              <span>Image URL</span>
              <strong>{doctor.image_url || "Not provided"}</strong>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
