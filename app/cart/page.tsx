"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useEffect } from "react";
import FeedbackForm from "@/components/FeedbackForm";



type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  theme: {
    color: string;
  };
};

interface RazorpayInstance {
  open(): void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleCheckout = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total }),
    });

    const data = await res.json();

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: data.amount,
      currency: "INR",
      name: "Auto India Spare Parts",
      description: "Spare Parts Payment",
      order_id: data.id,
      handler: async function (response) {
        // Save order to DB
        await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart,
            total,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        alert("✅ Payment Successful!");
        clearCart();
        window.location.href = "/success";
      },
      theme: { color: "#1f1f1f" },
    };

    const Razorpay = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <main className="min-h-screen bg-primary text-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-400">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-accent p-4 rounded-lg shadow-md gap-4"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-400">₹{item.price}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 bg-gray-700 text-white rounded"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-2 py-1 bg-gray-700 text-white rounded"
                    >
                      +
                    </button>
                  </div>

                  <p className="text-gray-300 mt-1">
                    Subtotal: ₹{item.price * item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-300"
                >
                  ❌
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 text-right">
            <h2 className="text-xl font-bold">Total: ₹{total}</h2>
            <div className="mt-4 flex gap-4 justify-end">
              <button
                onClick={clearCart}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
              >
                Proceed to Checkout
              </button>
              
            </div>
            <FeedbackForm pageUrl="/profile" />

          </div>
        </>
      )}
    </main>
  );
}
