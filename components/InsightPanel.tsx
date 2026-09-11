"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import { fetcher } from "@/lib/fetcher";

type Insight = {
  id: string;
  headline: string;
  detail: string;
  tone: "positive" | "warning" | "neutral";
};

const toneStyles: Record<Insight["tone"], string> = {
  positive: "bg-mint/10 text-mint",
  warning: "bg-danger/10 text-danger",
  neutral: "bg-violet/10 text-violet",
};

export default function InsightPanel() {
  const { data, isLoading } = useSWR<Insight[]>("/api/insights", fetcher);

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-medium tracking-tight">Insights</h3>
        <span className="rounded-full bg-surface-raised px-2.5 py-1 text-[11px] text-ink-muted">
          Generated for you
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-surface-raised" />
          ))}

        {data?.map((insight, i) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="rounded-xl bg-surface-raised p-4"
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${toneStyles[insight.tone]}`}
              >
                ●
              </span>
              <div>
                <p className="text-sm font-medium text-ink">{insight.headline}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{insight.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
