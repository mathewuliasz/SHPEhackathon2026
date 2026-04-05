import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getRecallTranscript } from "@/lib/recall";
import { summarizeMeetingTranscript } from "@/lib/meeting-summarizer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log("Recall webhook received:", JSON.stringify(body, null, 2));

    // Payload structure: { event: "bot.done", data: { bot: { id: "..." }, data: { code: "done" } } }
    const event = body.event;
    const botId = body.data?.bot?.id;
    const statusCode = body.data?.data?.code;

    if (!botId) {
      console.warn("Recall webhook: no bot_id in payload");
      return NextResponse.json({ received: true });
    }

    // Only process when the bot is done (meeting ended, transcript ready)
    if (event !== "bot.done" && statusCode !== "done") {
      console.log(`Recall webhook: bot ${botId} event=${event} status=${statusCode}, ignoring`);
      return NextResponse.json({ received: true });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Look up the appointment by recall_bot_id
    const { data: appointment, error: lookupError } = await supabaseAdmin
      .from("appointments")
      .select("id, doctor_id, specialty_id")
      .eq("recall_bot_id", botId)
      .single();

    if (lookupError || !appointment) {
      console.warn("No appointment found for Recall bot:", botId);
      return NextResponse.json({ received: true, note: "no appointment match" });
    }

    // Fetch the transcript from Recall
    const plainText = await getRecallTranscript(botId);

    if (!plainText) {
      console.warn("Empty transcript for bot:", botId);
      await supabaseAdmin.from("messages").insert({
        appointment_id: appointment.id,
        sender_type: "system",
        content:
          "[Meeting ended but no transcript was captured. This may happen if the meeting was too short or had audio issues.]",
      });
      return NextResponse.json({ received: true, note: "empty transcript" });
    }

    // Get the meeting topic from the appointment context
    const { data: doctor } = await supabaseAdmin
      .from("doctors")
      .select("name")
      .eq("id", appointment.doctor_id)
      .single();

    const { data: specialty } = await supabaseAdmin
      .from("specialties")
      .select("name")
      .eq("id", appointment.specialty_id)
      .single();

    const meetingTopic = `${specialty?.name || "Medical"} Consultation with ${doctor?.name || "Doctor"}`;

    // Summarize with AI
    const summary = await summarizeMeetingTranscript(plainText, meetingTopic);

    // Insert summary into the consultation chat
    await supabaseAdmin.from("messages").insert({
      appointment_id: appointment.id,
      sender_type: "system",
      content: summary,
    });

    console.log("Meeting summary posted for appointment:", appointment.id);

    return NextResponse.json({ received: true, summarized: true });
  } catch (err) {
    console.error("Recall webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
