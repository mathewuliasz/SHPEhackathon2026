export interface Specialty {
  id: string;
  name: string;
  icon: string;
  sort_order: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty_id: string;
  bio: string;
  image_url: string;
}

export interface Availability {
  id: string;
  doctor_id: string;
  date: string;
  slots: string[];
}

export interface Appointment {
  id: string;
  doctor_id: string;
  specialty_id: string;
  date: string;
  time: string;
  patient_name: string;
  user_id: string | null;
  zoom_join_url?: string | null;
  zoom_meeting_id?: number | null;
  recall_bot_id?: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  appointment_id: string;
  sender_type: "patient" | "doctor" | "system";
  content: string;
  created_at: string;
}

export interface ConsultationDoctor extends Doctor {
  specialty_name: string;
  appointments: Appointment[];
}
