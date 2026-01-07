import { connectDB } from "@/lib/db";
import Product from "@/lib/models/product";
import Link from "next/link";
import Image from "next/image";

export default async function StorePage() {
  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow hover:shadow-lg">
            <Image
              src={product.imageUrl || product.image || "/placeholder.svg"}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock}</p>
            <Link
              href={`/store/${product._id}`}
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}