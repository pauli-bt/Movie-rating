"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hasGoogle = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password");
    } else {
      router.push(params.get("callbackUrl") || "/");
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="font-display text-3xl mb-8 text-center">Sign in</h1>

      <button
        onClick={() => signIn("google")}
        className="btn-secondary w-full mb-6"
      >
        Continue with Google
      </button>

      <div className="flex items-center gap-3 text-cream/30 text-xs mb-6">
        <div className="flex-1 h-px bg-coffee-600" />
        or
        <div className="flex-1 h-px bg-coffee-600" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-berbere text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-cream/50 mt-6">
        No account?{" "}
        <Link href="/register" className="text-gold hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
