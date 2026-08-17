import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      createdAt: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { movie: { select: { id: true, title: true, poster: true } } },
      },
      ratings: {
        include: { movie: { select: { id: true, title: true, poster: true } } },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: Request, { params }: { params: { username: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.username !== params.username) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const data: { name?: string; image?: string } = {};
  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.image === "string") data.image = body.image.trim() || undefined;

  const user = await prisma.user.update({
    where: { username: params.username },
    data,
    select: { id: true, name: true, username: true, image: true },
  });

  return NextResponse.json(user);
}
