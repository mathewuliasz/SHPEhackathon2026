import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { supabaseRequest } from "@/lib/supabase-server";

export async function GET() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // Join with doctors and specialties to get labels
    const appointments = await supabaseRequest<any[]>(
      "appointments?select=*,doctors(name),specialties(name)&order=date.desc,time.desc",
      { method: "GET" }
    );

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}
