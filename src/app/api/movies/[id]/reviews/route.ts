import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Sign in to write a review" }, { status: 401 });
  }

  const body = await req.json();
  const text = (body.text || "").trim();
  if (!text) {
    return NextResponse.json({ error: "Review text is required" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      text,
      userId: session.user.id,
      movieId: params.id,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
