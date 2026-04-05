import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { supabaseRequest } from "@/lib/supabase-server";

export async function GET() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const patients = await supabaseRequest<any[]>(
      "app_users?role=eq.patient&select=id,full_name,email,created_at&order=created_at.desc",
      { method: "GET" }
    );

    return NextResponse.json({ patients });
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}
