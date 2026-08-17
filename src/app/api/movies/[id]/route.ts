import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const movie = await prisma.movie.findUnique({
    where: { id: params.id },
    include: {
      cast: { include: { artist: true }, orderBy: { role: "asc" } },
      reviews: {
        include: { user: { select: { name: true, username: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      ratings: true,
    },
  });

  if (!movie) {
    return NextResponse.json({ error: "Movie not found" }, { status: 404 });
  }

  const count = movie.ratings.length;
  const avg = (key: "overall" | "story" | "acting") =>
    count > 0 ? movie.ratings.reduce((s, r) => s + r[key], 0) / count : null;

  const { ratings, ...rest } = movie;

  return NextResponse.json({
    ...rest,
    ratingSummary: {
      count,
      overall: avg("overall"),
      story: avg("story"),
      acting: avg("acting"),
    },
  });
}
