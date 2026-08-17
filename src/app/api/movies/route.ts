import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const genre = req.nextUrl.searchParams.get("genre") || undefined;
  const year = req.nextUrl.searchParams.get("year") || undefined;

  const where: any = {};
  if (genre) where.genre = genre;
  if (year) {
    const y = parseInt(year, 10);
    where.releaseDate = {
      gte: new Date(`${y}-01-01`),
      lt: new Date(`${y + 1}-01-01`),
    };
  }

  const movies = await prisma.movie.findMany({
    where,
    orderBy: { releaseDate: "desc" },
    include: { ratings: { select: { overall: true } } },
  });

  const shaped = movies.map((m) => {
    const overall =
      m.ratings.length > 0
        ? m.ratings.reduce((s, r) => s + r.overall, 0) / m.ratings.length
        : null;
    const { ratings, ...rest } = m;
    return { ...rest, avgOverall: overall };
  });

  const genres = await prisma.movie.findMany({
    distinct: ["genre"],
    select: { genre: true },
  });
  const years = await prisma.movie.findMany({
    distinct: ["releaseDate"],
    select: { releaseDate: true },
    orderBy: { releaseDate: "desc" },
  });

  return NextResponse.json({
    movies: shaped,
    filters: {
      genres: genres.map((g) => g.genre).filter(Boolean),
      years: Array.from(
        new Set(years.map((y) => y.releaseDate?.getFullYear()).filter(Boolean))
      ),
    },
  });
}
