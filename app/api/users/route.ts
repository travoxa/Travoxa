import { NextRequest, NextResponse } from "next/server";
import { checkUserExists, createUser, updateUser, upsertUser } from "@/lib/userUtils";
import { doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

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

    // For API calls, we need to get the UID from the session or auth
    // Since this is an API route, we'll need to handle auth differently
    // For now, we'll use email as the identifier for API calls
    const db = getFirestore();
    const userRef = doc(db, "Users", email);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      await updateUser(email, userData);
    } else {
      await createUser(email, userData);
    }

    return NextResponse.json(
      { message: "User data saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in users API:", error);
    return NextResponse.json(
      { error: "Failed to save user data" },
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

    return NextResponse.json(
      { exists },
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