import { NextRequest, NextResponse } from "next/server";
import { checkUserExists, getUser, getAllUsers } from "@/lib/mongodbUtils";

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

export async function POST(request: NextRequest) {
  try {
    const { userIds } = await request.json();

    if (!userIds || !Array.isArray(userIds)) {
      return NextResponse.json(
        { error: "userIds array is required" },
        { status: 400 }
      );
    }

    // Fetch all users at once for better performance
    const allUsers = await getAllUsers();
    const userMap = new Map(allUsers.map(user => [user.email, user]));
    
    // Filter to only requested users
    const requestedUsers = userIds
      .map(id => userMap.get(id))
      .filter(user => user !== undefined);

    return NextResponse.json(
      { users: requestedUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}