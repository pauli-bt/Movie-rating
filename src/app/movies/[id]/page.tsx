import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RatingAndReview from "@/components/RatingAndReview";

export const dynamic = "force-dynamic";

async function getMovie(id: string) {
  const movie = await prisma.movie.findUnique({
    where: { id },
    include: {
      cast: { include: { artist: true } },
      reviews: {
        include: { user: { select: { name: true, username: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
      ratings: true,
    },
  });
  return movie;
}

export default async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movie = await getMovie(params.id);
  if (!movie) notFound();

  const count = movie.ratings.length;
  const avg = (key: "overall" | "story" | "acting") =>
    count > 0 ? movie.ratings.reduce((s, r) => s + r[key], 0) / count : null;

  const overall = avg("overall");
  const story = avg("story");
  const acting = avg("acting");

  const directors = movie.cast.filter((c) => c.role === "director");
  const actors = movie.cast.filter((c) => c.role === "actor");
  const producers = movie.cast.filter((c) => c.role === "producer");

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-[280px_1fr] gap-10">
        <div>
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-coffee-700">
            {movie.poster ? (
              <Image src={movie.poster} alt={movie.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-cream/30 font-display text-5xl">
                {movie.title[0]}
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="font-display text-4xl mb-2">{movie.title}</h1>
          <p className="text-cream/50 text-sm mb-6">
            {[
              movie.genre,
              movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null,
              movie.duration ? `${movie.duration} min` : null,
              movie.language,
              movie.country,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {movie.description && (
            <p className="text-cream/80 leading-relaxed max-w-2xl mb-8">{movie.description}</p>
          )}

          <div className="flex gap-6 mb-8">
            <RatingStat label="Overall" value={overall} big />
            <RatingStat label="Story" value={story} />
            <RatingStat label="Acting" value={acting} />
            <div className="text-sm text-cream/40 self-end pb-1">
              {count} {count === 1 ? "rating" : "ratings"}
            </div>
          </div>

          {[
            ["Director", directors],
            ["Actors", actors],
            ["Producer", producers],
          ].map(([label, list]: any) =>
            list.length > 0 ? (
              <div key={label} className="mb-4">
                <p className="text-xs uppercase tracking-wider text-cream/40 mb-2">{label}</p>
                <div className="flex flex-wrap gap-2">
                  {list.map((c: any) => (
                    <Link
                      key={c.id}
                      href={`/artists/${c.artist.id}`}
                      className="px-3 py-1.5 rounded-full bg-coffee-800 border border-coffee-600 text-sm hover:border-gold hover:text-gold transition-colors"
                    >
                      {c.artist.name}
                      {c.characterName ? ` as ${c.characterName}` : ""}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-10 mt-14">
        <div>
          <h2 className="font-display text-2xl mb-6">
            Reviews {movie.reviews.length > 0 && `(${movie.reviews.length})`}
          </h2>
          {movie.reviews.length === 0 ? (
            <p className="text-cream/50">No reviews yet — be the first.</p>
          ) : (
            <div className="space-y-5">
              {movie.reviews.map((r) => (
                <div key={r.id} className="border-b border-coffee-700 pb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-full bg-coffee-700 flex items-center justify-center text-gold text-xs font-display">
                      {r.user.name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                    <Link href={`/profile/${r.user.username}`} className="text-sm font-medium hover:text-gold">
                      {r.user.name}
                    </Link>
                    <span className="text-xs text-cream/40">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-cream/80 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <RatingAndReview movieId={movie.id} />
        </div>
      </div>
    </div>
  );
}

function RatingStat({ label, value, big }: { label: string; value: number | null; big?: boolean }) {
  return (
    <div className={`stamp-badge ${big ? "w-20 h-20 text-2xl" : "w-16 h-16 text-lg"} flex-col`}>
      <span>{value ? value.toFixed(1) : "—"}</span>
      <span className="text-[9px] uppercase tracking-wide text-cream/50 -mt-0.5">{label}</span>
    </div>
  );
}
