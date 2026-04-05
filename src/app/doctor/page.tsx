import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAppointmentsForDoctor, getDoctorById } from "@/scheduling/lib/scheduling-data";
import DoctorWorkspace from "./DoctorWorkspace";
import styles from "./page.module.css";

export default async function DoctorDashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/doctor/login");
  }

  if (user.role !== "doctor") {
    redirect(user.role === "admin" ? "/admin" : "/dashboard");
  }

  if (!user.doctorProfileId) {
    return (
      <div className={styles.unlinkedState}>
        <h1>Doctor profile not linked</h1>
        <p>
          This account has doctor access, but it is not linked to a doctor profile record yet.
          Update `app_users.doctor_id` in Supabase for this account.
        </p>
      </div>
    );
  }

  const [doctor, appointments] = await Promise.all([
    getDoctorById(user.doctorProfileId),
    getAppointmentsForDoctor(user.doctorProfileId),
  ]);

  if (!doctor) {
    return (
      <div className={styles.unlinkedState}>
        <h1>Doctor record not found</h1>
        <p>The linked doctor profile could not be found in the `doctors` table.</p>
      </div>
    );
  }

  const nextAppointment = appointments[0] ?? null;

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>Doctor Dashboard</span>
          <h1>Care delivery, messaging, and follow-up in one workspace.</h1>
          <p>
            Review today&apos;s visit queue, respond to patients, and keep your schedule
            moving without switching between tools.
          </p>
        </div>

        <div className={styles.heroRail}>
          <article className={styles.heroHighlight}>
            <span>Doctor on duty</span>
            <strong>{doctor.name}</strong>
            <p>{doctor.bio}</p>
          </article>

          <div className={styles.heroMetrics}>
            <article className={styles.metricCard}>
              <span>Assigned Visits</span>
              <strong>{appointments.length}</strong>
            </article>
            <article className={styles.metricCard}>
              <span>Next Patient</span>
              <strong>{nextAppointment?.patient_name || "None scheduled"}</strong>
            </article>
          </div>
        </div>
      </section>

      <DoctorWorkspace doctorName={doctor.name} appointments={appointments} />
    </div>
  );
}
