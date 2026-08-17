"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";

export default function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-coffee-950/90 backdrop-blur border-b border-coffee-600/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="font-display text-2xl font-bold text-gold shrink-0">
          Sireta
        </Link>

        <div className="hidden md:flex items-center gap-5 text-sm text-cream/80">
          <Link href="/movies" className="hover:text-gold transition-colors">
            Movies
          </Link>
        </div>

        <div className="flex-1 max-w-md ml-auto hidden sm:block">
          <SearchBar compact />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 text-sm hover:text-gold"
              >
                <span className="w-8 h-8 rounded-full bg-coffee-700 flex items-center justify-center text-gold font-display">
                  {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                </span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-coffee-800 border border-coffee-600 rounded-md shadow-lg py-1">
                  <Link
                    href={`/profile/${session.user.username}`}
                    className="block px-4 py-2 text-sm hover:bg-coffee-700"
                    onClick={() => setOpen(false)}
                  >
                    My profile
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-coffee-700 text-berbere"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-secondary text-sm py-1.5">
              Sign in
            </Link>
          )}
        </div>
      </div>
      <div className="px-4 pb-3 sm:hidden">
        <SearchBar compact />
      </div>
    </header>
  );
}
