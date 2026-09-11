import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  fromAccountId: z.string(),
  toAccountNumber: z.string().min(4),
  amount: z.number().positive().max(1_000_000),
  description: z.string().min(1).max(120),
  category: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { fromAccountId, toAccountNumber, amount, description, category } = parsed.data;
  const userId = (session.user as any).id;

  const fromAccount = await prisma.account.findFirst({
    where: { id: fromAccountId, userId },
  });
  if (!fromAccount) {
    return NextResponse.json({ error: "Source account not found" }, { status: 404 });
  }
  if (Number(fromAccount.balance) < amount) {
    return NextResponse.json({ error: "Insufficient funds" }, { status: 422 });
  }

  const toAccount = await prisma.account.findUnique({
    where: { accountNumber: toAccountNumber.trim() },
  });
  if (!toAccount) {
    return NextResponse.json({ error: "Recipient account not found" }, { status: 404 });
  }
  if (toAccount.id === fromAccount.id) {
    return NextResponse.json({ error: "Cannot transfer to the same account" }, { status: 400 });
  }

  const [, , transaction] = await prisma.$transaction([
    prisma.account.update({
      where: { id: fromAccount.id },
      data: { balance: { decrement: amount } },
    }),
    prisma.account.update({
      where: { id: toAccount.id },
      data: { balance: { increment: amount } },
    }),
    prisma.transaction.create({
      data: {
        type: "TRANSFER",
        amount,
        category,
        description,
        fromAccountId: fromAccount.id,
        toAccountId: toAccount.id,
      },
    }),
  ]);

  return NextResponse.json({ success: true, transactionId: transaction.id });
}
