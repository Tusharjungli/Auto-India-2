import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { productId, stars, comment } = body;

  const rating = await prisma.rating.upsert({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
    update: {
      stars,
      comment,
    },
    create: {
      userId: user.id,
      productId,
      stars,
      comment,
    },
  });

  return NextResponse.json({ success: true, rating });
}
