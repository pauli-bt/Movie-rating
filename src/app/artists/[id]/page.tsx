import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClaimButton from "@/components/ClaimButton";

export const dynamic = "force-dynamic";

export default async function ArtistDetailPage({ params }: { params: { id: string } }) {
  const artist = await prisma.artist.findUnique({
    where: { id: params.id },
    include: { movies: { include: { movie: true } } },
  });

  if (!artist) notFound();

  const links = artist.socialLinks
    ? artist.socialLinks.split(",").map((l) => l.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-[240px_1fr] gap-10">
        <div className="relative aspect-square rounded-full overflow-hidden bg-coffee-700 max-w-[240px]">
          {artist.photo ? (
            <Image src={artist.photo} alt={artist.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cream/30 font-display text-5xl">
              {artist.name[0]}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-4xl">{artist.name}</h1>
            {artist.verified && (
              <span className="text-xs bg-gold/20 text-gold border border-gold/40 rounded-full px-2 py-1">
                ✓ Verified
              </span>
            )}
          </div>
          <p className="text-cream/50 text-sm mt-2 capitalize mb-6">{artist.role}</p>

          {artist.bio && <p className="text-cream/80 leading-relaxed max-w-2xl mb-6">{artist.bio}</p>}

          {links.length > 0 && (
            <div className="flex gap-3 mb-6 flex-wrap">
              {links.map((l) => (
                <a
                  key={l}
                  href={l.startsWith("http") ? l : `https://${l}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gold hover:underline"
                >
                  {l.replace(/^https?:\/\//, "")}
                </a>
              ))}
            </div>
          )}

          <ClaimButton artistId={artist.id} hidden={artist.verified} />
        </div>
      </div>

      {artist.movies.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-2xl mb-6">Filmography</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {artist.movies.map((mc) => (
              <Link key={mc.id} href={`/movies/${mc.movie.id}`} className="card block">
                <div className="relative aspect-[2/3] bg-coffee-700">
                  {mc.movie.poster ? (
                    <Image src={mc.movie.poster} alt={mc.movie.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cream/30 font-display text-2xl">
                      {mc.movie.title[0]}
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium line-clamp-2">{mc.movie.title}</p>
                  <p className="text-xs text-cream/40 capitalize">{mc.role}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
