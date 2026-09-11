import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInsights } from "@/lib/insights";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const accounts = await prisma.account.findMany({
    where: { userId },
    select: { id: true },
  });
  const accountIds = accounts.map((a) => a.id);

  const transactions = await prisma.transaction.findMany({
    where: { fromAccountId: { in: accountIds } },
    select: { amount: true, category: true, createdAt: true },
  });

  const insights = generateInsights(
    transactions.map((t) => ({
      amount: Number(t.amount),
      category: t.category,
      createdAt: t.createdAt,
      direction: "out" as const,
    }))
  );

  return NextResponse.json(insights);
}
