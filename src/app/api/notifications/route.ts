import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listNotificationsForUser } from "@/lib/notification-store";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const notifications = await listNotificationsForUser(user.userId);
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not load notifications." },
      { status: 500 },
    );
  }
}
