import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import Cart from "@/lib/models/cart";
import Product from "@/lib/models/product";
import { authOptions } from "@/lib/auth";

// PUT update quantity
export async function PUT(
  request: Request,
  { params }: { params: { itemId: string } }
)
 {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "user") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { itemId } = await params;
    const { quantity } = await request.json();

    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    const oldQuantity = item.quantity;
    item.quantity = quantity;

    // Adjust stock: decrease by (new - old)
    const quantityDiff = quantity - oldQuantity;
    if (quantityDiff !== 0) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -quantityDiff }
      });
    }

    await cart.save();

    // Use aggregation to get updated cart with product data
    const cartData = await Cart.aggregate([
      { $match: { _id: cart._id } },
      { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productData"
        }
      },
      { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          items: {
            $push: {
              _id: "$items._id",
              product: {
                _id: "$productData._id",
                name: "$productData.name",
                price: "$productData.price",
                imageUrl: "$productData.imageUrl",
                stock: "$productData.stock"
              },
              quantity: "$items.quantity",
              name: "$items.name",
              price: "$items.price",
              image: "$items.image"
            }
          }
        }
      }
    ]);

    // Convert ObjectIds to strings
    const result = {
      _id: cartData[0]._id.toString(),
      items: cartData[0].items.map((item: any) => ({
        ...item,
        _id: item._id.toString(),
        product: item.product ? {
          ...item.product,
          _id: item.product._id.toString()
        } : null
      }))
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE remove item
export async function DELETE(
  _request: Request,
  { params }: { params: { itemId: string } }
)
 {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "user") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { itemId } = await params;

    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    const quantity = item.quantity;
    cart.items.pull(itemId);

    // Restore stock
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: quantity }
    });

    await cart.save();

    // Use aggregation to get updated cart with product data
    const cartData = await Cart.aggregate([
      { $match: { _id: cart._id } },
      { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productData"
        }
      },
      { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$_id",
          items: {
            $push: {
              _id: "$items._id",
              product: {
                _id: "$productData._id",
                name: "$productData.name",
                price: "$productData.price",
                imageUrl: "$productData.imageUrl",
                stock: "$productData.stock"
              },
              quantity: "$items.quantity",
              name: "$items.name",
              price: "$items.price",
              image: "$items.image"
            }
          }
        }
      }
    ]);

    // Handle empty cart case
    if (!cartData || cartData.length === 0) {
      return NextResponse.json({ _id: cart._id.toString(), items: [] });
    }

    // Convert ObjectIds to strings
    const result = {
      _id: cartData[0]._id.toString(),
      items: cartData[0].items.map((item: any) => ({
        ...item,
        _id: item._id.toString(),
        product: item.product ? {
          ...item.product,
          _id: item.product._id.toString()
        } : null
      }))
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to remove item" },
      { status: 500 }
    );
  }
}