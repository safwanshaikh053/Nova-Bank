import Link from "next/link";
import Sparkline from "@/components/Sparkline";

const demoSeries = [12400, 12100, 13050, 12800, 14200, 13900, 15600, 16100, 15800, 17200, 18100, 19850];

export default function LandingPage() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6">
      <header className="flex items-center justify-between py-8">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/10">
            <span className="h-2.5 w-2.5 rounded-full bg-mint" />
          </span>
          <span className="font-display text-lg font-medium tracking-tight">Nova</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-ink-muted">
          <Link href="/login" className="hover:text-ink transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-mint px-4 py-2 font-medium text-on-mint transition-transform hover:scale-[1.03]"
          >
            Open an account
          </Link>
        </nav>
      </header>

      <section className="grid flex-1 grid-cols-1 items-center gap-16 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-xl">
          <p className="mb-6 text-sm text-mint">A concept for how money could feel</p>
          <h1 className="font-display text-5xl font-medium leading-[1.05] tracking-tight text-ink lg:text-6xl">
            Your balance, understood — not just displayed.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
            Nova reads your spending the way you would if you had an hour to sit with a
            spreadsheet. Every login surfaces what changed, why it matters, and what to do
            about it — before you have to ask.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-mint px-6 py-3 font-medium text-on-mint shadow-glow transition-transform hover:scale-[1.03]"
            >
              Create your account
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-border px-6 py-3 font-medium text-ink-muted transition-colors hover:border-mint/40 hover:text-ink"
            >
              I already have one
            </Link>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-border pt-8">
            <div>
              <p className="font-display text-2xl text-ink">2.3s</p>
              <p className="mt-1 text-sm text-ink-muted">avg. transfer time</p>
            </div>
            <div>
              <p className="font-display text-2xl text-ink">0</p>
              <p className="mt-1 text-sm text-ink-muted">spreadsheets required</p>
            </div>
            <div>
              <p className="font-display text-2xl text-ink">3</p>
              <p className="mt-1 text-sm text-ink-muted">insights, every visit</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-2xl bg-gradient-to-br from-mint/10 via-transparent to-violet/10 blur-2xl" />
          <div className="relative rounded-2xl border border-border bg-surface/80 p-8 shadow-card backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-muted">Everyday Checking</p>
                <p className="mt-2 font-display text-4xl tabular-nums tracking-tight">
                  ₹19,850.00
                </p>
              </div>
              <span className="rounded-full bg-mint/10 px-3 py-1 text-xs font-medium text-mint">
                +12.4%
              </span>
            </div>
            <div className="mt-6">
              <Sparkline data={demoSeries} height={120} />
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-border pt-6 text-sm">
              <div>
                <p className="text-ink-muted">Top insight</p>
                <p className="mt-1 max-w-[220px] text-ink">
                  Dining is down 18% from last month — your best result in a year.
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet/10 text-violet">
                ✓
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-sm text-ink-faint">
        Nova is a portfolio demonstration project. No real money moves here.
      </footer>
    </main>
  );
}
