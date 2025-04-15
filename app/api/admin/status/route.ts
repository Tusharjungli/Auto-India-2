import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client"; // ✅ Import enum
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.formData();
  const status = body.get("status")?.toString() as OrderStatus; // ✅ Cast to enum

  if (!id || !status) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  await prisma.order.update({
    where: { id },
    data: { status },
  });

  return NextResponse.redirect(new URL("/admin", req.url));

}
