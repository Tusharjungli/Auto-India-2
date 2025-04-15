import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import FeedbackForm from "@/components/FeedbackForm";


export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return (
      <main className="min-h-screen bg-primary text-white flex justify-center items-center">
        <p className="text-lg">Please log in to view your orders.</p>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });

  const orders = user?.orders || [];

  return (
    <main className="min-h-screen bg-primary text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-700 rounded-xl p-6 bg-accent">
              <div className="flex justify-between text-sm text-gray-400 mb-4">
                <span>Order ID: {order.id}</span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-400">
                        ₹{item.price} × {item.quantity} = ₹
                        {item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right mt-4 text-lg font-semibold text-white">
                Total: ₹{order.total}
                <p className="text-sm text-green-400">
                    Status: {order.status}
                </p>
                <p className="text-sm text-gray-300">
                    Delivery by: {order.deliveryDate
                    ? new Date(order.deliveryDate).toLocaleDateString()
                    : "TBD"}
                </p>

                <a
                  href={`/api/invoice/${order.id}`}
                  className="text-blue-400 underline text-sm mt-2 inline-block"
                  download
                >
                  🧾 Download Invoice
                </a>


              </div>

              <FeedbackForm pageUrl="/profile" />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
