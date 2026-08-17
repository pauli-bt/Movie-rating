import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function clamp(n: number) {
  return Math.max(1, Math.min(10, Math.round(n)));
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Sign in to rate this movie" }, { status: 401 });
  }

  const body = await req.json();
  const overall = clamp(Number(body.overall));
  const story = clamp(Number(body.story));
  const acting = clamp(Number(body.acting));

  if ([overall, story, acting].some((n) => Number.isNaN(n))) {
    return NextResponse.json({ error: "Ratings must be numbers 1-10" }, { status: 400 });
  }

  const rating = await prisma.rating.upsert({
    where: { userId_movieId: { userId: session.user.id, movieId: params.id } },
    update: { overall, story, acting },
    create: { overall, story, acting, userId: session.user.id, movieId: params.id },
  });

  return NextResponse.json(rating, { status: 200 });
}
