"use client";

import useSWR from "swr";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { fetcher } from "@/lib/fetcher";
import { formatCurrency } from "@/lib/utils";

type Tx = {
  amount: number;
  category: string;
  direction: "in" | "out";
};

const PALETTE = ["#4CD9C0", "#7C8CFF", "#5B67C7", "#2F9C8A", "#8A93AA", "#FF6B6B"];

export default function SpendChart() {
  const { data } = useSWR<Tx[]>("/api/transactions", fetcher);

  const chartData = useMemo(() => {
    if (!data) return [];
    const map = new Map<string, number>();
    for (const t of data) {
      if (t.direction !== "out") continue;
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    }
    return [...map.entries()]
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h3 className="font-display text-lg font-medium tracking-tight">Spend by category</h3>
        <p className="mt-8 pb-4 text-center text-sm text-ink-muted">
          Once you transfer a few times, your category breakdown appears here.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h3 className="font-display text-lg font-medium tracking-tight">Spend by category</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 16 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="category"
              width={110}
              tick={{ fill: "#8A93AA", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
              contentStyle={{
                background: "#1B2438",
                border: "1px solid #2A3450",
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(value: number) => [formatCurrency(value), "Spent"]}
            />
            <Bar dataKey="amount" radius={[0, 8, 8, 0]} barSize={18}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
