import { supabaseRequest } from "./supabase-server";

type SupabasePrescriptionRecord = {
  id: string;
  user_id: string;
  medication: string;
  dosage: string;
  start_date: string;
  end_date: string;
  doctor: string;
  status: "Active" | "Expired" | "Pending";
  created_at: string;
};

export type StoredPrescription = {
  id: string;
  userId: string;
  medication: string;
  dosage: string;
  startDate: string;
  endDate: string;
  doctor: string;
  status: "Active" | "Expired" | "Pending";
  createdAt: string;
};

function mapPrescription(
  record: SupabasePrescriptionRecord,
): StoredPrescription {
  return {
    id: record.id,
    userId: record.user_id,
    medication: record.medication,
    dosage: record.dosage,
    startDate: record.start_date,
    endDate: record.end_date,
    doctor: record.doctor,
    status: record.status,
    createdAt: record.created_at,
  };
}

export async function listPrescriptionsForUser(userId: string) {
  const records = await supabaseRequest<SupabasePrescriptionRecord[]>(
    `app_prescriptions?user_id=eq.${userId}&select=*&order=created_at.desc`,
    { method: "GET" },
  );

  return records.map(mapPrescription);
}

export async function createPrescription(input: {
  userId: string;
  medication: string;
  dosage: string;
  startDate: string;
  endDate: string;
  doctor: string;
  status: "Active" | "Expired" | "Pending";
}) {
  const records = await supabaseRequest<SupabasePrescriptionRecord[]>(
    "app_prescriptions",
    {
      method: "POST",
      body: JSON.stringify([
        {
          user_id: input.userId,
          medication: input.medication.trim(),
          dosage: input.dosage.trim(),
          start_date: input.startDate,
          end_date: input.endDate,
          doctor: input.doctor.trim(),
          status: input.status,
        },
      ]),
    },
  );

  return mapPrescription(records[0]);
}
