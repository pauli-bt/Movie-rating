"use client";

import { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";

type Movie = {
  id: string;
  title: string;
  poster: string | null;
  genre: string | null;
  releaseDate: string | null;
  avgOverall: number | null;
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (genre) qs.set("genre", genre);
    if (year) qs.set("year", year);
    fetch(`/api/movies?${qs.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setMovies(data.movies);
        setGenres(data.filters.genres);
        setYears(data.filters.years.sort((a: number, b: number) => b - a));
        setLoading(false);
      });
  }, [genre, year]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <h1 className="font-display text-3xl">Browse movies</h1>
        <div className="flex gap-3">
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="input py-2 text-sm w-auto"
          >
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="input py-2 text-sm w-auto"
          >
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-cream/50">Loading…</p>
      ) : movies.length === 0 ? (
        <p className="text-cream/50">No movies match those filters.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {movies.map((m) => (
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
    </div>
  );
}
