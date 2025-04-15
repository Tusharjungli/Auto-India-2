"use client";

import { useState } from "react";

export default function RatingForm({ productId }: { productId: string }) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/rating", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, stars, comment }),
    });

    setSubmitted(true);
  };

  if (submitted) {
    return <p className="text-green-400 mt-4">✅ Rating submitted!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <label className="block text-sm mb-1">Your Rating (1 to 5):</label>
        <input
          type="number"
          min={1}
          max={5}
          value={stars}
          onChange={(e) => setStars(parseInt(e.target.value))}
          className="bg-black text-white px-2 py-1 rounded w-20"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Comment (optional):</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full bg-black text-white px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
      >
        Submit Rating
      </button>
    </form>
  );
}
