import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import BackpackerGroup from "@/lib/models/BackpackerGroup";
import TourRequest from "@/models/TourRequest";
import SavedItem from "@/lib/models/SavedItem";
import Trip from "@/lib/models/Trip";

/**
 * DELETE /api/users/delete
 * Permanently deletes a user and all related data.
 */
export async function DELETE(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Find the user to get their ID
    const dbUser = await User.findOne({ email });
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = dbUser._id;
    const userIdString = userId.toString();

    // 2. Delete Saved Items (using email as userId according to SavedItem model)
    await SavedItem.deleteMany({ userId: email });

    // 3. Delete Tour Requests
    await TourRequest.deleteMany({ userId: userId });

    // 4. Delete Trips
    await Trip.deleteMany({ userId: userId });

    // 5. Cleanup Backpacker Groups
    // A. Delete groups created by this user
    await BackpackerGroup.deleteMany({ 
      $or: [
        { creatorId: userIdString },
        { creatorId: email } // Some legacy records might use email
      ] 
    });

    // B. Remove user from other groups (members, requests, comments)
    await BackpackerGroup.updateMany(
      {},
      {
        $pull: {
          members: { id: userIdString },
          requests: { userId: userIdString },
          comments: { authorId: userIdString }
        }
      }
    );

    // 6. Delete User Profile
    await User.deleteOne({ _id: userId });

    return NextResponse.json({
      success: true,
      message: "User and all related data deleted successfully"
    });

  } catch (error) {
    console.error("Error in user deletion API:", error);
    return NextResponse.json(
      { error: "Failed to delete user data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
