export default function SuccessPage() {
    return (
      <main className="min-h-screen bg-primary text-white flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl font-bold mb-6">🎉 Payment Successful!</h1>
        <p className="text-lg text-gray-300 mb-8">
          Thank you for your order. We&apos;ll ship your spare parts as soon as possible.
        </p>
        <a
          href="/products"
          className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Continue Shopping
        </a>
      </main>
    );
  }
  