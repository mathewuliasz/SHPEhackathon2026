import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listMedicalRecordsForUser } from "@/lib/medical-record-store";
import { listPrescriptionsForUser } from "@/lib/prescription-store";
import { supabaseRequest } from "@/lib/supabase-server";
import { getConsultationDoctors } from "@/scheduling/lib/scheduling-data";

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: "doctor" | "prescription" | "record" | "specialty";
};

type SupabaseSpecialty = {
  id: string;
  name: string;
};

function safeIncludes(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

async function listSpecialtiesSafe() {
  try {
    return await supabaseRequest<SupabaseSpecialty[]>("specialties?select=id,name&order=sort_order", {
      method: "GET",
    });
  } catch {
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const [consultationDoctors, prescriptions, records, specialties] = await Promise.all([
      getConsultationDoctors(user.userId).catch(() => []),
      listPrescriptionsForUser(user.userId).catch(() => []),
      listMedicalRecordsForUser(user.userId).catch(() => []),
      listSpecialtiesSafe(),
    ]);

    const doctorResults: SearchResult[] = consultationDoctors
      .filter(
        (doctor) =>
          safeIncludes(doctor.name, query) || safeIncludes(doctor.specialty_name || "", query),
      )
      .map((doctor) => ({
        id: `doctor-${doctor.id}`,
        title: doctor.name,
        subtitle: doctor.specialty_name || "Consultation doctor",
        href: "/dashboard/consultations",
        category: "doctor",
      }));

    const prescriptionResults: SearchResult[] = prescriptions
      .filter(
        (item) =>
          safeIncludes(item.medication, query) ||
          safeIncludes(item.doctor, query) ||
          safeIncludes(item.status, query),
      )
      .map((item) => ({
        id: `prescription-${item.id}`,
        title: item.medication,
        subtitle: `${item.dosage} · ${item.doctor}`,
        href: "/dashboard/prescriptions",
        category: "prescription",
      }));

    const recordResults: SearchResult[] = records
      .filter(
        (item) =>
          safeIncludes(item.title, query) ||
          safeIncludes(item.doctor, query) ||
          safeIncludes(item.summary, query) ||
          safeIncludes(item.category, query),
      )
      .map((item) => ({
        id: `record-${item.id}`,
        title: item.title,
        subtitle: `${item.category.replaceAll("_", " ")} · ${item.status}`,
        href: item.category === "lab_results" ? "/dashboard/lab-results" : "/dashboard/records",
        category: "record",
      }));

    const specialtyResults: SearchResult[] = specialties
      .filter((item) => safeIncludes(item.name, query))
      .map((item) => ({
        id: `specialty-${item.id}`,
        title: item.name,
        subtitle: "Specialty booking",
        href: `/dashboard/schedule?specialty=${item.id}`,
        category: "specialty",
      }));

    const results = [
      ...doctorResults,
      ...prescriptionResults,
      ...recordResults,
      ...specialtyResults,
    ].slice(0, 8);

    return NextResponse.json({ results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not search dashboard data." }, { status: 500 });
  }
}
