import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`[PATCH /api/products/${id}] Connecting to MongoDB...`);
    await connectDB();
    console.log(`[PATCH /api/products/${id}] Connected to MongoDB.`);

    const body = await req.json();
    console.log(`[PATCH /api/products/${id}] Received product data:`, body);

    const product = await Product.findByIdAndUpdate(id, body, { new: true });
    console.log(`[PATCH /api/products/${id}] Product updated successfully. ID:`, product?._id);
    console.log(`[PATCH /api/products/${id}] Image URLs saved:`, product?.images);

    return NextResponse.json(product);
  } catch (error) {
    console.error(`[PATCH /api/products] Error updating product:`, error);
    return NextResponse.json({ error: "Failed to update product", details: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ message: "Product deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

