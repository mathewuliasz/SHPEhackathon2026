import { supabase } from "@/lib/supabase";
import type { Specialty, Doctor, Availability } from "@/scheduling/types/scheduling";

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

export async function bookAppointment(params: {
  doctorId: string;
  specialtyId: string;
  date: string;
  time: string;
}): Promise<string> {
  // Insert the appointment
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .insert({
      doctor_id: params.doctorId,
      specialty_id: params.specialtyId,
      date: params.date,
      time: params.time,
      patient_name: "",
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
