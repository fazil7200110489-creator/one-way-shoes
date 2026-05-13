import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order, Product } from "@/lib/models";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // Create the order
    const order = await Order.create(body);
    
    // Note: Stock reduction usually happens after payment verification
    // But we'll implement that in the status update API
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
