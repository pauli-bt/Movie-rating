import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProfileEditor from "@/components/ProfileEditor";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { movie: { select: { id: true, title: true, poster: true } } },
      },
      ratings: {
        include: { movie: { select: { id: true, title: true, poster: true } } },
      },
    },
  });

  if (!user) notFound();

  const isOwn = session?.user.username === user.username;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 rounded-full bg-coffee-700 overflow-hidden shrink-0">
          {user.image ? (
            <Image src={user.image} alt={user.name ?? ""} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gold font-display text-2xl">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl">{user.name}</h1>
          <p className="text-cream/50 text-sm">@{user.username}</p>
        </div>
      </div>

      {isOwn && (
        <div className="mt-4">
          <ProfileEditor username={user.username} initialName={user.name ?? ""} initialImage={user.image ?? ""} />
        </div>
      )}

      <div className="mt-12">
        <h2 className="font-display text-2xl mb-6">
          Reviews {user.reviews.length > 0 && `(${user.reviews.length})`}
        </h2>
        {user.reviews.length === 0 ? (
          <p className="text-cream/50">No reviews yet.</p>
        ) : (
          <div className="space-y-5">
            {user.reviews.map((r) => {
              const rating = user.ratings.find((rt) => rt.movieId === r.movieId);
              return (
                <div key={r.id} className="border-b border-coffee-700 pb-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Link href={`/movies/${r.movie.id}`} className="font-medium hover:text-gold">
                      {r.movie.title}
                    </Link>
                    {rating && (
                      <span className="text-xs text-gold border border-gold/40 rounded-full px-2 py-0.5">
                        {rating.overall}/10
                      </span>
                    )}
                    <span className="text-xs text-cream/40">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-cream/80 leading-relaxed">{r.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
