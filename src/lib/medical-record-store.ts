import { supabaseRequest } from "./supabase-server";

export type MedicalRecordCategory = "lab_results" | "visit_history" | "uploads";
export type MedicalRecordStatus =
  | "Normal"
  | "Borderline"
  | "Reviewed"
  | "Needs Attention";

type SupabaseMedicalRecord = {
  id: string;
  user_id: string;
  title: string;
  doctor: string | null;
  record_date: string;
  summary: string;
  status: MedicalRecordStatus;
  category: MedicalRecordCategory;
  source_file_name: string | null;
  created_at: string;
};

export type StoredMedicalRecord = {
  id: string;
  userId: string;
  title: string;
  doctor: string;
  recordDate: string;
  summary: string;
  status: MedicalRecordStatus;
  category: MedicalRecordCategory;
  sourceFileName: string;
  createdAt: string;
};

function mapMedicalRecord(record: SupabaseMedicalRecord): StoredMedicalRecord {
  return {
    id: record.id,
    userId: record.user_id,
    title: record.title,
    doctor: record.doctor?.trim() || "Unknown provider",
    recordDate: record.record_date,
    summary: record.summary,
    status: record.status,
    category: record.category,
    sourceFileName: record.source_file_name?.trim() || "",
    createdAt: record.created_at,
  };
}

export async function listMedicalRecordsForUser(userId: string) {
  const records = await supabaseRequest<SupabaseMedicalRecord[]>(
    `app_medical_records?user_id=eq.${userId}&select=*&order=record_date.desc&order=created_at.desc`,
    { method: "GET" },
  );

  return records.map(mapMedicalRecord);
}

export async function listMedicalRecordsForDoctor(doctorName: string) {
  const trimmedName = doctorName.trim();
  const normalizedName = trimmedName.replace(/^Dr\.\s*/i, "");
  const candidates = Array.from(
    new Set([trimmedName, normalizedName, `Dr. ${normalizedName}`].filter(Boolean)),
  );

  const resultSets = await Promise.all(
    candidates.map(async (candidate) => {
      const records = await supabaseRequest<SupabaseMedicalRecord[]>(
        `app_medical_records?doctor=ilike.*${encodeURIComponent(candidate)}*&select=*&order=record_date.desc&order=created_at.desc`,
        { method: "GET" },
      );

      return records.map(mapMedicalRecord);
    }),
  );

  const deduped = new Map<string, StoredMedicalRecord>();
  for (const records of resultSets) {
    for (const record of records) {
      deduped.set(record.id, record);
    }
  }

  return Array.from(deduped.values()).sort((a, b) =>
    `${b.recordDate}${b.createdAt}`.localeCompare(`${a.recordDate}${a.createdAt}`),
  );
}

export async function createMedicalRecord(input: {
  userId: string;
  title: string;
  doctor?: string;
  recordDate: string;
  summary: string;
  status: MedicalRecordStatus;
  category: MedicalRecordCategory;
  sourceFileName?: string;
}) {
  const records = await supabaseRequest<SupabaseMedicalRecord[]>(
    "app_medical_records",
    {
      method: "POST",
      body: JSON.stringify([
        {
          user_id: input.userId,
          title: input.title.trim(),
          doctor: input.doctor?.trim() || null,
          record_date: input.recordDate,
          summary: input.summary.trim(),
          status: input.status,
          category: input.category,
          source_file_name: input.sourceFileName?.trim() || null,
        },
      ]),
    },
  );

  return mapMedicalRecord(records[0]);
}
