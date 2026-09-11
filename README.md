# Nova — Banking for what's next

A full-stack banking dashboard concept: real authentication, live-feeling balances,
instant transfers, and AI-style spending insights generated from your own transaction
data. Built to deploy cleanly on Vercel with zero filesystem or serverless gotchas.

**Live demo:** _add your Vercel URL here after deploying_

## Features

- 🔐 Real authentication (NextAuth + bcrypt-hashed passwords, JWT sessions)
- 🏦 Multiple accounts per user (checking + savings), created automatically on signup
- 💸 Instant transfers between account numbers, with atomic balance updates
- 📊 Category spend chart and transaction history
- 🧠 Rule-based "AI" spending insights (month-over-month deltas, top category, spend velocity) —
  works with zero external API keys, easy to swap for a real LLM call (see below)
- ⚡ Live-feeling dashboard: balances and transaction lists poll and animate on change
- 🎨 Custom "nocturne fintech" design system — not a template: deep navy + mint/violet accents,
  Space Grotesk for numbers, Inter for UI text, Framer Motion micro-interactions

## Tech stack

| Layer      | Technology                                  |
| ---------- | -------------------------------------------- |
| Framework  | Next.js 14 (App Router)                      |
| Language   | TypeScript                                   |
| Styling    | Tailwind CSS                                 |
| Animation  | Framer Motion                                |
| Charts     | Recharts                                     |
| Data layer | Prisma + PostgreSQL                          |
| Auth       | NextAuth (Credentials provider)              |
| Data fetch | SWR (polling for live-feeling updates)       |

## Why this stack deploys cleanly on Vercel

Unlike an Express app that reads/writes local JSON files (which breaks on Vercel's
read-only, ephemeral serverless filesystem), everything here is either:
- a Next.js API route (already serverless-shaped), or
- a query against a real hosted Postgres database (Neon, Supabase, or Vercel Postgres
  all have generous free tiers and work out of the box with Prisma).

There's no local file storage, no long-running server process, and no external paid
API required to run the full feature set.

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up a free Postgres database

Pick one (all have free tiers that work great here):
- [Neon](https://neon.tech) — recommended, fastest to set up
- [Supabase](https://supabase.com)
- [Vercel Postgres](https://vercel.com/storage/postgres)

Copy the connection string it gives you.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Fill in:
```
DATABASE_URL="<your Postgres connection string>"
NEXTAUTH_SECRET="<generate with: openssl rand -base64 32>"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Push the schema and (optionally) seed demo data

```bash
npx prisma db push
npm run seed   # creates demo@novabank.app / password123 with sample transactions
```

### 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this repo to your own GitHub account.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. In the project's Environment Variables settings, add:
   - `DATABASE_URL` — your Postgres connection string
   - `NEXTAUTH_SECRET` — a random secret (`openssl rand -base64 32`)
   - `NEXTAUTH_URL` — your production URL, e.g. `https://your-project.vercel.app`
     (you can add this after the first deploy once you know the URL, then redeploy)
4. Deploy. The `postinstall` script runs `prisma generate` automatically; run
   `npx prisma db push` once locally (pointed at your production `DATABASE_URL`) to
   create the tables in your hosted database before first use.

## Project structure

```
app/
  page.tsx                    # Landing page
  (auth)/login, register/     # Auth pages
  (dashboard)/dashboard/      # Protected app: overview, transactions, transfer
  api/                        # Route handlers: auth, register, accounts,
                               # transactions, transfer, insights
components/                   # UI components (BalanceHero, TransferForm, etc.)
lib/                          # Prisma client, auth config, insight engine, utils
prisma/schema.prisma          # User, Account, Transaction models
```

## Swapping in a real LLM for insights

`lib/insights.ts` currently generates insights with deterministic category/trend
rules — no API key needed, and it's fast. If you want generative, more varied
copy, replace the body of `generateInsights` with a call to the Anthropic or
OpenAI API, passing the aggregated transaction summary and asking for 2–3 short
insight sentences back. Keep the rule-based version as a fallback for when the
API key isn't configured, so the app still works out of the box for anyone who
clones it.

## Notes

This is a portfolio/demo project. No real money moves, and it should not be used
to handle real financial data or connected to real bank accounts.
