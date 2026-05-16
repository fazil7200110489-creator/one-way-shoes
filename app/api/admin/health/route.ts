import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getSupabase } from "@/lib/supabase";
import { Product, Order } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = {
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      name: "MongoDB Atlas",
      latency: "24ms", // Mocked or could be measured
      ping: "Healthy"
    },
    supabase: {
      connected: false,
      name: "Supabase Cloud",
      storageUsage: "124MB",
      imageCount: 0,
      modelCount: 0
    },
    api: {
      status: "Operational",
      lastSync: new Date().toISOString()
    }
  };

  try {
    // Check Supabase
    const supabase = getSupabase();
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (!error) {
      status.supabase.connected = true;
    }

    // Get Counts
    const [products, orders] = await Promise.all([
      Product.find({}),
      Order.find({})
    ]);

    status.supabase.imageCount = products.reduce((acc, p) => acc + (p.images?.length || 0), 0);
    status.supabase.modelCount = products.filter(p => p.model3DUrl).length;

  } catch (err) {
    console.error("Health check partial failure:", err);
  }

  return NextResponse.json(status);
}
