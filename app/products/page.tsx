import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Prisma } from "@prisma/client"; // Required for QueryMode.insensitive

interface SearchParams {
  q?: string;
  category?: string;
  brand?: string;
  instock?: string;
  min?: string;
  max?: string;
  page?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const safeParams = searchParams || {};
  const q = safeParams.q?.toLowerCase() || "";
  const category = safeParams.category || "";
  const brand = safeParams.brand || "";
  const inStockOnly = safeParams.instock === "true";
  const min = parseFloat(safeParams.min || "0");
  const max = parseFloat(safeParams.max || "100000");
  const currentPage = parseInt(safeParams.page || "1");
  const perPage = 9;
  const skip = (currentPage - 1) * perPage;

  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  const brands = await prisma.product.findMany({
    select: { brand: true },
    distinct: ["brand"],
  });

  const where = {
    AND: [
      {
        OR: [
          { name: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { brand: { contains: q, mode: Prisma.QueryMode.insensitive } },
          { category: { contains: q, mode: Prisma.QueryMode.insensitive } },
        ],
      },
      ...(category ? [{ category }] : []),
      ...(brand ? [{ brand }] : []),
      ...(inStockOnly ? [{ stock: { gt: 0 } }] : []),
      { price: { gte: min, lte: max } },
    ],
  };

  const products = await prisma.product.findMany({
    where,
    skip,
    take: perPage,
    include: { ratings: true },
  });

  const totalCount = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalCount / perPage);

  // ✅ Precompute pagination links (safe way)
  const paginationLinks = Array.from({ length: totalPages }, (_, i) => {
    const url = new URLSearchParams();

    if (q) url.append("q", q);
    if (category) url.append("category", category);
    if (brand) url.append("brand", brand);
    if (inStockOnly) url.append("instock", "true");
    if (min > 0) url.append("min", min.toString());
    if (max !== 100000) url.append("max", max.toString());

    url.set("page", (i + 1).toString());

    return {
      href: `/products?${url.toString()}`,
      page: i + 1,
      isActive: currentPage === i + 1,
    };
  });

  return (
    <main className="p-6 bg-primary min-h-screen text-white">
      <form className="mb-6 space-y-4">
        <input
          type="text"
          name="q"
          placeholder="Search by name, brand, or category..."
          defaultValue={q}
          className="w-full px-4 py-2 rounded bg-black text-white placeholder-gray-400"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <select
            name="category"
            defaultValue={category}
            className="bg-black text-white px-4 py-2 rounded"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.category} value={c.category}>
                {c.category}
              </option>
            ))}
          </select>

          <select
            name="brand"
            defaultValue={brand}
            className="bg-black text-white px-4 py-2 rounded"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.brand} value={b.brand}>
                {b.brand}
              </option>
            ))}
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="instock"
              value="true"
              defaultChecked={inStockOnly}
              className="form-checkbox text-white bg-black border-white"
            />
            <span>In Stock</span>
          </label>

          <div className="flex gap-2">
            <input
              type="number"
              name="min"
              placeholder="Min ₹"
              defaultValue={min || ""}
              className="bg-black text-white px-4 py-2 rounded w-full"
            />
            <input
              type="number"
              name="max"
              placeholder="Max ₹"
              defaultValue={max !== 100000 ? max : ""}
              className="bg-black text-white px-4 py-2 rounded w-full"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
          >
            Apply Filters
          </button>

          <Link
            href="/products"
            className="inline-block bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Clear All
          </Link>
        </div>
      </form>

      <h1 className="text-2xl font-bold mb-6">Filtered Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-10">
        {paginationLinks.map((link) => (
          <Link
            key={link.page}
            href={link.href}
            className={`px-4 py-2 rounded ${
              link.isActive
                ? "bg-white text-black font-bold"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {link.page}
          </Link>
        ))}
      </div>
    </main>
  );
}
