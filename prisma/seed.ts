import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CATEGORIES = ["Groceries", "Food & Dining", "Transport", "Shopping", "Bills & Utilities", "Entertainment"];

async function main() {
  const email = "demo@novabank.app";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Demo user already exists, skipping seed.");
    return;
  }

  const passwordHash = await bcrypt.hash("password123", 10);

  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email,
      passwordHash,
      accounts: {
        create: [
          { type: "CHECKING", nickname: "Everyday Checking", accountNumber: "1111 2222 3333", balance: 24500 },
          { type: "SAVINGS", nickname: "Growth Savings", accountNumber: "4444 5555 6666", balance: 81200 },
        ],
      },
    },
    include: { accounts: true },
  });

  const checking = user.accounts.find((a) => a.type === "CHECKING")!;

  const now = new Date();
  const txs = Array.from({ length: 18 }).map((_, i) => {
    const daysAgo = Math.floor(Math.random() * 55);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    return {
      type: "WITHDRAWAL" as const,
      amount: Math.round((150 + Math.random() * 3200) * 100) / 100,
      category: CATEGORIES[i % CATEGORIES.length],
      description: `${CATEGORIES[i % CATEGORIES.length]} purchase`,
      createdAt: date,
      fromAccountId: checking.id,
    };
  });

  await prisma.transaction.createMany({ data: txs });

  console.log("Seeded demo user: demo@novabank.app / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
