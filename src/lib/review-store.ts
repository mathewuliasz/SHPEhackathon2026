import { supabaseRequest } from "./supabase-server";

type SupabaseReviewRecord = {
  id: string;
  name: string | null;
  location: string | null;
  content: string;
  rating: number;
  created_at: string;
};

export type StoredReview = {
  id: string;
  name: string;
  location: string;
  content: string;
  rating: number;
  createdAt: string;
};

function mapReview(record: SupabaseReviewRecord): StoredReview {
  return {
    id: record.id,
    name: record.name?.trim() || "Anonymous",
    location: record.location?.trim() || "Community Member",
    content: record.content,
    rating: record.rating,
    createdAt: record.created_at,
  };
}

export async function listReviews(limit = 20) {
  const records = await supabaseRequest<SupabaseReviewRecord[]>(
    `app_reviews?select=*&order=created_at.desc&limit=${limit}`,
    { method: "GET" },
  );

  return records.map(mapReview);
}

export async function createReview(input: {
  name?: string;
  location?: string;
  content: string;
  rating: number;
}) {
  const records = await supabaseRequest<SupabaseReviewRecord[]>("app_reviews", {
    method: "POST",
    body: JSON.stringify([
      {
        name: input.name?.trim() || null,
        location: input.location?.trim() || null,
        content: input.content.trim(),
        rating: input.rating,
      },
    ]),
  });

  return mapReview(records[0]);
}
