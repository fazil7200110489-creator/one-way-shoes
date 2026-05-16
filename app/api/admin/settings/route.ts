import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { AdminSettings } from "@/lib/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    let settings = await AdminSettings.findOne({});
    
    // Create default settings if not exists
    if (!settings) {
      settings = await AdminSettings.create({
        security: { password: "admin123" } // Default password, should be changed
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    let settings = await AdminSettings.findOne({});
    if (!settings) {
      settings = await AdminSettings.create({ ...body, security: { password: body.security?.password || "admin123" } });
    } else {
      settings = await AdminSettings.findOneAndUpdate({}, body, { new: true });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
