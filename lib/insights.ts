type Tx = {
  amount: number;
  category: string;
  createdAt: Date;
  direction: "in" | "out";
};

export type Insight = {
  id: string;
  headline: string;
  detail: string;
  tone: "positive" | "warning" | "neutral";
};

function startOfMonth(d: Date, offset = 0) {
  return new Date(d.getFullYear(), d.getMonth() + offset, 1);
}

/**
 * Generates plain-English spending insights from raw transaction data using
 * category aggregation and month-over-month deltas. Deterministic and
 * dependency-free, so it works out of the box with no external AI API key.
 * Swap this out for a real LLM call (see README) if you want generative copy.
 */
export function generateInsights(transactions: Tx[]): Insight[] {
  const now = new Date();
  const thisMonthStart = startOfMonth(now, 0);
  const lastMonthStart = startOfMonth(now, -1);

  const thisMonth = transactions.filter(
    (t) => t.direction === "out" && t.createdAt >= thisMonthStart
  );
  const lastMonth = transactions.filter(
    (t) =>
      t.direction === "out" && t.createdAt >= lastMonthStart && t.createdAt < thisMonthStart
  );

  const sumBy = (list: Tx[]) => {
    const map = new Map<string, number>();
    for (const t of list) {
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    }
    return map;
  };

  const thisMap = sumBy(thisMonth);
  const lastMap = sumBy(lastMonth);

  const insights: Insight[] = [];

  // Biggest category this month
  const sortedThis = [...thisMap.entries()].sort((a, b) => b[1] - a[1]);
  if (sortedThis.length > 0) {
    const [topCategory, topAmount] = sortedThis[0];
    const totalThis = [...thisMap.values()].reduce((a, b) => a + b, 0);
    const share = totalThis > 0 ? Math.round((topAmount / totalThis) * 100) : 0;
    insights.push({
      id: "top-category",
      headline: `${topCategory} is your biggest spend this month`,
      detail: `₹${topAmount.toLocaleString("en-IN")} across ${topCategory.toLowerCase()} — about ${share}% of what you've spent so far.`,
      tone: "neutral",
    });
  }

  // Biggest month-over-month mover
  let biggestDelta = { category: "", pct: 0, amount: 0 };
  for (const [cat, amt] of thisMap.entries()) {
    const prev = lastMap.get(cat) ?? 0;
    if (prev > 0) {
      const pct = ((amt - prev) / prev) * 100;
      if (Math.abs(pct) > Math.abs(biggestDelta.pct)) {
        biggestDelta = { category: cat, pct, amount: amt };
      }
    }
  }
  if (biggestDelta.category) {
    const up = biggestDelta.pct > 0;
    insights.push({
      id: "trend",
      headline: `${biggestDelta.category} spending is ${up ? "up" : "down"} ${Math.abs(
        Math.round(biggestDelta.pct)
      )}% vs last month`,
      detail: up
        ? `Keep an eye on ${biggestDelta.category.toLowerCase()} — it's grown faster than anything else in your budget.`
        : `Nice work trimming ${biggestDelta.category.toLowerCase()} spend compared to last month.`,
      tone: up ? "warning" : "positive",
    });
  }

  // Spending velocity — average transaction size trend
  if (thisMonth.length >= 3) {
    const avg = thisMonth.reduce((a, t) => a + t.amount, 0) / thisMonth.length;
    insights.push({
      id: "velocity",
      headline: `${thisMonth.length} transactions logged this month`,
      detail: `Averaging ₹${avg.toLocaleString("en-IN", { maximumFractionDigits: 0 })} per transaction. Smallest habits add up fastest.`,
      tone: "neutral",
    });
  }

  if (insights.length === 0) {
    insights.push({
      id: "empty",
      headline: "Not enough activity yet for insights",
      detail: "Make a few transactions and this panel will start surfacing patterns automatically.",
      tone: "neutral",
    });
  }

  return insights.slice(0, 3);
}
