import TransferForm from "@/components/TransferForm";
import TransactionList from "@/components/TransactionList";

export default function TransferPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-medium tracking-tight">Transfer</h1>
        <p className="mt-1 text-sm text-ink-muted">Move money between accounts instantly.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <TransferForm />
        <TransactionList limit={6} />
      </div>
    </div>
  );
}
