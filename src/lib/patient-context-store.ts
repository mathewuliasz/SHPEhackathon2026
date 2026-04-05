import { supabaseRequest } from "./supabase-server";
import { listMedicalRecordsForUser } from "./medical-record-store";
import { listPrescriptionsForUser } from "./prescription-store";
import { getConsultationDoctors } from "@/scheduling/lib/scheduling-data";
import type { SessionUser } from "./auth";

type SupabasePatientContext = {
  user_id: string;
  context_text: string;
  updated_at: string;
};

export async function getCachedPatientContext(
  userId: string,
): Promise<string | null> {
  try {
    const rows = await supabaseRequest<SupabasePatientContext[]>(
      `app_patient_context?user_id=eq.${userId}&select=context_text`,
      { method: "GET" },
    );
    return rows.length > 0 ? rows[0].context_text : null;
  } catch {
    return null;
  }
}

export async function refreshPatientContext(user: SessionUser): Promise<void> {
  const [recordsResult, prescriptionsResult, consultationsResult] =
    await Promise.allSettled([
      listMedicalRecordsForUser(user.userId),
      listPrescriptionsForUser(user.userId),
      getConsultationDoctors(user.userId),
    ]);

  const records =
    recordsResult.status === "fulfilled" ? recordsResult.value : [];
  const prescriptions =
    prescriptionsResult.status === "fulfilled"
      ? prescriptionsResult.value
      : [];
  const consultations =
    consultationsResult.status === "fulfilled"
      ? consultationsResult.value
      : [];

  const lines: string[] = [
    `Patient: ${user.fullName} (${user.email})`,
    `\nPrescriptions (${prescriptions.length})`,
  ];

  if (prescriptions.length === 0) {
    lines.push("No prescriptions on file.");
  } else {
    for (const rx of prescriptions.slice(0, 20)) {
      lines.push(
        `- ${rx.medication} ${rx.dosage} — ${rx.doctor} (${rx.status}, ${rx.startDate} to ${rx.endDate})`,
      );
    }
  }

  lines.push(`\nMedical Records (${records.length})`);
  if (records.length === 0) {
    lines.push("No medical records on file.");
  } else {
    for (const rec of records.slice(0, 20)) {
      lines.push(
        `- [${rec.recordDate}] ${rec.title} — ${rec.status} — ${rec.doctor}`,
      );
      lines.push(`  Summary: ${rec.summary}`);
    }
  }

  lines.push(`\nConsultation History (${consultations.length})`);
  if (consultations.length === 0) {
    lines.push("No consultation history on file.");
  } else {
    for (const doc of consultations.slice(0, 20)) {
      const latest = doc.appointments[0];
      const latestInfo = latest
        ? `, most recent ${latest.date} at ${latest.time}`
        : "";
      lines.push(
        `- ${doc.name} (${doc.specialty_name}): ${doc.appointments.length} appointment(s)${latestInfo}`,
      );
    }
  }

  const contextText = lines.join("\n");

  try {
    await supabaseRequest<SupabasePatientContext[]>(
      "app_patient_context",
      {
        method: "POST",
        headers: {
          Prefer: "resolution=merge-duplicates,return=representation",
        },
        body: JSON.stringify([
          {
            user_id: user.userId,
            context_text: contextText,
            updated_at: new Date().toISOString(),
          },
        ]),
      },
    );
  } catch (err) {
    console.error("Failed to cache patient context:", err);
  }
}
