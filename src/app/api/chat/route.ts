import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  getCachedPatientContext,
  refreshPatientContext,
} from "@/lib/patient-context-store";

const SYSTEM_PROMPT = `You are a helpful medical assistant chatbot embedded in a health dashboard called MediTrack. You can help users with:

1. General medical questions (always remind them to consult a real doctor for serious concerns)
2. Navigating the site. Here are the available pages:
   - Dashboard (main page): Shows biomarker results organized by category (Hormonal Health, Metabolic Efficiency, Heart Health) with status indicators (Out of Range, Average, Optimal)
   - Doctor's via Specialty: Find doctors filtered by their medical specialty
   - Your Consultation/Chats: View and manage your consultation history and chat with doctors
   - View Current Prescriptions: See your active prescriptions and medication details
   - Medical Records/Meetings: Access your medical records and scheduled meetings
   - Your Profile: Manage your personal and medical profile information

Keep responses concise and friendly. If asked about specific biomarker values, explain what they mean in simple terms. Always recommend consulting a healthcare professional for medical decisions.

If patient context data is provided below, use it to answer questions about the patient's medical records, prescriptions, and appointments. Reference the actual data when relevant. Never fabricate data not listed. If a section is empty, tell the patient no records were found.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    return NextResponse.json(
      { error: "Gemini API key not configured. Add GEMINI_API_KEY to .env.local" },
      { status: 500 }
    );
  }

  const { messages } = await req.json();

  let systemInstruction = SYSTEM_PROMPT;
  const user = await getCurrentUser();
  if (user) {
    let context = await getCachedPatientContext(user.userId);
    if (context === null) {
      await refreshPatientContext(user);
      context = await getCachedPatientContext(user.userId);
    }
    if (context) {
      systemInstruction = SYSTEM_PROMPT + "\n\n---\nPatient Context:\n" + context;
    }
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: {
      role: "system",
      parts: [{ text: systemInstruction }],
    },
  });

  const historyMessages = messages.slice(0, -1);
  const firstUserIdx = historyMessages.findIndex(
    (m: { role: string }) => m.role === "user",
  );
  const validHistory =
    firstUserIdx === -1 ? [] : historyMessages.slice(firstUserIdx);

  const chat = model.startChat({
    history: validHistory.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  });

  const lastMessage = messages[messages.length - 1].content;

  try {
    const result = await chat.sendMessage(lastMessage);
    const text = result.response.text();
    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from Gemini" },
      { status: 500 }
    );
  }
}
