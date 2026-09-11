"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import BalanceHero from "@/components/BalanceHero";
import AccountCard from "@/components/AccountCard";
import InsightPanel from "@/components/InsightPanel";
import SpendChart from "@/components/SpendChart";
import TransactionList from "@/components/TransactionList";

type Account = {
  id: string;
  nickname: string;
  type: "CHECKING" | "SAVINGS";
  accountNumber: string;
  balance: number;
};

// Demo trend series for the hero sparkline — in a real deployment this would
// come from a daily balance-snapshot table.
function buildSeries(total: number) {
  const points = 10;
  const series: number[] = [];
  let value = total * 0.82;
  for (let i = 0; i < points; i++) {
    value += (total - value) / (points - i) + (Math.random() - 0.4) * total * 0.02;
    series.push(Math.max(value, 0));
  }
  series[series.length - 1] = total;
  return series;
}

export default function DashboardPage() {
  const { data: accounts, isLoading } = useSWR<Account[]>("/api/accounts", fetcher, {
    refreshInterval: 4000,
  });

  const total = accounts?.reduce((sum, a) => sum + a.balance, 0) ?? 0;
  const series = buildSeries(total || 1);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-medium tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-ink-muted">Here&apos;s where things stand today.</p>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl bg-surface" />
      ) : (
        <BalanceHero total={total} trend={4.8} series={series} />
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {accounts?.map((account, i) => (
          <AccountCard key={account.id} account={account} index={i} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <SpendChart />
          <TransactionList limit={5} />
        </div>
        <InsightPanel />
      </div>
    </div>
  );
}
