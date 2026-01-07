import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/order";
import { authOptions } from "@/lib/auth";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  await connectDB();
  const orders = await Order.find({ user: session.user.id })
    .populate("items.product")
    .sort({ createdAt: -1 });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="border rounded p-4">
              <div className="flex justify-between mb-4">
                <span>Order #{order._id.toString().slice(-8)}</span>
                <span className="capitalize">{order.status}</span>
              </div>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 font-semibold">
                Total: ${order.totalAmount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}