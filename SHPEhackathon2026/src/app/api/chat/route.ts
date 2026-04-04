import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a helpful medical assistant chatbot embedded in a health dashboard called MediTrack. You can help users with:

1. General medical questions (always remind them to consult a real doctor for serious concerns)
2. Navigating the site. Here are the available pages:
   - Dashboard (main page): Shows biomarker results organized by category (Hormonal Health, Metabolic Efficiency, Heart Health) with status indicators (Out of Range, Average, Optimal)
   - Doctor's via Specialty: Find doctors filtered by their medical specialty
   - Your Consultation/Chats: View and manage your consultation history and chat with doctors
   - View Current Prescriptions: See your active prescriptions and medication details
   - Medical Records/Meetings: Access your medical records and scheduled meetings
   - Your Profile: Manage your personal and medical profile information

Keep responses concise and friendly. If asked about specific biomarker values, explain what they mean in simple terms. Always recommend consulting a healthcare professional for medical decisions.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    return NextResponse.json(
      { error: "Gemini API key not configured. Add GEMINI_API_KEY to .env.local" },
      { status: 500 }
    );
  }

  const { messages } = await req.json();

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const chat = model.startChat({
    history: messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    systemInstruction: SYSTEM_PROMPT,
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
