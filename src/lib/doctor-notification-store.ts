import { getDoctorById } from "@/scheduling/lib/scheduling-data";
import { listPrescriptionsForUser } from "./prescription-store";
import { supabaseRequest } from "./supabase-server";

type DoctorAppointment = {
  id: string;
  doctor_id: string;
  date: string;
  time: string;
  patient_name: string;
  user_id: string | null;
  created_at: string;
  zoom_join_url?: string | null;
};

type DoctorMessage = {
  id: string;
  appointment_id: string;
  sender_type: "patient" | "doctor";
  content: string;
  created_at: string;
};

type DoctorNotification = {
  id: string;
  title: string;
  timestamp: string;
  description: string;
  cta: string;
  href: string;
  tone: "blue" | "orange" | "green";
  unread: boolean;
  sortDate: string;
};

function formatDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatRelativeOrDate(value: string) {
  const target = new Date(value);
  const diffMs = Date.now() - target.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) {
    const diffMinutes = Math.max(1, Math.floor(diffMs / (1000 * 60)));
    return `${diffMinutes} min ago`;
  }

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  return target.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export async function listNotificationsForDoctor(doctorId: string): Promise<DoctorNotification[]> {
  const doctor = await getDoctorById(doctorId);

  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);
  const fifteenMinutesFromNow = new Date(today.getTime() + 15 * 60 * 1000);

  const appointments = await supabaseRequest<DoctorAppointment[]>(
    `appointments?doctor_id=eq.${doctorId}&date=gte.${todayIso}&select=*&order=date.asc&order=time.asc`,
    { method: "GET" },
  );

  const appointmentIds = appointments.map((item) => item.id);
  const patientIds = [...new Set(appointments.map((item) => item.user_id).filter(Boolean))] as string[];

  const [messages, pendingPrescriptionEntries] = await Promise.all([
    appointmentIds.length
      ? supabaseRequest<DoctorMessage[]>(
          `messages?appointment_id=in.(${appointmentIds.join(",")})&sender_type=eq.patient&select=*&order=created_at.desc`,
          { method: "GET" },
        )
      : Promise.resolve([]),
    patientIds.length
      ? Promise.all(patientIds.map((userId) => listPrescriptionsForUser(userId).catch(() => [])))
      : Promise.resolve([]),
  ]);

  const notifications: DoctorNotification[] = [];

  for (const appointment of appointments) {
    const appointmentTime = new Date(`${appointment.date}T${appointment.time}:00`);
    if (appointmentTime >= today && appointmentTime <= fifteenMinutesFromNow) {
      notifications.push({
        id: `appointment-${appointment.id}`,
        title: "Appointment Reminder",
        timestamp: formatDateTime(appointment.date, appointment.time),
        description: `${appointment.patient_name || "Patient"} begins in 15 minutes or less.`,
        cta: appointment.zoom_join_url ? "Open appointment" : "View schedule",
        href: "/doctor#appointments",
        tone: "blue",
        unread: true,
        sortDate: appointmentTime.toISOString(),
      });
    }
  }

  const latestPatientMessage = messages[0];
  if (latestPatientMessage) {
    const relatedAppointment = appointments.find(
      (appointment) => appointment.id === latestPatientMessage.appointment_id,
    );
    notifications.push({
      id: `message-${latestPatientMessage.id}`,
      title: "Unread Patient Message",
      timestamp: formatRelativeOrDate(latestPatientMessage.created_at),
      description: relatedAppointment?.patient_name
        ? `${relatedAppointment.patient_name}: ${latestPatientMessage.content}`
        : latestPatientMessage.content,
      cta: "Reply in messages",
      href: "/doctor#messages",
      tone: "green",
      unread: true,
      sortDate: latestPatientMessage.created_at,
    });
  }

  const pendingRefills = pendingPrescriptionEntries
    .flat()
    .filter((item) => item.status === "Pending")
    .filter((item) => {
      if (!doctor?.name) return true;
      return item.doctor.toLowerCase().includes(doctor.name.toLowerCase().replace(/^dr\.\s*/i, ""));
    });

  const latestRefill = pendingRefills[0];
  if (latestRefill) {
    notifications.push({
      id: `refill-${latestRefill.id}`,
      title: "Refill Request Pending",
      timestamp: formatRelativeOrDate(latestRefill.createdAt),
      description: `${latestRefill.medication} ${latestRefill.dosage} is waiting for review.`,
      cta: "Open prescriptions",
      href: "/dashboard/prescriptions",
      tone: "orange",
      unread: true,
      sortDate: latestRefill.createdAt,
    });
  }

  return notifications.sort((a, b) => b.sortDate.localeCompare(a.sortDate)).slice(0, 6);
}
