import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-10 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/10">
            <span className="h-2.5 w-2.5 rounded-full bg-mint" />
          </span>
          <span className="font-display text-lg font-medium tracking-tight">Nova</span>
        </Link>
        {children}
      </div>
    </main>
  );
}
