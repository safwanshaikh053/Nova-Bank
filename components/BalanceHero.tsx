"use client";

import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import Sparkline from "./Sparkline";

export default function BalanceHero({
  total,
  trend,
  series,
}: {
  total: number;
  trend: number;
  series: number[];
}) {
  const up = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border bg-surface/80 p-8 shadow-card"
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-mint/10 blur-3xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-muted">Total balance</p>
          <AnimatedNumber
            value={total}
            className="mt-2 block font-display text-5xl tabular-nums tracking-tight text-ink"
          />
        </div>
        <span
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
            up ? "bg-mint/10 text-mint" : "bg-danger/10 text-danger"
          }`}
        >
          {up ? "↑" : "↓"} {Math.abs(trend).toFixed(1)}% this month
        </span>
      </div>

      <div className="relative mt-8">
        <Sparkline data={series} height={110} />
      </div>
    </motion.div>
  );
}
