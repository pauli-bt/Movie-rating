"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RatingAndReview({ movieId }: { movieId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [overall, setOverall] = useState(8);
  const [story, setStory] = useState(8);
  const [acting, setActing] = useState(8);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <div className="card p-6 text-center">
        <p className="text-cream/70 mb-4">Sign in to rate or review this movie.</p>
        <button onClick={() => signIn()} className="btn-primary">
          Sign in
        </button>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const ratingRes = await fetch(`/api/movies/${movieId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overall, story, acting }),
      });
      if (!ratingRes.ok) throw new Error((await ratingRes.json()).error);

      if (text.trim()) {
        const reviewRes = await fetch(`/api/movies/${movieId}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.trim() }),
        });
        if (!reviewRes.ok) throw new Error((await reviewRes.json()).error);
      }

      setDone(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card p-6 text-center text-gold">
        Thanks — your rating {text.trim() ? "and review " : ""}went up.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card p-6 space-y-5">
      <h3 className="font-display text-xl">Write a review</h3>

      <Slider label="Overall" value={overall} onChange={setOverall} />
      <Slider label="Story" value={story} onChange={setStory} />
      <Slider label="Acting" value={acting} onChange={setActing} />

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What did you think? (optional)"
        rows={4}
        className="input resize-none"
      />

      {error && <p className="text-berbere text-sm">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
        {submitting ? "Saving…" : "Submit"}
      </button>
    </form>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-cream/70">{label}</span>
        <span className="text-gold font-semibold">{value}/10</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-gold"
      />
    </div>
  );
}
