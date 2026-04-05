import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { refreshPatientContext } from "@/lib/patient-context-store";

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await refreshPatientContext(user);
  return NextResponse.json({ ok: true });
}
