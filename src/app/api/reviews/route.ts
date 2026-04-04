import { NextResponse } from "next/server";
import { createReview, listReviews } from "@/lib/review-store";

export async function GET() {
  try {
    const reviews = await listReviews();
    return NextResponse.json({ reviews });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Reviews backend is not fully configured yet." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      location?: string;
      content?: string;
      rating?: number;
    };

    const content = body.content?.trim() ?? "";
    const rating = Number(body.rating);

    if (!content) {
      return NextResponse.json(
        { error: "Please describe your experience." },
        { status: 400 },
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Please select a rating from 1 to 5." },
        { status: 400 },
      );
    }

    const review = await createReview({
      name: body.name,
      location: body.location,
      content,
      rating,
    });

    return NextResponse.json({ ok: true, review });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Reviews backend is not fully configured yet." },
      { status: 500 },
    );
  }
}
