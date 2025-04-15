import { prisma } from "@/lib/prisma";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { orderId: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      items: true,
      user: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 700]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let y = 680;

  const drawText = (text: string, size = 12) => {
    page.drawText(text, { x: 50, y, size, font, color: rgb(0, 0, 0) });
    y -= size + 6;
  };

  drawText("Auto India Spare Parts — Invoice", 16);
  drawText(`Invoice ID: ${order.id}`);
  drawText(`Customer: ${order.user?.email || "Guest"}`);
  drawText(`Date: ${new Date(order.createdAt).toDateString()}`);
  drawText(`Status: ${order.status}`);
  drawText(`Delivery: ${order.deliveryDate?.toDateString() || "N/A"}`);
  y -= 10;
  drawText("Items:", 14);

  order.items.forEach((item, i) => {
    drawText(`${i + 1}. ${item.name} — Rs. ${item.price} × ${item.quantity}`);
  });

  y -= 10;
  drawText(`Total: Rs. ${order.total}`, 14);

  const pdfBytes = await pdfDoc.save();

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${order.id}.pdf`,
    },
  });
}
