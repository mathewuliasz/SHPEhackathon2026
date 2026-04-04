type SupabaseUserRecord = {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export type StoredUser = {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseConfig() {
  if (!SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  return {
    url: SUPABASE_URL,
    key: SUPABASE_SERVICE_ROLE_KEY,
  };
}

function mapUser(record: SupabaseUserRecord): StoredUser {
  return {
    id: record.id,
    fullName: record.full_name,
    email: record.email,
    passwordHash: record.password_hash,
    createdAt: record.created_at,
  };
}

async function supabaseRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase request failed: ${message}`);
  }

  return (await response.json()) as T;
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
}) {
  const records = await supabaseRequest<SupabaseUserRecord[]>("app_users", {
    method: "POST",
    body: JSON.stringify([
      {
        full_name: input.fullName.trim(),
        email: input.email.trim().toLowerCase(),
        password_hash: input.passwordHash,
      },
    ]),
  });

  return mapUser(records[0]);
}
