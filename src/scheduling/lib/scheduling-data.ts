import { supabase } from "@/lib/supabase";
import type {
  Specialty,
  Doctor,
  Availability,
  Appointment,
  Message,
  ConsultationDoctor,
} from "@/scheduling/types/scheduling";

export async function getSpecialties(): Promise<Specialty[]> {
  const { data, error } = await supabase
    .from("specialties")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getDoctorsBySpecialty(specialtyId: string): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("specialty_id", specialtyId);
  if (error) throw error;
  return data;
}

export async function getAvailabilityForDoctor(
  doctorId: string,
  year: number,
  month: number
): Promise<Availability[]> {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const endMonth = month === 11 ? 1 : month + 2;
  const endYear = month === 11 ? year + 1 : year;
  const endDate = `${endYear}-${String(endMonth).padStart(2, "0")}-01`;

  const { data, error } = await supabase
    .from("availability")
    .select("*")
    .eq("doctor_id", doctorId)
    .gte("date", startDate)
    .lt("date", endDate);
  if (error) throw error;
  return data;
}

export async function getDoctorById(
  doctorId: string
): Promise<Doctor | null> {
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", doctorId)
    .single();
  if (error) return null;
  return data;
}

export async function getConsultationDoctors(
  userId: string
): Promise<ConsultationDoctor[]> {
  const { data: appointments, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("time", { ascending: false });
  if (error) throw error;
  if (!appointments || !appointments.length) return [];

  const doctorIds = [...new Set(appointments.map((a: Appointment) => a.doctor_id))];

  const { data: doctors, error: docError } = await supabase
    .from("doctors")
    .select("*")
    .in("id", doctorIds);
  if (docError) throw docError;

  const specialtyIds = [...new Set((doctors || []).map((d: Doctor) => d.specialty_id))];
  const { data: specialties } = await supabase
    .from("specialties")
    .select("*")
    .in("id", specialtyIds);

  const specialtyMap = new Map(
    (specialties || []).map((s: Specialty) => [s.id, s.name])
  );

  return (doctors || [])
    .map((doc: Doctor) => {
      const docAppointments = appointments.filter(
        (a: Appointment) => a.doctor_id === doc.id
      );
      return {
        ...doc,
        specialty_name: specialtyMap.get(doc.specialty_id) || "",
        appointments: docAppointments,
      };
    })
    .sort((a, b) => {
      const aDate = a.appointments[0]?.date + " " + a.appointments[0]?.time;
      const bDate = b.appointments[0]?.date + " " + b.appointments[0]?.time;
      return bDate.localeCompare(aDate);
    });
}

export async function getAppointmentsForDoctorAndUser(
  doctorId: string,
  userId: string
): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .order("time", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getMessagesForAppointment(
  appointmentId: string
): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("appointment_id", appointmentId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getDoctorProfileForUser(userId: string): Promise<Doctor | null> {
  const { data, error } = await supabase
    .from("app_users")
    .select("doctor_id")
    .eq("id", userId)
    .single();

  if (error || !data?.doctor_id) {
    return null;
  }

  return getDoctorById(data.doctor_id);
}

export async function getAppointmentsForDoctor(
  doctorId: string
): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getUpcomingAppointmentsForDoctor(
  doctorId: string
): Promise<Appointment[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
    .gte("date", today)
    .order("date", { ascending: true })
    .order("time", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function bookAppointment(params: {
  doctorId: string;
  specialtyId: string;
  date: string;
  time: string;
  userId?: string;
  patientName?: string;
}): Promise<string> {
  // Insert the appointment
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .insert({
      doctor_id: params.doctorId,
      specialty_id: params.specialtyId,
      date: params.date,
      time: params.time,
      patient_name: params.patientName ?? "",
      user_id: params.userId ?? null,
    })
    .select("id")
    .single();
  if (appointmentError) throw appointmentError;

  // Remove the booked slot from availability
  const { data: avail } = await supabase
    .from("availability")
    .select("id, slots")
    .eq("doctor_id", params.doctorId)
    .eq("date", params.date)
    .single();

  if (avail) {
    const updatedSlots = avail.slots.filter((s: string) => s !== params.time);
    await supabase
      .from("availability")
      .update({ slots: updatedSlots })
      .eq("id", avail.id);
  }

  return appointment.id;
}
