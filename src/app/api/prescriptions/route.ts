import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  createPrescription,
  listPrescriptionsForUser,
} from "@/lib/prescription-store";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const prescriptions = await listPrescriptionsForUser(user.userId);
    return NextResponse.json({ prescriptions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Prescriptions backend is not fully configured yet." },
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

    const body = (await request.json()) as {
      medication?: string;
      dosage?: string;
      startDate?: string;
      endDate?: string;
      doctor?: string;
      status?: "Active" | "Expired" | "Pending";
    };

    const medication = body.medication?.trim() ?? "";
    const dosage = body.dosage?.trim() ?? "";
    const startDate = body.startDate?.trim() ?? "";
    const endDate = body.endDate?.trim() ?? "";
    const doctor = body.doctor?.trim() ?? "";
    const status = body.status;

    if (!medication || !dosage || !startDate || !endDate || !doctor) {
      return NextResponse.json(
        { error: "Please fill in all prescription fields." },
        { status: 400 },
      );
    }

    if (!status || !["Active", "Expired", "Pending"].includes(status)) {
      return NextResponse.json(
        { error: "Please select a valid prescription status." },
        { status: 400 },
      );
    }

    const prescription = await createPrescription({
      userId: user.userId,
      medication,
      dosage,
      startDate,
      endDate,
      doctor,
      status,
    });

    return NextResponse.json({ ok: true, prescription });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Prescriptions backend is not fully configured yet." },
      { status: 500 },
    );
  }
}
