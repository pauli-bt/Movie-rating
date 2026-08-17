# Sireta — Ethiopian & African Film Database (V1)

A ratings/reviews platform for Ethiopian and African cinema, built on the V1 spec:
Next.js (App Router) + Tailwind + PostgreSQL (Neon) + Prisma + NextAuth + Vercel.

## What's included

- 6 core tables (User, Movie, Artist, MovieCast, Review, Rating) + ClaimRequest,
  plus the Account/Session/VerificationToken tables NextAuth needs.
- Pages: `/`, `/search`, `/movies`, `/movies/[id]`, `/artists/[id]`, `/login`,
  `/register`, `/profile/[username]`.
- Claim-this-page modal that writes to `ClaimRequest` (you flip `verified` and
  `claimedByUserId` manually in Prisma Studio for V1, per the spec — no admin UI yet).
- Email/password auth (bcrypt) + optional Google OAuth.
- A seed script with 18 real Ethiopian/African films and 12 artists/studios so
  the app isn't empty on first run.

Deliberately not built (per spec): albums/music, awards, events, notifications,
watchlists, follow system, admin dashboard.

## 1. Local setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL etc, see below
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Open http://localhost:3000.

## 2. Set up Neon (Postgres)

1. Create a free project at https://neon.tech.
2. In the Neon dashboard, copy two connection strings:
   - the **pooled** one → `DATABASE_URL`
   - the **direct** one (no `-pooler` in the host) → `DIRECT_URL`
3. Paste both into `.env.local`. Both are needed because Prisma migrations
   require a direct (non-pooled) connection while the app itself uses the pooler.

## 3. NextAuth secret

```bash
openssl rand -base64 32
```
Put the output in `NEXTAUTH_SECRET`. Set `NEXTAUTH_URL` to `http://localhost:3000`
locally and to your production URL once deployed.

## 4. Google sign-in (optional)

If you skip this, the app still works with email/password — the "Continue with
Google" button will just error if clicked since no credentials are configured.
To enable it:
1. https://console.cloud.google.com → APIs & Services → Credentials → OAuth client ID (Web application).
2. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   (and the same with your production domain once deployed).
3. Put the client ID/secret in `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`.

## 5. Cloudinary (optional, for poster/photo uploads)

V1 ships with plain image URLs in the seed data (no upload UI yet — that's a
fast V1.1 add). If/when you build the upload flow, create a free account at
https://cloudinary.com and fill in the three `CLOUDINARY_*` vars.

## 6. Deploying to Vercel

1. Push this project to a GitHub repo.
2. In Vercel: **New Project** → import the repo.
3. Add all the env vars from `.env.local` (`DATABASE_URL`, `DIRECT_URL`,
   `NEXTAUTH_SECRET`, `NEXTAUTH_URL` = your real Vercel URL, plus Google/Cloudinary
   if you're using them) under **Settings → Environment Variables**.
4. Deploy. The `postinstall` script runs `prisma generate` automatically.
5. Run the migration against your production DB once, from your machine:
   ```bash
   DATABASE_URL="<your prod DATABASE_URL>" DIRECT_URL="<your prod DIRECT_URL>" npx prisma migrate deploy
   ```
6. Seed production the same way (optional, only if you want the sample catalogue live):
   ```bash
   DATABASE_URL="<...>" DIRECT_URL="<...>" npm run seed
   ```
7. Update the Google OAuth redirect URI (if used) and `NEXTAUTH_URL` to your
   final Vercel domain, then redeploy.

## Becoming an admin / verifying a claim

There's no admin UI in V1 by design. To approve a claim or promote a user:

```bash
npx prisma studio
```
This opens a local GUI against your database — edit `Artist.verified`,
`Artist.claimedByUserId`, `ClaimRequest.status`, or `User.role` directly.

## Project structure

```
prisma/schema.prisma       6 core tables + Artist claim + NextAuth tables
prisma/seed.ts             sample catalogue
src/app/                   pages (App Router) + API routes under app/api
src/components/            Navbar, SearchBar, MovieCard, RatingAndReview, ClaimButton, ProfileEditor
src/lib/auth.ts            NextAuth config (credentials + optional Google)
src/lib/prisma.ts          Prisma client singleton
```

## Suggested next steps (V1.1+)

- Poster/photo upload via Cloudinary widget instead of pasting URLs.
- A tiny `/admin` page gated by `role: admin` instead of raw Prisma Studio.
- Pagination on the review list (currently loads all reviews per movie).
