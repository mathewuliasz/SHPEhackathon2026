import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listNotificationsForDoctor } from "@/lib/doctor-notification-store";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "doctor" || !user.doctorProfileId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const notifications = await listNotificationsForDoctor(user.doctorProfileId);
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not load doctor notifications." }, { status: 500 });
  }
}
