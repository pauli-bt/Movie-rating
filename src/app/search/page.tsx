"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import MovieCard from "@/components/MovieCard";

type Result = {
  movies: { id: string; title: string; poster: string | null; genre: string | null; releaseDate: string | null }[];
  artists: { id: string; name: string; photo: string | null; role: string; verified: boolean }[];
};

export default function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const initialQ = params.get("q") ?? "";
  const [q, setQ] = useState(initialQ);
  const [results, setResults] = useState<Result>({ movies: [], artists: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQ(initialQ);
  }, [initialQ]);

  useEffect(() => {
    if (!q.trim()) {
      setResults({ movies: [], artists: [] });
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data);
      setLoading(false);
      router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false });
    }, 300);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search movies, actors, directors, studios…"
        className="input text-lg py-3"
      />

      {loading && <p className="text-cream/50 mt-6 text-sm">Searching…</p>}

      {!loading && q.trim() && results.movies.length === 0 && results.artists.length === 0 && (
        <p className="text-cream/50 mt-6 text-sm">No results for "{q}".</p>
      )}

      {results.movies.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-xl mb-4">Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {results.movies.map((m) => (
              <MovieCard key={m.id} id={m.id} title={m.title} poster={m.poster} genre={m.genre} releaseDate={m.releaseDate} />
            ))}
          </div>
        </div>
      )}

      {results.artists.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl mb-4">People &amp; studios</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {results.artists.map((a) => (
              <Link key={a.id} href={`/artists/${a.id}`} className="card p-3 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full bg-coffee-700 overflow-hidden shrink-0">
                  {a.photo ? (
                    <Image src={a.photo} alt={a.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gold font-display">
                      {a.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium leading-tight">{a.name}</p>
                  <p className="text-xs text-cream/50 capitalize">
                    {a.role} {a.verified && "· ✓ verified"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
