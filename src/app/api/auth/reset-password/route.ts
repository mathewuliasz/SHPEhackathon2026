import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import {
  deletePasswordResetToken,
  findValidPasswordResetToken,
} from "@/lib/password-reset-store";
import { updateUserPassword } from "@/lib/user-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      password?: string;
    };

    const token = body.token?.trim() ?? "";
    const password = body.password?.trim() ?? "";

    if (!token || !password) {
      return NextResponse.json(
        { error: "Reset token and new password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const resetRecord = await findValidPasswordResetToken(token);

    if (!resetRecord) {
      return NextResponse.json(
        { error: "This reset link is invalid or expired." },
        { status: 400 },
      );
    }

    await updateUserPassword({
      userId: resetRecord.user_id,
      passwordHash: hashPassword(password),
    });
    await deletePasswordResetToken(resetRecord.id);

    return NextResponse.json({
      ok: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Could not reset your password." },
      { status: 500 },
    );
  }
}
