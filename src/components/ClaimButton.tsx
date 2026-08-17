"use client";

import { useState } from "react";

export default function ClaimButton({ artistId, hidden }: { artistId: string; hidden: boolean }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  if (hidden) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/artists/${artistId}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-secondary text-sm">
        Claim this page
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-coffee-950/80 flex items-center justify-center p-4">
          <div className="card w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-4 text-cream/50 hover:text-cream text-xl"
              aria-label="Close"
            >
              ×
            </button>

            {done ? (
              <div className="text-center py-6">
                <p className="text-gold font-display text-lg mb-2">Request sent</p>
                <p className="text-cream/60 text-sm">
                  We'll review your claim and verify the page shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h3 className="font-display text-xl">Claim this page</h3>
                <p className="text-cream/50 text-sm">
                  Tell us who you are and how you're connected to this page.
                </p>
                <input
                  required
                  placeholder="Your name"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  required
                  type="email"
                  placeholder="Your email"
                  className="input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  placeholder="Phone (optional)"
                  className="input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <textarea
                  placeholder="I represent X, here's proof…"
                  rows={3}
                  className="input resize-none"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                {error && <p className="text-berbere text-sm">{error}</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-50">
                  {submitting ? "Sending…" : "Send request"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
