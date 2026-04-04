import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  createMedicalRecord,
  listMedicalRecordsForUser,
  type MedicalRecordStatus,
} from "@/lib/medical-record-store";

type ScannedReport = {
  title: string;
  doctor: string;
  recordDate: string;
  summary: string;
  status: MedicalRecordStatus;
};

const REPORT_SCAN_PROMPT = `You are extracting structured information from a medical report image uploaded by a patient.
Read the document and return only valid JSON with this exact shape:
{
  "title": "short report title",
  "doctor": "provider name if visible, otherwise Unknown provider",
  "recordDate": "YYYY-MM-DD if visible, otherwise today's date",
  "summary": "1-2 sentence plain-English summary of the report",
  "status": "Reviewed"
}

Rules:
- Do not include markdown fences.
- Prefer concrete report names like CBC Report, MRI Scan Report, ECG Report, Blood Test Report.
- If the report suggests abnormal findings, you may use "Needs Attention" instead of "Reviewed".
- If you cannot read something, infer conservatively and keep the summary short.`;

function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "your-gemini-api-key-here") {
    throw new Error("Gemini API key not configured. Add GEMINI_API_KEY to .env.local");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

function cleanJson(text: string) {
  const trimmed = text.trim();

  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
  }

  return trimmed;
}

async function scanMedicalReport(file: File): Promise<ScannedReport> {
  const model = getGeminiModel();
  const bytes = Buffer.from(await file.arrayBuffer());
  const base64 = bytes.toString("base64");

  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: file.type,
        data: base64,
      },
    },
    REPORT_SCAN_PROMPT,
  ]);

  const rawText = result.response.text();
  const parsed = JSON.parse(cleanJson(rawText)) as Partial<ScannedReport>;
  const now = new Date().toISOString().slice(0, 10);

  return {
    title: parsed.title?.trim() || "Uploaded Report",
    doctor: parsed.doctor?.trim() || "Unknown provider",
    recordDate: parsed.recordDate?.trim() || now,
    summary: parsed.summary?.trim() || "Medical report uploaded and summarized.",
    status:
      parsed.status === "Needs Attention" ||
      parsed.status === "Reviewed" ||
      parsed.status === "Normal" ||
      parsed.status === "Borderline"
        ? parsed.status
        : "Reviewed",
  };
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const records = await listMedicalRecordsForUser(user.userId);
    return NextResponse.json({ records });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Medical records backend is not fully configured yet." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload an image file." },
        { status: 400 },
      );
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return NextResponse.json(
        { error: "Upload a JPG, PNG, or WEBP image." },
        { status: 400 },
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Please keep uploads under 10MB." },
        { status: 400 },
      );
    }

    const scannedReport = await scanMedicalReport(file);
    const record = await createMedicalRecord({
      userId: user.userId,
      title: scannedReport.title,
      doctor: scannedReport.doctor,
      recordDate: scannedReport.recordDate,
      summary: scannedReport.summary,
      status: scannedReport.status,
      category: "uploads",
      sourceFileName: file.name,
    });

    return NextResponse.json({ ok: true, record });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not scan and save this medical report." },
      { status: 500 },
    );
  }
}
