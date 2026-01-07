import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/order";
import Cart from "@/lib/models/cart";
import Product from "@/lib/models/product";
import { authOptions } from "@/lib/auth";

// GET user orders
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ user: session.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST create order
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "user") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { shippingAddress } = await request.json();

    const cart = await Cart.findOne({ user: session.user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // Check stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json(
          { message: `Insufficient stock for ${product?.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const order = await Order.create({
      user: session.user.id,
      items: cart.items,
      totalAmount,
      shippingAddress,
    });

    // Clear cart
    await Cart.findByIdAndDelete(cart._id);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 }
    );
  }
}