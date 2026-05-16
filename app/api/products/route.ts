import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Product } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    console.log("[POST /api/products] Connecting to MongoDB...");
    await connectDB();
    console.log("[POST /api/products] Connected to MongoDB.");

    const body = await req.json();
    console.log("[POST /api/products] Received product data:", body);

    const product = await Product.create(body);
    console.log("[POST /api/products] Product saved successfully. ID:", product._id);
    console.log("[POST /api/products] Image URLs saved:", product.images);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("[POST /api/products] Error saving product:", error);
    return NextResponse.json({ error: "Failed to create product", details: String(error) }, { status: 500 });
  }
}
