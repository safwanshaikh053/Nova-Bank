"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { fetcher } from "@/lib/fetcher";
import { formatCurrency, formatDate } from "@/lib/utils";

type Tx = {
  id: string;
  amount: number;
  category: string;
  description: string;
  createdAt: string;
  direction: "in" | "out";
  counterparty: string;
};

export default function TransactionList({ limit }: { limit?: number }) {
  const { data, isLoading } = useSWR<Tx[]>("/api/transactions", fetcher, {
    refreshInterval: 4000,
  });

  const items = limit ? data?.slice(0, limit) : data;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-medium tracking-tight">
          {limit ? "Recent activity" : "All transactions"}
        </h3>
      </div>

      <div className="relative mt-5">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mb-3 h-14 animate-pulse rounded-xl bg-surface-raised" />
          ))}

        {items?.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-muted">
            No transactions yet. Make a transfer to see activity here.
          </p>
        )}

        <ul className="divide-y divide-border">
          {items?.map((tx, i) => (
            <motion.li
              key={tx.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
              className="flex items-center justify-between py-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                    tx.direction === "in"
                      ? "bg-mint/10 text-mint"
                      : "bg-surface-raised text-ink-muted"
                  }`}
                >
                  {tx.direction === "in" ? "↓" : "↑"}
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{tx.description}</p>
                  <p className="text-xs text-ink-muted">
                    {tx.category} · {tx.counterparty} · {formatDate(tx.createdAt)}
                  </p>
                </div>
              </div>
              <span
                className={`tabular-nums text-sm font-medium ${
                  tx.direction === "in" ? "text-mint" : "text-ink"
                }`}
              >
                {tx.direction === "in" ? "+" : "−"}
                {formatCurrency(tx.amount)}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
