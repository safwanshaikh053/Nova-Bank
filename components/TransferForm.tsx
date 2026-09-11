"use client";

import { useState, FormEvent } from "react";
import useSWR, { useSWRConfig } from "swr";
import { motion, AnimatePresence } from "framer-motion";
import { fetcher } from "@/lib/fetcher";
import { CATEGORIES } from "@/lib/utils";

type Account = {
  id: string;
  nickname: string;
  type: "CHECKING" | "SAVINGS";
  accountNumber: string;
  balance: number;
};

export default function TransferForm() {
  const { data: accounts } = useSWR<Account[]>("/api/accounts", fetcher);
  const { mutate } = useSWRConfig();

  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedFrom = accounts?.find((a) => a.id === (fromAccountId || accounts?.[0]?.id));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const parsedAmount = parseFloat(amount);
    if (!fromAccountId && !accounts?.[0]) {
      setError("No source account available");
      return;
    }
    if (!parsedAmount || parsedAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fromAccountId: fromAccountId || accounts?.[0]?.id,
        toAccountNumber,
        amount: parsedAmount,
        description: description || `Transfer to ${toAccountNumber}`,
        category,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Transfer failed");
      return;
    }

    setSuccess(true);
    setAmount("");
    setToAccountNumber("");
    setDescription("");
    mutate("/api/accounts");
    mutate("/api/transactions");
    mutate("/api/insights");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-6">
      <div>
        <label className="mb-1.5 block text-sm text-ink-muted">From account</label>
        <select
          value={fromAccountId || accounts?.[0]?.id || ""}
          onChange={(e) => setFromAccountId(e.target.value)}
          className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus:border-mint/50"
        >
          {accounts?.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nickname} — ₹{a.balance.toLocaleString("en-IN")}
            </option>
          ))}
        </select>
        {selectedFrom && (
          <p className="mt-1.5 text-xs text-ink-faint">
            Available balance: ₹{selectedFrom.balance.toLocaleString("en-IN")}
          </p>
        )}
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm text-ink-muted">Recipient account number</label>
        <input
          value={toAccountNumber}
          onChange={(e) => setToAccountNumber(e.target.value)}
          required
          placeholder="e.g. 1234 5678 9012"
          className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus:border-mint/50"
        />
        <p className="mt-1.5 text-xs text-ink-faint">
          Try transferring between your own checking and savings account numbers.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">Amount</label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="0.00"
            className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus:border-mint/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-ink-muted">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus:border-mint/50"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-sm text-ink-muted">Note (optional)</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this for?"
          className="w-full rounded-xl border border-border bg-surface-raised px-4 py-3 text-sm text-ink outline-none focus:border-mint/50"
        />
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            {error}
          </motion.p>
        )}
        {success && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 rounded-lg bg-mint/10 px-3 py-2 text-sm text-mint"
          >
            Transfer complete — balances updated.
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-mint py-3 text-sm font-medium text-on-mint transition-transform hover:scale-[1.01] disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send transfer"}
      </button>
    </form>
  );
}
