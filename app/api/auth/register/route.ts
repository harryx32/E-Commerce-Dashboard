import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { userRegisterSchema } from "@/lib/validators/user";

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const validation = userRegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Validation error", errors: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User created successfully", user: { id: user._id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to register user" },
      { status: 500 }
    );
  }
}