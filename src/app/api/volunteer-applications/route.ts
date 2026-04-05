import { NextResponse } from "next/server";
import { createVolunteerApplication } from "@/lib/volunteer-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      medicalLicenseNumber?: string;
      licensingState?: string;
      primarySpecialty?: string;
      yearsOfExperience?: string;
      languages?: string[];
      availability?: string[];
      hoursPerMonth?: string;
      motivation?: string;
      acceptedTerms?: boolean;
    };

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const medicalLicenseNumber = body.medicalLicenseNumber?.trim() ?? "";
    const licensingState = body.licensingState?.trim() ?? "";
    const primarySpecialty = body.primarySpecialty?.trim() ?? "";
    const languages = Array.isArray(body.languages) ? body.languages.filter(Boolean) : [];
    const availability = Array.isArray(body.availability) ? body.availability.filter(Boolean) : [];

    if (!firstName || !lastName || !email || !medicalLicenseNumber || !licensingState || !primarySpecialty) {
      return NextResponse.json(
        { error: "Please fill in all required volunteer application fields." },
        { status: 400 },
      );
    }

    if (!body.acceptedTerms) {
      return NextResponse.json(
        { error: "You must confirm the volunteer terms before submitting." },
        { status: 400 },
      );
    }

    const application = await createVolunteerApplication({
      firstName,
      lastName,
      email,
      phoneNumber: body.phoneNumber,
      medicalLicenseNumber,
      licensingState,
      primarySpecialty,
      yearsOfExperience: body.yearsOfExperience,
      languages,
      availability,
      hoursPerMonth: body.hoursPerMonth,
      motivation: body.motivation,
    });

    return NextResponse.json({ ok: true, application });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to submit volunteer application right now." },
      { status: 500 },
    );
  }
}
