import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import RatingForm from "@/components/RatingForm";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      ratings: true,
    },
  });

  if (!product) return <p className="text-white p-6">Product not found</p>;

  const avgRating =
    product.ratings.length > 0
      ? product.ratings.reduce((acc, r) => acc + r.stars, 0) / product.ratings.length
      : null;

  return (
    <main className="min-h-screen bg-primary text-white px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={300}
          height={300}
          className="rounded-lg object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-400 mb-2">{product.brand}</p>
          <p className="mb-4">{product.description}</p>
          <p className="text-xl font-semibold mb-2">₹{product.price}</p>

          {avgRating ? (
            <p className="text-yellow-400 mb-4">
              ★ {avgRating.toFixed(1)} ({product.ratings.length})
            </p>
          ) : (
            <p className="text-gray-500 mb-4">No ratings yet</p>
          )}

          {session?.user?.email && <RatingForm productId={product.id} />}
        </div>
      </div>
    </main>
  );
}
