import TransactionList from "@/components/TransactionList";

export default function TransactionsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-medium tracking-tight">Transactions</h1>
        <p className="mt-1 text-sm text-ink-muted">Every transfer in and out of your accounts.</p>
      </div>
      <TransactionList />
    </div>
  );
}
