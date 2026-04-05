import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getDefaultRouteForRole,
  getSessionCookieOptions,
  verifyPassword,
} from "@/lib/auth";
import { findUserByEmail } from "@/lib/user-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      expectedRole?: "doctor";
    };

    const email = body.email?.trim() ?? "";
    const password = body.password?.trim() ?? "";
    const expectedRole = body.expectedRole;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await findUserByEmail(email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    if (expectedRole === "doctor" && user.role !== "doctor") {
      return NextResponse.json(
        { error: "This account does not have doctor access." },
        { status: 403 },
      );
    }

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        doctorProfileId: user.doctorProfileId,
        redirectTo: getDefaultRouteForRole(user.role),
      },
    });

    response.cookies.set(
      AUTH_COOKIE_NAME,
      createSessionToken({
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        doctorProfileId: user.doctorProfileId,
      }),
      getSessionCookieOptions(),
    );

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Auth backend is not fully configured for Supabase yet." },
      { status: 500 },
    );
  }
}
