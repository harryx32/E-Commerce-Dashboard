import { connectDB } from "@/lib/db";
import Product from "@/lib/models/product";

export default async function TestProductPage() {
  await connectDB();

  const product = await Product.create({
    name: "Test Shoe",
    price: 4999,
    stock: 10,
    category: "Footwear",
    description: "Testing product model",
  });

  return (
    <div style={{ padding: "20px" }}>
      <h1>Product Created ✅</h1>
      <pre>{JSON.stringify(product, null, 2)}</pre>
    </div>
  );
}
