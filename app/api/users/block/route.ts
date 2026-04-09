import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function POST(request: Request) {
  try {
    const { userId, targetUserId } = await request.json();

    if (!userId || !targetUserId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (userId === targetUserId) {
      return NextResponse.json({ error: "You cannot block yourself" }, { status: 400 });
    }

    await connectDB();

    // Find the user who is blocking
    // We try to find by id (MongoDB _id) or email (since email is often used as uid in this app)
    let user = await User.findOne({ 
      $or: [{ _id: userId.length === 24 ? userId : null }, { email: userId }] 
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize blockedUserIds if it doesn't exist
    if (!user.blockedUserIds) {
      user.blockedUserIds = [];
    }

    // Check if already blocked
    if (!user.blockedUserIds.includes(targetUserId)) {
      user.blockedUserIds.push(targetUserId);
      await user.save();
    }

    return NextResponse.json({ success: true, message: "User blocked successfully" });

  } catch (error) {
    console.error("Failed to block user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
