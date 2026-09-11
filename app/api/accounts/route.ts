import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.account.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(
    accounts.map((a) => ({ ...a, balance: Number(a.balance) }))
  );
}
