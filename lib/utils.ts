export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function generateAccountNumber() {
  return Array.from({ length: 4 }, () =>
    Math.floor(1000 + Math.random() * 9000)
  ).join(" ");
}

export function maskAccountNumber(num: string) {
  const parts = num.split(" ");
  return parts.map((p, i) => (i < parts.length - 1 ? "••••" : p)).join(" ");
}

export const CATEGORIES = [
  "Groceries",
  "Food & Dining",
  "Transport",
  "Shopping",
  "Bills & Utilities",
  "Entertainment",
  "Rent",
  "Transfer",
  "General",
];
