"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-muted">Sign in to see what changed since your last visit.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-mint/50"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-mint/50"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-mint py-3 text-sm font-medium text-on-mint transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        New to Nova?{" "}
        <Link href="/register" className="text-mint hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
