import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import BackpackerGroup from "@/lib/models/BackpackerGroup";
import TourRequest from "@/models/TourRequest";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Fetch User Profile
    const dbUser = await User.findOne({ email }).lean();
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = dbUser._id.toString();

    // 2. Fetch Backpacker Groups (Created, Joined, or Requested)
    const allUserGroups = await BackpackerGroup.find({
      $or: [
        { creatorId: userId },
        { creatorId: email },
        { "members.id": userId },
        { "requests": { $elemMatch: { userId: userId, status: "pending" } } }
      ]
    })
      .sort({ createdAt: -1 })
      .lean();

    // Serialize groups with relationship status
    const formattedGroups = allUserGroups.map((group: any) => {
      let status = 'member';
      const isCreator = group.creatorId === userId || group.creatorId === email;
      const isMember = group.members.some((m: any) => m.id === userId);
      const hasPendingRequest = group.requests?.some((r: any) => r.userId === userId && r.status === 'pending');

      if (isCreator) {
        status = 'created';
      } else if (isMember) {
        status = 'joined';
      } else if (hasPendingRequest) {
        status = 'requested';
      }

      return {
        id: group._id.toString(),
        groupName: group.groupName,
        destination: group.destination,
        startDate: group.startDate,
        endDate: group.endDate,
        coverImage: group.coverImage,
        verified: group.verified,
        tripType: group.tripType,
        currentMembers: group.currentMembers,
        maxMembers: group.maxMembers,
        userStatus: status,
        pendingRequestCount: isCreator ? (group.requests?.filter((r: any) => r.status === 'pending').length || 0) : 0,
      };
    });

    // 3. Fetch Tour Requests
    const tourRequests = await TourRequest.find({ userId: userId }).sort({ createdAt: -1 }).lean();
    
    const formattedTourRequests = tourRequests.map((req: any) => ({
      id: req._id.toString(),
      tourId: req.tourId.toString(),
      title: req.title,
      status: req.status,
      members: req.members,
      date: req.date,
      createdAt: req.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      userData: {
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        city: dbUser.city,
        profileComplete: dbUser.profileComplete,
        interests: dbUser.interests || [],
        gender: dbUser.gender,
        bio: dbUser.bio,
        travelExperience: dbUser.travelExperience,
      },
      createdGroups: formattedGroups,
      tourRequests: formattedTourRequests
    });

  } catch (error) {
    console.error("Error in dashboard API:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
