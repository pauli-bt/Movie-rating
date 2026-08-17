import Link from "next/link";
import { prisma } from "@/lib/prisma";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";

export const dynamic = "force-dynamic";

async function getData() {
  const movies = await prisma.movie.findMany({
    include: { ratings: { select: { overall: true } } },
  });

  const withAvg = movies.map((m) => {
    const overall =
      m.ratings.length > 0
        ? m.ratings.reduce((s, r) => s + r.overall, 0) / m.ratings.length
        : null;
    return { ...m, avgOverall: overall };
  });

  const trending = [...withAvg]
    .sort((a, b) => (b.avgOverall ?? 0) - (a.avgOverall ?? 0))
    .slice(0, 6);

  const recent = [...withAvg]
    .sort((a, b) => (b.createdAt as any) - (a.createdAt as any))
    .slice(0, 6);

  return { trending, recent };
}

export default async function HomePage() {
  const { trending, recent } = await getData();

  return (
    <div>
      <section className="border-b border-coffee-600/40">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <p className="uppercase tracking-[0.3em] text-gold text-xs mb-4">
            Habesha cinema, catalogued
          </p>
          <h1 className="font-display italic text-4xl md:text-6xl font-medium max-w-2xl leading-tight">
            Every film, every actor, rated by the people who watch it.
          </h1>
          <p className="mt-5 text-cream/60 max-w-xl">
            Sireta is a home for Ethiopian and African film — ratings, reviews,
            and pages for the cast and crew behind them.
          </p>
          <div className="mt-8 max-w-lg">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display text-2xl">Trending now</h2>
          <Link href="/movies" className="text-sm text-gold hover:underline">
            Browse all →
          </Link>
        </div>
        {trending.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {trending.map((m) => (
              <MovieCard
                key={m.id}
                id={m.id}
                title={m.title}
                poster={m.poster}
                genre={m.genre}
                releaseDate={m.releaseDate}
                avgOverall={m.avgOverall}
              />
            ))}
          </div>
        )}
      </section>

      {recent.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="font-display text-2xl mb-6">Recently added</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {recent.map((m) => (
              <MovieCard
                key={m.id}
                id={m.id}
                title={m.title}
                poster={m.poster}
                genre={m.genre}
                releaseDate={m.releaseDate}
                avgOverall={m.avgOverall}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-coffee-600 rounded-lg p-10 text-center text-cream/50">
      No movies yet — run{" "}
      <code className="text-gold">npm run seed</code> to load the starter catalogue.
    </div>
  );
}
