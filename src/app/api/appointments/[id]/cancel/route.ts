import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { cancelAppointment } from "@/scheduling/lib/scheduling-data";
import { refreshPatientContext } from "@/lib/patient-context-store";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await cancelAppointment(id, user.userId);
    refreshPatientContext(user).catch(() => {});
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cancel failed:", err);
    return NextResponse.json(
      { error: "Failed to cancel appointment" },
      { status: 500 }
    );
  }
}
