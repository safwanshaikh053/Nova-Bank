import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    where: {
      OR: [
        { fromAccountId: { in: accountIds } },
        { toAccountId: { in: accountIds } },
      ],
    },
    include: {
      fromAccount: { select: { nickname: true, id: true } },
      toAccount: { select: { nickname: true, id: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const shaped = transactions.map((t) => {
    const isOutgoing = accountIds.includes(t.fromAccountId ?? "");
    return {
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      category: t.category,
      description: t.description,
      createdAt: t.createdAt,
      direction: isOutgoing ? "out" : "in",
      counterparty: isOutgoing
        ? t.toAccount?.nickname ?? "External"
        : t.fromAccount?.nickname ?? "External",
    };
  });

  return NextResponse.json(shaped);
}
