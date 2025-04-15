import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email"; // ✅ Add this

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const body = await req.json();

  const {
    items,
    total,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = body;

  try {
    const order = await prisma.order.create({
      data: {
        user: session?.user?.email
          ? { connect: { email: session.user.email } }
          : undefined,
        total,
        status: "success",
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        items: {
          create: items.map((item: {
            id: string;
            name: string;
            price: number;
            quantity: number;
            imageUrl: string;
          }) => ({
            productId: item.id,
            name: item.name,
            imageUrl: item.imageUrl,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // ✅ Send confirmation email if user is logged in
    if (session?.user?.email) {
      await sendOrderConfirmationEmail({
        to: session.user.email,
        orderId: order.id,
        total,
      });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Order Save Error:", error);
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}
