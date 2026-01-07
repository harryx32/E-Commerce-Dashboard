import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import Cart from "@/lib/models/cart";
import CartItem from "@/components/CartItem";
import CheckoutButton from "@/components/CheckoutButton";
import { authOptions } from "@/lib/auth";

export default async function CartPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "user") {
    redirect("/login");
  }

  await connectDB();
  const cart = await Cart.findOne({ user: session.user.id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <CartItem key={item._id} item={item} />
        ))}
      </div>
      <div className="mt-8">
        <p className="text-xl font-semibold">Total: ${total.toFixed(2)}</p>
        <CheckoutButton cart={cart} />
      </div>
    </div>
  );
}