import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BackpackerGroup from "@/lib/models/BackpackerGroup";
import { authenticateRequest, AuthenticatedUser } from "@/lib/authUtils";

/**
 * POST /api/backpackers/group/[id]/join
 * Handle join requests for a backpacker group
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: "Invalid group ID format" },
        { status: 400 }
      );
    }

    // Authenticate the user
    const user = await authenticateRequest(request);
    if (!user || !user.id) {
      console.error('❌ Authentication failed:', { user, hasId: !!user?.id });
      return NextResponse.json(
        { error: "Authentication required - invalid user" },
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', { userId: user.id, email: user.email });

    // Parse request body
    const body = await request.json();
    const { note } = body;

    console.log('📝 Request body parsed:', { note });

    // Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected');

    // Resolve the correct User ID (MongoDB _id) to ensure consistency
    let mongoUserId = user.id;
    let mongoUserName = user.name;

    try {
      // Import dynamically to avoid circular deps if any
      const { getUser } = await import("@/lib/mongodbUtils");
      const dbUser = await getUser(user.email);
      if (dbUser) {
        mongoUserId = dbUser._id.toString();
        mongoUserName = dbUser.name;
        console.log('✅ Resolved MongoDB User ID:', mongoUserId);
      }
    } catch (e) {
      console.warn('⚠️ Could not resolve MongoDB user, using token ID:', e);
    }

    // Fetch the group
    const group = await BackpackerGroup.findById(id);
    if (!group) {
      console.error('❌ Group not found:', id);
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const isAlreadyMember = group.members.some((member: any) => member.id === mongoUserId);
    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "You are already a member of this group" },
        { status: 400 }
      );
    }

    // Check if user already has a pending request
    const existingRequest = group.requests?.find(
      (request: any) => request.userId === mongoUserId && request.status === "pending"
    );
    if (existingRequest) {
      return NextResponse.json(
        { error: "You have already requested to join this group" },
        { status: 400 }
      );
    }

    // Check if group is full
    if (group.currentMembers >= group.maxMembers) {
      return NextResponse.json(
        { error: "Group is full" },
        { status: 400 }
      );
    }

    // Create new join request
    const newRequest = {
      id: `req_${Date.now().toString(36)}`,
      userId: mongoUserId,
      status: "pending" as const,
      createdAt: new Date(),
      note: note || undefined,
    };

    // Use MongoDB's $push operator to add the request
    const updatedGroup = await BackpackerGroup.findByIdAndUpdate(
      id,
      { $push: { requests: newRequest } },
      { new: true, runValidators: true }
    );

    if (!updatedGroup) {
      return NextResponse.json(
        { error: "Failed to save join request to database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Join request submitted successfully",
      request: {
        id: newRequest.id,
        userId: newRequest.userId,
        status: newRequest.status,
        createdAt: newRequest.createdAt.toISOString(),
        note: newRequest.note,
      }
    });

  } catch (error) {
    console.error("❌ Failed to submit join request", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/backpackers/group/[id]/join
 * Get join requests for a group (for hosts only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validate ObjectId format
    if (!id || id.length !== 24) {
      return NextResponse.json(
        { error: "Invalid group ID format" },
        { status: 400 }
      );
    }

    // Authenticate the user
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    await connectDB();

    // Resolve MongoDB User ID for permission check
    let mongoUserId = user.id;
    try {
      const { getUser } = await import("@/lib/mongodbUtils");
      const dbUser = await getUser(user.email);
      if (dbUser) {
        mongoUserId = dbUser._id.toString();
      }
    } catch (e) {
      console.warn('⚠️ Could not resolve MongoDB user in GET requests:', e);
    }

    // Fetch the group
    const group = await BackpackerGroup.findById(id);
    if (!group) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    // Check if user is the host or co-host
    // We check against BOTH the token ID and the resolved Mongo ID to be safe
    const isHost = group.members.some(
      (member: any) => (member.id === user.id || member.id === mongoUserId) && (member.role === "host" || member.role === "co-host")
    );

    if (!isHost) {
      return NextResponse.json(
        { error: "Access denied. Only hosts can view join requests" },
        { status: 403 }
      );
    }

    // Return join requests with user details
    const requests = await Promise.all(
      (group.requests || []).map(async (request: any) => {
        // Get user details for each request
        let userName = request.userId;
        try {
          const { getUser } = await import("@/lib/mongodbUtils");
          const userData = await getUser(request.userId);
          if (userData && userData.name) {
            userName = userData.name;
          }
        } catch (error) {
          console.error("Failed to fetch user data for request:", error);
        }

        return {
          id: request.id,
          userId: request.userId,
          userName,
          status: request.status,
          createdAt: request.createdAt.toISOString(),
          note: request.note,
        };
      })
    );

    return NextResponse.json({ requests });

  } catch (error) {
    console.error("Failed to fetch join requests", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}