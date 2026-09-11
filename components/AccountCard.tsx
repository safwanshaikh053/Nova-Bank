"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";

type Account = {
  id: string;
  nickname: string;
  type: "CHECKING" | "SAVINGS";
  accountNumber: string;
  balance: number;
};

export default function AccountCard({ account, index }: { account: Account; index: number }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(account.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-surface p-6"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{account.nickname}</p>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            account.type === "SAVINGS" ? "bg-violet/10 text-violet" : "bg-mint/10 text-mint"
          }`}
        >
          {account.type === "SAVINGS" ? "Savings" : "Checking"}
        </span>
      </div>
      <AnimatedNumber
        value={account.balance}
        className="mt-3 block font-display text-2xl tabular-nums text-ink"
      />
      <button
        type="button"
        onClick={handleCopy}
        title="Copy account number"
        className="mt-3 flex items-center gap-2 rounded-lg font-mono text-xs text-ink-faint transition-colors hover:text-mint"
      >
        {account.accountNumber}
        <span className="text-[10px]">{copied ? "Copied ✓" : "Copy"}</span>
      </button>
    </motion.div>
  );
}