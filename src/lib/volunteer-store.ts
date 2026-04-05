import { supabaseRequest } from "./supabase-server";

export type VolunteerApplicationStatus = "pending" | "approved" | "rejected";

type VolunteerApplicationRecord = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  medical_license_number: string;
  licensing_state: string;
  primary_specialty: string;
  years_of_experience: string | null;
  languages: string[];
  availability: string[];
  hours_per_month: string | null;
  motivation: string | null;
  status: VolunteerApplicationStatus;
  reviewed_by_user_id: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type VolunteerApplication = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  medicalLicenseNumber: string;
  licensingState: string;
  primarySpecialty: string;
  yearsOfExperience: string | null;
  languages: string[];
  availability: string[];
  hoursPerMonth: string | null;
  motivation: string | null;
  status: VolunteerApplicationStatus;
  reviewedByUserId: string | null;
  reviewedAt: string | null;
  createdAt: string;
};

function mapApplication(record: VolunteerApplicationRecord): VolunteerApplication {
  return {
    id: record.id,
    firstName: record.first_name,
    lastName: record.last_name,
    email: record.email,
    phoneNumber: record.phone_number,
    medicalLicenseNumber: record.medical_license_number,
    licensingState: record.licensing_state,
    primarySpecialty: record.primary_specialty,
    yearsOfExperience: record.years_of_experience,
    languages: record.languages,
    availability: record.availability,
    hoursPerMonth: record.hours_per_month,
    motivation: record.motivation,
    status: record.status,
    reviewedByUserId: record.reviewed_by_user_id,
    reviewedAt: record.reviewed_at,
    createdAt: record.created_at,
  };
}

export async function createVolunteerApplication(input: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  medicalLicenseNumber: string;
  licensingState: string;
  primarySpecialty: string;
  yearsOfExperience?: string;
  languages: string[];
  availability: string[];
  hoursPerMonth?: string;
  motivation?: string;
}) {
  const records = await supabaseRequest<VolunteerApplicationRecord[]>("volunteer_applications", {
    method: "POST",
    body: JSON.stringify([
      {
        first_name: input.firstName.trim(),
        last_name: input.lastName.trim(),
        email: input.email.trim().toLowerCase(),
        phone_number: input.phoneNumber?.trim() || null,
        medical_license_number: input.medicalLicenseNumber.trim(),
        licensing_state: input.licensingState.trim(),
        primary_specialty: input.primarySpecialty.trim(),
        years_of_experience: input.yearsOfExperience?.trim() || null,
        languages: input.languages,
        availability: input.availability,
        hours_per_month: input.hoursPerMonth?.trim() || null,
        motivation: input.motivation?.trim() || null,
      },
    ]),
  });

  return mapApplication(records[0]);
}

export async function listVolunteerApplications() {
  const records = await supabaseRequest<VolunteerApplicationRecord[]>(
    "volunteer_applications?select=*&order=created_at.desc",
    { method: "GET" },
  );

  return records.map(mapApplication);
}

export async function updateVolunteerApplicationStatus(input: {
  applicationId: string;
  status: VolunteerApplicationStatus;
  reviewedByUserId: string;
}) {
  const records = await supabaseRequest<VolunteerApplicationRecord[]>(
    `volunteer_applications?id=eq.${input.applicationId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        status: input.status,
        reviewed_by_user_id: input.reviewedByUserId,
        reviewed_at: new Date().toISOString(),
      }),
    },
  );

  return records[0] ? mapApplication(records[0]) : null;
}
