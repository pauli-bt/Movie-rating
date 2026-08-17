import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const artist = await prisma.artist.findUnique({
    where: { id: params.id },
    include: {
      movies: { include: { movie: true } },
    },
  });

  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  return NextResponse.json(artist);
}
