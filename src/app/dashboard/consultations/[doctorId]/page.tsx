import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
  getDoctorById,
  getAppointmentsForDoctorAndUser,
} from "@/scheduling/lib/scheduling-data";
import ChatInterface from "./ChatInterface";
import styles from "./page.module.css";

export default async function ConsultationChat({
  params,
}: {
  params: Promise<{ doctorId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const { doctorId } = await params;

  const [doctor, appointments] = await Promise.all([
    getDoctorById(doctorId),
    getAppointmentsForDoctorAndUser(doctorId, user.userId),
  ]);

  if (!doctor || appointments.length === 0) {
    redirect("/dashboard/consultations");
  }

  const initials = doctor.name
    .replace(/^Dr\.\s*/, "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div>
      <Link href="/dashboard/consultations" className={styles.backLink}>
        <svg viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Back to consultations
      </Link>

      <div className={styles.doctorHeader}>
        <div className={styles.avatar}>{initials}</div>
        <div>
          <div className={styles.doctorName}>{doctor.name}</div>
        </div>
      </div>

      <ChatInterface
        appointments={appointments}
        doctorName={doctor.name}
      />
    </div>
  );
}
