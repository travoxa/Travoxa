import { NextRequest, NextResponse } from "next/server";
import { checkUserExists, createUser, updateUser, upsertUser, getUser } from "@/lib/mongodbUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, gender, interests, hasBike, authProvider } = body;

    if (!email || !name || !gender) {
      return NextResponse.json(
        { error: "Missing required fields: email, name, and gender are required" },
        { status: 400 }
      );
    }

    const userData = {
      email,
      name,
      phone: phone || "",
      gender,
      interests: interests || [],
      hasBike: hasBike || false,
      authProvider: authProvider || "email",
    };

    // For API calls, we use email as the identifier for MongoDB
    const exists = await checkUserExists(email);
    
    if (exists) {
      await updateUser(email, userData);
    } else {
      await createUser(userData);
    }

    return NextResponse.json(
      { message: "User data saved successfully" },
      { status: 200 }
    );
  } catch (error) {
      console.error("Error in users API:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      console.error("Stack:", error instanceof Error ? error.stack : 'No stack');
      return NextResponse.json(
        { error: "Failed to save user data", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const exists = await checkUserExists(email);
    let userData = null;

    if (exists) {
      const userResult = await getUser(email);
      userData = userResult;
    }

    return NextResponse.json(
      { exists, userData: exists ? userData : null },
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