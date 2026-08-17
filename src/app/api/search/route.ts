import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ movies: [], artists: [] });
  }

  const [movies, artists] = await Promise.all([
    prisma.movie.findMany({
      where: { title: { contains: q, mode: "insensitive" } },
      take: 10,
      select: { id: true, title: true, poster: true, genre: true, releaseDate: true },
    }),
    prisma.artist.findMany({
      where: { name: { contains: q, mode: "insensitive" } },
      take: 10,
      select: { id: true, name: true, photo: true, role: true, verified: true },
    }),
  ]);

  return NextResponse.json({ movies, artists });
}
