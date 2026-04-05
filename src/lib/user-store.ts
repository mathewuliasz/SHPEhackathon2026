import { supabaseRequest } from "./supabase-server";
import type { AppRole } from "./auth";

type SupabaseUserRecord = {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: AppRole;
  created_at: string;
};

export type StoredUser = {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: AppRole;
  createdAt: string;
};

function mapUser(record: SupabaseUserRecord): StoredUser {
  return {
    id: record.id,
    fullName: record.full_name,
    email: record.email,
    passwordHash: record.password_hash,
    role: record.role,
    createdAt: record.created_at,
  };
}

export async function findUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const records = await supabaseRequest<SupabaseUserRecord[]>(
    `app_users?email=eq.${encodeURIComponent(normalizedEmail)}&select=*`,
    {
      method: "GET",
    },
  );

  return records[0] ? mapUser(records[0]) : null;
}

export async function createUser(input: {
  fullName: string;
  email: string;
  passwordHash: string;
  role?: AppRole;
}) {
  const records = await supabaseRequest<SupabaseUserRecord[]>("app_users", {
    method: "POST",
    body: JSON.stringify([
      {
        full_name: input.fullName.trim(),
        email: input.email.trim().toLowerCase(),
        password_hash: input.passwordHash,
        role: input.role ?? "patient",
      },
    ]),
  });

  return mapUser(records[0]);
}

export async function updateUserPassword(input: {
  userId: string;
  passwordHash: string;
}) {
  const records = await supabaseRequest<SupabaseUserRecord[]>(
    `app_users?id=eq.${input.userId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        password_hash: input.passwordHash,
      }),
    },
  );

  return records[0] ? mapUser(records[0]) : null;
}
