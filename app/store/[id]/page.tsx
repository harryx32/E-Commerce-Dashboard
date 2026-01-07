import { connectDB } from "@/lib/db";
import Product from "@/lib/models/product";
import { notFound } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.imageUrl || product.image || "/placeholder.svg"}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-96 object-cover rounded"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl text-green-600 mb-4">${product.price}</p>
          <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
          <p className="mb-6">{product.description}</p>
          <AddToCartButton productId={product._id.toString()} />
        </div>
      </div>
    </div>
  );
}