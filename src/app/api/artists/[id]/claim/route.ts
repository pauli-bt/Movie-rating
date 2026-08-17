import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { name, email, phone, message } = body;

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const artist = await prisma.artist.findUnique({ where: { id: params.id } });
  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  const claim = await prisma.claimRequest.create({
    data: {
      artistId: params.id,
      userName: name.trim(),
      userEmail: email.trim(),
      userPhone: phone?.trim() || null,
      message: message?.trim() || null,
    },
  });

  return NextResponse.json(claim, { status: 201 });
}
