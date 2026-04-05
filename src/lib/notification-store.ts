import { supabaseRequest } from "./supabase-server";
import { listMedicalRecordsForUser } from "./medical-record-store";
import { listPrescriptionsForUser } from "./prescription-store";

type SupabaseAppointment = {
  id: string;
  doctor_id: string;
  date: string;
  time: string;
  patient_name: string;
  user_id: string | null;
  zoom_join_url?: string | null;
  created_at: string;
};

type SupabaseDoctor = {
  id: string;
  name: string;
};

type SupabaseMessage = {
  id: string;
  appointment_id: string;
  sender_type: "patient" | "doctor";
  content: string;
  created_at: string;
};

export type AppNotification = {
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

function buildDemoNotifications(): AppNotification[] {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return [
    {
      id: "demo-appointment",
      title: "Upcoming Appointment",
      timestamp: tomorrow.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
      description: "Dr. Sarah Mitchell has a follow-up visit reserved for your account.",
      cta: "View details",
      href: "/dashboard/schedule",
      tone: "blue",
      unread: true,
      sortDate: tomorrow.toISOString(),
    },
    {
      id: "demo-prescription",
      title: "Prescription Updated",
      timestamp: now.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
      }),
      description: "Metformin 500mg refill is ready to review in your prescriptions page.",
      cta: "Open prescriptions",
      href: "/dashboard/prescriptions",
      tone: "orange",
      unread: true,
      sortDate: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "demo-message",
      title: "New Message from Dr. Lee",
      timestamp: "2 hours ago",
      description: "Your recent lab results look good. Please schedule a follow-up.",
      cta: "Read message",
      href: "/dashboard/consultations",
      tone: "green",
      unread: true,
      sortDate: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ];
}

function isMissingTableError(error: unknown) {
  return error instanceof Error && error.message.includes("PGRST205");
}

async function safeListPrescriptionsForUser(userId: string) {
  try {
    return await listPrescriptionsForUser(userId);
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }

    throw error;
  }
}

async function safeListMedicalRecordsForUser(userId: string) {
  try {
    return await listMedicalRecordsForUser(userId);
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }

    throw error;
  }
}

function formatAppointmentTimestamp(date: string, time: string) {
  const datetime = new Date(`${date}T${time}:00`);

  return datetime.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateLabel(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export async function listNotificationsForUser(userId: string): Promise<AppNotification[]> {
  const today = new Date().toISOString().slice(0, 10);
  const appointments = await supabaseRequest<SupabaseAppointment[]>(
    `appointments?user_id=eq.${userId}&date=gte.${today}&select=*&order=date.asc&order=time.asc`,
    { method: "GET" },
  );

  const appointmentIds = appointments.map((item) => item.id);
  const doctorIds = [...new Set(appointments.map((item) => item.doctor_id))];

  const [doctors, prescriptions, medicalRecords, messages] = await Promise.all([
    doctorIds.length
      ? supabaseRequest<SupabaseDoctor[]>(
          `doctors?id=in.(${doctorIds.join(",")})&select=id,name`,
          { method: "GET" },
        )
      : Promise.resolve([]),
    safeListPrescriptionsForUser(userId),
    safeListMedicalRecordsForUser(userId),
    appointmentIds.length
      ? supabaseRequest<SupabaseMessage[]>(
          `messages?appointment_id=in.(${appointmentIds.join(",")})&sender_type=eq.doctor&select=*&order=created_at.desc`,
          { method: "GET" },
        )
      : Promise.resolve([]),
  ]);

  const doctorMap = new Map(doctors.map((doctor) => [doctor.id, doctor.name]));
  const notifications: AppNotification[] = [];

  const nextAppointment = appointments[0];
  if (nextAppointment) {
    notifications.push({
      id: `appointment-${nextAppointment.id}`,
      title: "Upcoming Appointment",
      timestamp: formatAppointmentTimestamp(nextAppointment.date, nextAppointment.time),
      description: `${doctorMap.get(nextAppointment.doctor_id) || "Your provider"} has a scheduled visit coming up.`,
      cta: "View details",
      href: "/dashboard/schedule",
      tone: "blue",
      unread: true,
      sortDate: `${nextAppointment.date}T${nextAppointment.time}:00`,
    });
  }

  const newestPrescription = prescriptions[0];
  if (newestPrescription) {
    notifications.push({
      id: `prescription-${newestPrescription.id}`,
      title:
        newestPrescription.status === "Pending"
          ? "Prescription Pending Review"
          : newestPrescription.status === "Expired"
            ? "Prescription Expired"
            : "Prescription Updated",
      timestamp: formatDateLabel(newestPrescription.createdAt),
      description: `${newestPrescription.medication} ${newestPrescription.dosage} from ${newestPrescription.doctor}.`,
      cta: "Open prescriptions",
      href: "/dashboard/prescriptions",
      tone: "orange",
      unread: true,
      sortDate: newestPrescription.createdAt,
    });
  }

  const latestDoctorMessage = messages[0];
  if (latestDoctorMessage) {
    const relatedAppointment = appointments.find(
      (appointment) => appointment.id === latestDoctorMessage.appointment_id,
    );

    notifications.push({
      id: `message-${latestDoctorMessage.id}`,
      title: `New Message from ${doctorMap.get(relatedAppointment?.doctor_id || "") || "your doctor"}`,
      timestamp: formatDateLabel(latestDoctorMessage.created_at),
      description: latestDoctorMessage.content,
      cta: "Read message",
      href: "/dashboard/consultations",
      tone: "green",
      unread: true,
      sortDate: latestDoctorMessage.created_at,
    });
  }

  const latestRecord = medicalRecords[0];
  if (latestRecord) {
    notifications.push({
      id: `record-${latestRecord.id}`,
      title:
        latestRecord.category === "lab_results" ? "New Lab Result" : "Medical Record Updated",
      timestamp: formatDateLabel(latestRecord.createdAt),
      description: `${latestRecord.title} was added to your records with status: ${latestRecord.status}.`,
      cta: "View record",
      href: latestRecord.category === "lab_results" ? "/dashboard/lab-results" : "/dashboard/records",
      tone: "blue",
      unread: true,
      sortDate: latestRecord.createdAt,
    });
  }

  const sortedNotifications = notifications
    .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
    .slice(0, 6);

  return sortedNotifications.length > 0 ? sortedNotifications : buildDemoNotifications();
}
