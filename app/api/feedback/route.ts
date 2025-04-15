import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();

  const feedback = await prisma.feedback.create({
    data: {
      message: body.message,
      pageUrl: body.pageUrl,
      user: session?.user?.email
        ? { connect: { email: session.user.email } }
        : undefined,
    },
  });

  return NextResponse.json({ success: true, feedback });
}
