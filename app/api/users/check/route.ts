import { NextRequest, NextResponse } from "next/server";
import { checkUserExists } from "@/lib/mongodbUtils";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const result = await checkUserExists(email);

    return NextResponse.json(
      { exists: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking user exists:", error);
    return NextResponse.json(
      { error: "Failed to check user existence" },
      { status: 500 }
    );
  }
}