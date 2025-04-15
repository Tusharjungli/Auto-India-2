import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FeedbackAdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== "jungli0beast@gmail.com") redirect("/");

  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <main className="min-h-screen bg-primary text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">User Feedback</h1>
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
