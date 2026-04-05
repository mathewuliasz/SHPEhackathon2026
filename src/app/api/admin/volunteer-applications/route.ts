import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  listVolunteerApplications,
  updateVolunteerApplicationStatus,
} from "@/lib/volunteer-store";

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

export async function GET() {
  const user = await requireAdmin();

  if (!user) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const applications = await listVolunteerApplications();
  return NextResponse.json({ applications });
}

export async function PATCH(request: Request) {
  const user = await requireAdmin();

  if (!user) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as {
      applicationId?: string;
      status?: "approved" | "rejected";
    };

    if (!body.applicationId || !body.status) {
      return NextResponse.json(
        { error: "Application id and status are required." },
        { status: 400 },
      );
    }

    const application = await updateVolunteerApplicationStatus({
      applicationId: body.applicationId,
      status: body.status,
      reviewedByUserId: user.userId,
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, application });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to update application status." },
      { status: 500 },
    );
  }
}
