"use client";

import { useState } from "react";

export default function FeedbackForm({ pageUrl }: { pageUrl: string }) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, pageUrl }),
    });
    setSubmitted(true);
  };

  if (submitted) return <p className="text-green-400">✅ Thanks for your feedback!</p>;

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4 max-w-xl">
      <label className="block text-sm">Leave us feedback:</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="What can we improve?"
        required
        className="w-full bg-black text-white px-4 py-2 rounded"
      />
      <button
        type="submit"
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
      >
        Submit
      </button>
    </form>
  );
}
