import Link from "next/link";
import Image from "next/image";

type Props = {
  id: string;
  title: string;
  poster: string | null;
  genre?: string | null;
  releaseDate?: Date | string | null;
  avgOverall?: number | null;
};

export default function MovieCard({ id, title, poster, genre, releaseDate, avgOverall }: Props) {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;

  return (
    <Link href={`/movies/${id}`} className="card group block">
      <div className="relative aspect-[2/3] bg-coffee-700">
        {poster ? (
          <Image
            src={poster}
            alt={title}
            fill
            sizes="(max-width: 768px) 45vw, 220px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cream/30 font-display text-3xl">
            {title[0]}
          </div>
        )}
        {typeof avgOverall === "number" && avgOverall > 0 && (
          <div className="stamp-badge absolute top-2 right-2 w-9 h-9 bg-coffee-950/90 text-xs">
            {avgOverall.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-display font-semibold text-cream leading-snug group-hover:text-gold transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-cream/50 mt-1">
          {[genre, year].filter(Boolean).join(" · ")}
        </p>
      </div>
    </Link>
  );
}
