# Nova — Banking for what's next

A full-stack banking dashboard built to explore two things most CRUD projects don't
force you to handle: **data integrity in financial operations**, and **turning raw
transaction data into something actually useful** instead of just a list of numbers.

**Live demo:** https://nova-bank-coral.vercel.app
**Demo login:** `demo@novabank.app` / `password123`
**Repo:** https://github.com/safwanshaikh053/Nova-Bank

## Why this exists

Most portfolio projects stop at "list, create, update, delete." Nova goes a step
further in two specific ways:

- **Transfers are atomic.** Every fund transfer runs inside a database transaction —
  both account balances update and a transaction record is created, or none of it
  happens. A half-completed money transfer is worse than a failed one, so this was
  non-negotiable.
- **Insights, not just history.** Instead of only listing transactions, Nova runs a
  rule-based engine over your spending data to surface what actually changed —
  biggest category, month-over-month spikes, spending velocity — with zero external
  API dependency, so it works the moment you clone it.

It's also built serverless-first: real hosted Postgres instead of local file
storage, which matters because local JSON/file-based persistence breaks the moment
you deploy to a platform like Vercel with an ephemeral filesystem.

## Features

- 🔐 Real authentication (NextAuth + bcrypt-hashed passwords, JWT sessions)
- 🏦 Multiple accounts per user (checking + savings), created automatically on signup
- 💸 Atomic transfers between account numbers — no partial-state risk
- 📊 Category spend chart and full transaction history
- 🧠 Rule-based spending insights generated from real transaction data
- ⚡ Live-feeling dashboard — balances and transactions poll and animate on change
- 🎨 Custom design system — deep navy + mint/violet, Space Grotesk + Inter, Framer Motion

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
- a query against a real hosted Postgres database (Neon, in this project's case).

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
copy .env.example .env
```

Fill in:
```
DATABASE_URL="<your Postgres connection string>"
NEXTAUTH_SECRET="<generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))">"
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
   - `NEXTAUTH_SECRET` — a random secret
   - `NEXTAUTH_URL` — your production URL (add this after the first deploy once you
     know the URL, then redeploy)
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
copy, replace the body of `generateInsights` with a call to an LLM API, passing
the aggregated transaction summary and asking for 2–3 short insight sentences back.
Keep the rule-based version as a fallback for when the API key isn't configured.

## Notes

This is a portfolio/demo project. No real money moves, and it should not be used
to handle real financial data or connected to real bank accounts.
