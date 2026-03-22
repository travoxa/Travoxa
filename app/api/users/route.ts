import { NextRequest, NextResponse } from "next/server";
import { checkUserExists, createUser, updateUser, getUser } from "@/lib/mongodbUtils";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import BackpackerGroup from "@/lib/models/BackpackerGroup";
import TourRequest from "@/models/TourRequest";
import SavedItem from "@/lib/models/SavedItem";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, phone, gender, interests, hasBike, authProvider, role, vendorDetails, profileComplete, city } = body;

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
      ...(role ? { role } : {}),
      ...(vendorDetails ? { vendorDetails } : {}),
      ...(profileComplete !== undefined ? { profileComplete } : {}),
      ...(city ? { city } : {}),
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
    return NextResponse.json(
      { error: "Failed to save user data", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    const includeDashboard = request.nextUrl.searchParams.get("includeDashboard") === "true";

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
        { exists: false, userData: null },
        { status: 200 }
      );
    }

    const userId = dbUser._id.toString();

    // If dashboard data is not requested, return the simple profile
    if (!includeDashboard) {
      return NextResponse.json({
        exists: true,
        userData: dbUser
      });
    }

    // 2. Fetch Dashboard Data (Groups and Tour Requests)

    // Fetch Backpacker Groups (Created, Joined, or Requested)
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

    // Fetch Tour Requests
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

    // Fetch Saved Items
    const savedItems = await SavedItem.find({ userId: userId }).sort({ createdAt: -1 }).lean();
    const formattedSavedItems = savedItems.map((item: any) => ({
      id: item._id.toString(),
      itemId: item.itemId,
      itemType: item.itemType,
      title: item.title,
      itemLink: item.itemLink,
      createdAt: item.createdAt.toISOString()
    }));

    return NextResponse.json({
      success: true,
      exists: true,
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
      tourRequests: formattedTourRequests,
      savedItems: formattedSavedItems
    });

  } catch (error) {
    console.error("Error in users GET API:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}