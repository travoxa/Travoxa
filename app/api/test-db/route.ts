import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ 
      status: "MongoDB connected ✅",
      message: "Database connection successful"
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    return NextResponse.json({ 
      status: "MongoDB connection failed ❌",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
