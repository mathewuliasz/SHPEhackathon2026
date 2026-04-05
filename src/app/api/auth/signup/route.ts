import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  getSessionCookieOptions,
  hashPassword,
} from "@/lib/auth";
import { createUser, findUserByEmail } from "@/lib/user-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      password?: string;
      acceptedTerms?: boolean;
    };

    const fullName = body.fullName?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const password = body.password?.trim() ?? "";
    const acceptedTerms = Boolean(body.acceptedTerms);

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    if (!acceptedTerms) {
      return NextResponse.json(
        { error: "You must accept the privacy and care terms." },
        { status: 400 },
      );
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 409 },
      );
    }

    const user = await createUser({
      fullName,
      email,
      passwordHash: hashPassword(password),
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(
      AUTH_COOKIE_NAME,
      createSessionToken({
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
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
