import { connectDB } from "@/lib/db";
import Product from "@/lib/models/product";
import DashboardUI from "./DashboardUI";

export default async function DashboardPage() {
  await connectDB();

  const products = await Product.find()
    .sort({ createdAt: -1 })
    .lean();

  // 🔥 IMPORTANT: make data plain
  const safeProducts = products.map((p) => ({
    ...p,
    _id: p._id.toString(),
    createdAt: p.createdAt?.toString(),
    updatedAt: p.updatedAt?.toString(),
  }));

  return <DashboardUI products={safeProducts} />;
}
