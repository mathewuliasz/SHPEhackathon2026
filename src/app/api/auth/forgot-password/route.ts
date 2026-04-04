import { NextResponse } from "next/server";
import { createPasswordResetToken, createResetTokenValue } from "@/lib/password-reset-store";
import { findUserByEmail } from "@/lib/user-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
    };

    const email = body.email?.trim() ?? "";

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json({
        ok: true,
        message: "If that email exists, a reset link has been generated.",
      });
    }

    const token = createResetTokenValue();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();

    await createPasswordResetToken({
      userId: user.id,
      token,
      expiresAt,
    });

    return NextResponse.json({
      ok: true,
      message: "Reset link generated.",
      resetUrl: `/reset-password?token=${token}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not start the password reset flow." },
      { status: 500 },
    );
  }
}
