import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail({
  to,
  orderId,
  total,
}: {
  to: string;
  orderId: string;
  total: number;
}) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject: "Your Auto India Order Confirmation",
      html: `
        <h2>Thank you for your order!</h2>
        <p>Order ID: <strong>${orderId}</strong></p>
        <p>Total: ₹${total}</p>
        <p>Your order has been successfully placed and will be delivered within 5 days.</p>
        <br/>
        <p>Team Auto India</p>
      `,
    });
  } catch (error) {
    console.error("❌ Failed to send confirmation email:", error);
  }
}
