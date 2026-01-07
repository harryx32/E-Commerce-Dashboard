import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    debug: true,
    message: "Cart GET route working safely"
  });
}

export async function POST() {
  return NextResponse.json(
    { message: "POST not enabled" },
    { status: 501 }
  );
}
