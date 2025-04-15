import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import FeedbackForm from "@/components/FeedbackForm";


export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/"); // Not logged in
  }

  return (
    <main className="min-h-screen bg-primary text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      <div className="bg-accent p-6 rounded-lg shadow-md max-w-xl">
        <p className="mb-2"><strong>Name:</strong> {session.user.name}</p>
        <p className="mb-2"><strong>Email:</strong> {session.user.email}</p>
        {session.user.image && (
          <img
            src={session.user.image}
            alt="Profile"
            className="w-24 h-24 rounded-full mt-4"
          />
        )}

        <FeedbackForm pageUrl="/profile" />

      </div>
    </main>
  );
}
