import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  createMedicalRecord,
  listMedicalRecordsForUser,
} from "@/lib/medical-record-store";
import { refreshPatientContext } from "@/lib/patient-context-store";

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

    const now = new Date().toISOString().slice(0, 10);
    const title = file.name.replace(/\.[^.]+$/, "").replace(/[_-]/g, " ") || "Uploaded Report";

    const record = await createMedicalRecord({
      userId: user.userId,
      title,
      doctor: "Unknown provider",
      recordDate: now,
      summary: "Medical report uploaded by patient.",
      status: "Reviewed",
      category: "uploads",
      sourceFileName: file.name,
    });

    refreshPatientContext(user).catch(() => {});
    return NextResponse.json({ ok: true, record });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not scan and save this medical report." },
      { status: 500 },
    );
  }
}
