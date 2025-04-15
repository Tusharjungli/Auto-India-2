// app/login/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-primary text-white flex items-center justify-center px-4">
      <div className="bg-accent p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

        <button
            onClick={() =>
                signIn("google", { callbackUrl: "/products" })
            }
            className="w-full bg-white text-black py-2 rounded-lg mb-4 hover:bg-gray-200 transition"
        >
            Sign in with Google
        </button>


        <div className="text-center text-gray-400 my-4">or use email</div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            signIn("credentials", { email });
          }}
          className="space-y-4"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-md bg-black text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-white text-black py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Continue
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          By signing in, you agree to our Terms & Conditions.
        </p>
      </div>
    </div>
  );
}
