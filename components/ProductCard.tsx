"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

type ProductWithRating = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl: string;
  stock: number;
  category: string;
  brand: string;
  ratings?: { stars: number }[];
};

export default function ProductCard({ product }: { product: ProductWithRating }) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const avgRating =
    product.ratings && product.ratings.length > 0
      ? product.ratings.reduce((acc, r) => acc + r.stars, 0) / product.ratings.length
      : null;

  useEffect(() => {
    if (!session?.user?.email) return;
    fetch(`/api/user-wishlist?productId=${product.id}`)
      .then((res) => res.json())
      .then((data) => setIsWishlisted(data.found));
  }, [product.id, session]);

  const toggleWishlist = async () => {
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    });

    const result = await res.json();
    if (result.success) {
      setIsWishlisted((prev) => !prev);
    }
  };

  return (
    <div className="bg-accent p-4 rounded-xl shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full h-40 mb-4">
          <Image
            src={product.imageUrl || "https://via.placeholder.com/300"}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
          {session?.user && (
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist();
              }}
              className="absolute top-2 right-2 text-xl"
            >
              {isWishlisted ? "❤️" : "🤍"}
            </button>
          )}
        </div>
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-400">{product.brand}</p>
        {avgRating ? (
          <p className="text-sm text-yellow-400">
            ★ {avgRating.toFixed(1)} ({product.ratings?.length})
          </p>
        ) : (
          <p className="text-sm text-gray-500">No ratings yet</p>
        )}
        <p className="text-sm my-2">{product.description}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="font-bold text-lg">₹{product.price}</span>
        </div>
      </Link>

      <button
        onClick={() =>
          addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1,
          })
        }
        className="mt-4 w-full bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
