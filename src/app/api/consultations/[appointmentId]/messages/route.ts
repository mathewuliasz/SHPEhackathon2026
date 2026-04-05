import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { refreshPatientContext } from "@/lib/patient-context-store";

async function verifyOwnership(appointmentId: string, userId: string) {
  const { data } = await supabase
    .from("appointments")
    .select("id")
    .eq("id", appointmentId)
    .eq("user_id", userId)
    .single();
  return !!data;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { appointmentId } = await params;

  const owns = await verifyOwnership(appointmentId, user.userId);
  if (!owns) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("appointment_id", appointmentId)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ messages: data });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ appointmentId: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { appointmentId } = await params;

  const owns = await verifyOwnership(appointmentId, user.userId);
  if (!owns) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const content = body.content?.trim();
  if (!content) {
    return NextResponse.json({ error: "Content required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      appointment_id: appointmentId,
      sender_type: "patient",
      content,
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  refreshPatientContext(user).catch(() => {});
  return NextResponse.json({ message: data });
}
