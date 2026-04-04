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
  zoom_join_url?: string | null;
  zoom_meeting_id?: number | null;
  created_at: string;
}
