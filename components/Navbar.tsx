"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { data: session } = useSession();
  const { cart } = useCart();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="w-full bg-black text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link href="/" className="text-2xl font-bold">
        Auto India
      </Link>

      <div className="space-x-6 text-sm font-medium flex items-center">
        <Link href="/products" className="hover:text-gray-400">
          Products
        </Link>

        <Link href="/wishlist" className="hover:text-gray-400">
          ❤️ Wishlist
        </Link>


        <Link href="/my-orders" className="hover:text-gray-400">
            My Orders
        </Link>


        <Link href="/cart" className="relative hover:text-gray-400">
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {cartCount}
            </span>
          )}
        </Link>

        <Link href="/profile" className="hover:text-gray-400">
          Profile
        </Link>


        {!session ? (
          <button
            onClick={() => signIn("google", { callbackUrl: "/products" })}
            className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200"
          >
            Login
          </button>
        ) : (
          <>
            <p className="text-gray-300">{session.user?.name}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
