import { createHash, randomBytes } from "node:crypto";
import { supabaseRequest } from "./supabase-server";

type SupabasePasswordResetRecord = {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  created_at: string;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createResetTokenValue() {
  return randomBytes(24).toString("hex");
}

export async function createPasswordResetToken(input: {
  userId: string;
  expiresAt: string;
  token: string;
}) {
  const records = await supabaseRequest<SupabasePasswordResetRecord[]>(
    "app_password_resets",
    {
      method: "POST",
      body: JSON.stringify([
        {
          user_id: input.userId,
          token_hash: hashToken(input.token),
          expires_at: input.expiresAt,
        },
      ]),
    },
  );

  return records[0] ?? null;
}

export async function findValidPasswordResetToken(token: string) {
  const tokenHash = hashToken(token);
  const records = await supabaseRequest<SupabasePasswordResetRecord[]>(
    `app_password_resets?token_hash=eq.${tokenHash}&select=*&order=created_at.desc&limit=1`,
    { method: "GET" },
  );
  const record = records[0];

  if (!record) {
    return null;
  }

  if (new Date(record.expires_at).getTime() <= Date.now()) {
    return null;
  }

  return record;
}

export async function deletePasswordResetToken(id: string) {
  await supabaseRequest<SupabasePasswordResetRecord[]>(
    `app_password_resets?id=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        Prefer: "return=minimal",
      },
    },
  );
}
