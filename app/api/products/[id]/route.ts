import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/product";

// GET single product
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// UPDATE product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 }
    );
  }
}
