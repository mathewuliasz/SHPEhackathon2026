import { NextRequest, NextResponse } from "next/server";
import { createZoomMeeting } from "@/lib/zoom";
import { sendAppointmentConfirmation } from "@/lib/email";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      appointmentId: string;
      doctorName: string;
      specialtyName: string;
      date: string;
      time: string;
    };

    if (!body.appointmentId || !body.doctorName || !body.date || !body.time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const startTime = `${body.date}T${body.time}:00`;

    const meeting = await createZoomMeeting({
      topic: `${body.specialtyName} Appointment with ${body.doctorName}`,
      startTime,
      durationMinutes: 30,
    });

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: updateError } = await supabaseAdmin
      .from("appointments")
      .update({
        zoom_join_url: meeting.join_url,
        zoom_meeting_id: meeting.meeting_id,
      })
      .eq("id", body.appointmentId);

    if (updateError) {
      console.error("Failed to save Zoom link to appointment:", updateError);
    }

    // Send confirmation email to logged-in user
    try {
      const user = await getCurrentUser();
      if (user) {
        await sendAppointmentConfirmation({
          toEmail: user.email,
          patientName: user.fullName,
          doctorName: body.doctorName,
          specialtyName: body.specialtyName,
          date: body.date,
          time: body.time,
          zoomLink: meeting.join_url,
        });
      }
    } catch (emailErr) {
      console.error("Failed to send confirmation email:", emailErr);
    }

    return NextResponse.json({
      join_url: meeting.join_url,
      meeting_id: meeting.meeting_id,
    });
  } catch (error) {
    console.error("Zoom meeting creation error:", error);
    return NextResponse.json(
      { error: "Failed to create Zoom meeting" },
      { status: 500 }
    );
  }
}
