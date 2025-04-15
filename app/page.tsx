// app/page.tsx

import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-primary text-highlight px-6 py-12 flex flex-col justify-center items-center">
      <div className="max-w-5xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold">
          Auto India Spare Parts
        </h1>
        <p className="text-lg md:text-xl text-gray-400">
          Premium car spare parts, trusted by drivers across India.
        </p>
        <Link
          href="/products"
          className="inline-block bg-white text-black px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:scale-105 transition-transform"
        >
          Browse Products
        </Link>
      </div>

      <div className="mt-12 w-full max-w-4xl">
        <Image
          src="/images/car-bg.jpg"
          alt="Car Background"
          width={1200}
          height={500}
          className="rounded-2xl object-cover shadow-xl"
        />
      </div>
    </main>
  );
}
