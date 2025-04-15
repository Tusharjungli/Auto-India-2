import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email !== "jungli0beast@gmail.com") {
    return redirect("/");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: true,
    },
  });

  const ratings = await prisma.rating.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      product: true,
    },
  });

  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <main className="min-h-screen bg-primary text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Orders Dashboard</h1>

      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-accent p-4 rounded-xl shadow">
            <div className="flex justify-between text-sm text-gray-400">
              <p>Order ID: {order.id}</p>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <p className="text-sm text-gray-300">User: {order.user?.email || "Guest"}</p>
            <p className="mt-2 font-medium">Total: ₹{order.total}</p>

            <form
              action={`/api/admin/status?id=${order.id}`}
              method="POST"
              className="mt-2 flex items-center gap-2"
            >
              <select
                name="status"
                defaultValue={order.status}
                className="bg-black border border-gray-600 px-2 py-1 text-white rounded"
              >
                <option value="SUCCESS">Success</option>
                <option value="PENDING">Pending</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="FAILED">Failed</option>
              </select>
              <button
                type="submit"
                className="bg-white text-black px-3 py-1 rounded"
              >
                Update
              </button>
            </form>

            <p className="mt-2 text-sm text-gray-400">
              Delivery: {order.deliveryDate ? new Date(order.deliveryDate).toDateString() : "N/A"}
            </p>

            <ul className="mt-4 text-sm list-disc list-inside text-gray-300">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.name} — ₹{item.price} × {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-16 mb-4">User Ratings & Comments</h2>
      <div className="space-y-6">
        {ratings.map((r) => (
          <div key={r.id} className="bg-accent p-4 rounded shadow">
            <p className="text-sm text-gray-400">
              {r.user?.email || "Guest"} • {new Date(r.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-300">Product: {r.product.name}</p>
            <p className="text-yellow-400 text-sm">⭐ {r.stars}</p>
            {r.comment && (
              <p className="text-white mt-1">“{r.comment}”</p>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-16 mb-4">User Feedback</h2>
      <div className="space-y-6">
        {feedbacks.map((f) => (
          <div key={f.id} className="bg-accent p-4 rounded shadow">
            <p className="text-sm text-gray-400">
              {f.user?.email || "Guest"} • {new Date(f.createdAt).toLocaleString()}
            </p>
            <p className="text-sm italic text-gray-500 mb-1">From: {f.pageUrl}</p>
            <p className="text-white">{f.message}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
