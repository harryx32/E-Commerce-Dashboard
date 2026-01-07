"use client";

import { useState, useEffect } from "react";
import DeleteButton from "./DeleteButton";
import Charts from "./charts";
import Image from "next/image";

/* =======================
   SKELETON COMPONENTS
======================= */

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 bg-gray-100 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-white border rounded-xl shadow-sm">
      {[...Array(7)].map((_, i) => (
        <div
          key={i}
          className="h-12 border-b last:border-none bg-gray-50 animate-pulse"
        />
      ))}
    </div>
  );
}

/* =======================
   MAIN COMPONENT
======================= */

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function DashboardUI({ products }: { products: Product[] }) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Simulate loading or just set to false
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* =======================
     LOADING STATE
  ======================= */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <StatsSkeleton />
        <TableSkeleton />
      </div>
    );
  }

  /* =======================
     REAL UI
  ======================= */
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <p className="text-sm text-gray-500">Manage your products here</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <h3 className="text-2xl font-semibold text-indigo-600">
            {products.length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Low Stock</p>
          <h3 className="text-2xl font-semibold text-red-600">
            {products.filter((p) => p.stock < 10).length}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">Categories</p>
          <h3 className="text-2xl font-semibold text-green-600">
            {new Set(products.map((p) => p.category)).size}
          </h3>
        </div>
      </div>

      {/* Analytics Charts */}
      <Charts products={products} />

      {/* Product List Header + Search */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Product List
          </h2>
          <p className="text-sm text-gray-500">
            View and manage all products
          </p>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="px-4 py-2 text-sm border rounded-lg
                     text-gray-900 placeholder-gray-400
                     focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-600">
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr
                key={product._id}
                className="border-t hover:bg-indigo-50/40 transition"
              >
                {/* IMAGE */}
                <td className="px-6 py-4">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg
                                    flex items-center justify-center
                                    text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                </td>

                {/* NAME */}
                <td className="px-6 py-4 font-medium text-gray-900">
                  {product.name}
                </td>

                {/* PRICE */}
                <td className="px-6 py-4 text-gray-900 font-medium">
                  ₹{product.price}
                </td>

                {/* STOCK */}
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    {product.stock}
                  </span>
                </td>

                {/* CATEGORY */}
                <td className="px-6 py-4 text-gray-600">
                  {product.category}
                </td>

                {/* ACTION */}
                <td className="px-6 py-4 text-right">
                  <DeleteButton id={product._id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No products match your search
          </div>
        )}
      </div>
    </div>
  );
}
