"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/transactions", label: "Transactions" },
  { href: "/dashboard/transfer", label: "Transfer" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const initials = (session?.user?.name ?? "N")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-border bg-surface/40 px-6 py-8">
      <Link href="/" className="mb-10 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/10">
          <span className="h-2.5 w-2.5 rounded-full bg-mint" />
        </span>
        <span className="font-display text-lg font-medium tracking-tight">Nova</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-mint/10 text-mint"
                  : "text-ink-muted hover:bg-surface-raised hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet/15 text-sm font-medium text-violet">
            {initials}
          </span>
          <div>
            <p className="text-sm font-medium text-ink">{session?.user?.name}</p>
            <p className="text-xs text-ink-muted">{session?.user?.email}</p>
          </div>
        </div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-4 rounded-xl border border-border px-3 py-2 text-sm text-ink-muted transition-colors hover:border-danger/40 hover:text-danger"
      >
        Sign out
      </button>
    </aside>
  );
}
