import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Order, Product } from "@/lib/models";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const { status } = await req.json();
    
    const order = await Order.findById(id);

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // If verifying payment, reduce stock
    if (status === "Verified" && order.status !== "Verified") {
      const product = await Product.findById(order.productId);
      if (product && product.stock > 0) {
        product.stock -= 1;
        await product.save();
      }
    }

    order.status = status;
    await order.save();
    
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
