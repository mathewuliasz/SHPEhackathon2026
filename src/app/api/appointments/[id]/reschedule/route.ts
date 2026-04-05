import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { rescheduleAppointment } from "@/scheduling/lib/scheduling-data";
import { refreshPatientContext } from "@/lib/patient-context-store";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { date, time } = body;

  if (!date || !time) {
    return NextResponse.json(
      { error: "Date and time are required" },
      { status: 400 }
    );
  }

  try {
    const updated = await rescheduleAppointment(id, user.userId, date, time);
    refreshPatientContext(user).catch(() => {});
    return NextResponse.json({ appointment: updated });
  } catch (err) {
    console.error("Reschedule failed:", err);
    return NextResponse.json(
      { error: "Failed to reschedule appointment" },
      { status: 500 }
    );
  }
}
