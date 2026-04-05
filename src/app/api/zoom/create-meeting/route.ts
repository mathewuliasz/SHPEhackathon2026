import { NextRequest, NextResponse } from "next/server";
import { createZoomMeeting } from "@/lib/zoom";
import { sendAppointmentConfirmation } from "@/lib/email";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { createRecallBot } from "@/lib/recall";

const PREREQ_DOCUMENTS: Record<string, string> = {
  "General Practice": `📋 PRE-APPOINTMENT CHECKLIST — General Practice

Welcome! To help your doctor make the most of your visit, please prepare the following:

1. CURRENT MEDICATIONS — List all prescriptions, over-the-counter drugs, and supplements you take, including dosages.

2. SYMPTOMS LOG — Note any symptoms you've been experiencing, when they started, and how often they occur.

3. MEDICAL HISTORY UPDATE — Any new diagnoses, surgeries, or ER visits since your last appointment.

4. VITALS (if available) — Recent blood pressure readings, weight, or blood sugar levels from home monitoring.

5. INSURANCE CARD — Have your current insurance card ready for verification.

6. QUESTIONS — Write down any questions or concerns you'd like to discuss.

Please arrive 10 minutes early for check-in. We look forward to seeing you!`,

  "Cardiology": `❤️ PRE-APPOINTMENT CHECKLIST — Cardiology

To ensure a thorough cardiac evaluation, please prepare the following before your visit:

1. BLOOD PRESSURE LOG — Record your blood pressure readings for the past 2 weeks (morning and evening if possible).

2. CURRENT MEDICATIONS — List all heart-related medications (beta-blockers, blood thinners, statins, etc.) with dosages and frequency.

3. SYMPTOM DIARY — Note any episodes of chest pain, shortness of breath, palpitations, dizziness, or swelling, including time of day and triggers.

4. EXERCISE TOLERANCE — Be ready to describe your typical activity level and any recent changes in exercise tolerance.

5. PREVIOUS TEST RESULTS — Bring copies of recent EKGs, echocardiograms, stress tests, or lab work from other providers.

6. FAMILY HISTORY — Note any family history of heart disease, sudden cardiac death, or stroke.

7. DIETARY HABITS — Be prepared to discuss sodium intake, alcohol consumption, and caffeine use.

Please avoid caffeine for 24 hours before your appointment if a stress test is scheduled.`,

  "Dermatology": `🧴 PRE-APPOINTMENT CHECKLIST — Dermatology

To help your dermatologist provide the best care, please prepare the following:

1. SKIN CONCERN PHOTOS — Take photos of any skin changes, rashes, or moles you want evaluated (especially if they come and go).

2. TIMELINE — Note when the skin issue first appeared and how it has changed over time.

3. CURRENT SKINCARE ROUTINE — List all products you use (cleansers, moisturizers, serums, sunscreens).

4. MEDICATIONS — List any current medications, including topical treatments, antibiotics, or retinoids.

5. ALLERGY HISTORY — Note any known allergies to skincare ingredients, latex, or medications.

6. SUN EXPOSURE — Be prepared to discuss your sun exposure habits and sunscreen use.

7. MAKEUP-FREE — Please arrive with clean, makeup-free skin on the areas of concern.

Please wear loose, comfortable clothing for easy examination access.`,

  "Orthopedics": `🦴 PRE-APPOINTMENT CHECKLIST — Orthopedics

To help your orthopedic specialist evaluate your condition, please prepare the following:

1. PAIN DESCRIPTION — Note the location, intensity (1-10 scale), and type of pain (sharp, dull, aching, burning).

2. INJURY HISTORY — Describe how and when the injury occurred, or when symptoms first began.

3. IMAGING — Bring any X-rays, MRIs, or CT scans on disc or have them sent to our office beforehand.

4. ACTIVITY LIMITATIONS — Describe specific movements or activities that worsen or improve your symptoms.

5. PREVIOUS TREATMENTS — List any prior treatments (physical therapy, injections, braces, surgery) and their effectiveness.

6. CURRENT MEDICATIONS — Include pain relievers, anti-inflammatories, and supplements.

7. WORK & ACTIVITY LEVEL — Describe your occupation and physical activity level.

Please wear shorts or loose clothing to allow easy access to the affected area. Bring supportive footwear if your concern is foot/ankle related.`,

  "Neurology": `🧠 PRE-APPOINTMENT CHECKLIST — Neurology

To help your neurologist provide a comprehensive evaluation, please prepare the following:

1. SYMPTOM JOURNAL — Document headaches, numbness, tingling, weakness, memory issues, or seizure episodes with dates, duration, and triggers.

2. HEADACHE DIARY (if applicable) — Track frequency, location, severity, associated symptoms (nausea, light sensitivity), and what provides relief.

3. SLEEP PATTERNS — Note your typical sleep schedule, quality, any snoring, and daytime sleepiness.

4. CURRENT MEDICATIONS — List all medications including those for pain, mood, sleep, and seizure management.

5. PREVIOUS NEUROLOGICAL TESTS — Bring results from prior EEGs, MRIs of the brain/spine, nerve conduction studies, or lumbar punctures.

6. FAMILY HISTORY — Note any family history of neurological conditions (epilepsy, MS, Parkinson's, Alzheimer's, migraines).

7. COGNITIVE CHANGES — Be prepared to discuss any changes in memory, concentration, speech, or mood.

Please bring a family member or close friend who can provide additional observations about your symptoms.`,
};

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

    // Create Recall.ai bot to join and transcribe the meeting
    try {
      const bot = await createRecallBot(
        meeting.join_url,
        "MediTrack AI Notetaker"
      );
      await supabaseAdmin
        .from("appointments")
        .update({ recall_bot_id: bot.id })
        .eq("id", body.appointmentId);
      console.log("Recall bot created:", bot.id);
    } catch (recallErr) {
      console.error("Failed to create Recall bot:", recallErr);
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

    // Insert pre-req document as automated doctor message in the consultation chat
    try {
      const prereqContent = PREREQ_DOCUMENTS[body.specialtyName];
      if (prereqContent) {
        await supabaseAdmin.from("messages").insert({
          appointment_id: body.appointmentId,
          sender_type: "doctor",
          content: prereqContent,
        });
      }
    } catch (prereqErr) {
      console.error("Failed to insert pre-req message:", prereqErr);
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
