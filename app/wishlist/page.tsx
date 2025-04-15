import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      wishlist: {
        include: {
          product: {
            include: {
              ratings: true,
            },
          },
        },
      },
    },
  });

  const products = user?.wishlist.map((w) => w.product) || [];

  return (
    <main className="min-h-screen bg-primary text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist ❤️</h1>

      {products.length === 0 ? (
        <p className="text-gray-400">You haven&apos;t added anything to your wishlist yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
