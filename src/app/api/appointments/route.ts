import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getAllAppointmentsForUser } from "@/scheduling/lib/scheduling-data";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const appointments = await getAllAppointmentsForUser(user.userId);

    const doctorIds = [...new Set(appointments.map((a) => a.doctor_id))];
    const { data: doctors } = await supabase
      .from("doctors")
      .select("id, name")
      .in("id", doctorIds);

    const doctorMap = new Map(
      (doctors || []).map((d: { id: string; name: string }) => [d.id, d.name])
    );

    const enriched = appointments.map((a) => ({
      ...a,
      doctor_name: doctorMap.get(a.doctor_id) || "Unknown Doctor",
    }));

    return NextResponse.json({ appointments: enriched });
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}
