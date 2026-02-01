import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BackpackerGroup from "@/lib/models/BackpackerGroup";
import { authenticateRequest } from "@/lib/authUtils";
import { getUser } from "@/lib/mongodbUtils";
import User from "@/lib/models/User";

/**
 * POST /api/backpackers/group/[id]/requests/[requestId]/approve
 * Approve a join request
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; requestId: string }> }
) {
    try {
        const { id, requestId } = await params;

        // Validate request
        if (!id || !requestId) {
            return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
        }

        // Authenticate user
        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        await connectDB();
        const group = await BackpackerGroup.findById(id);

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        // Check authorization (must be host or co-host)
        // Resolve MongoDB User ID for permission check to handle token vs db ID mismatch
        let mongoUserId = user.id;
        try {
            const { getUser } = await import("@/lib/mongodbUtils");
            const dbUser = await getUser(user.email);
            if (dbUser) {
                mongoUserId = dbUser._id.toString();
            }
        } catch (e) {
            // ignore
        }

        const isHost = group.members.some(
            (m: any) => (m.id === user.id || m.id === mongoUserId) && (m.role === "host" || m.role === "co-host")
        );

        const isCreator = group.creatorId === user.id || group.creatorId === user.email || (mongoUserId && group.creatorId === mongoUserId);

        if (!isHost && !isCreator) {
            return NextResponse.json({ error: "Not authorized to approve requests" }, { status: 403 });
        }

        // Find the request
        const joinRequest = group.requests.id(requestId);

        if (!joinRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (joinRequest.status !== "pending") {
            return NextResponse.json({ error: `Request is already ${joinRequest.status}` }, { status: 400 });
        }

        // Check capacity
        if (group.currentMembers >= group.maxMembers) {
            return NextResponse.json({ error: "Group is full" }, { status: 400 });
        }

        // Fetch user details to add to members list
        let memberName = joinRequest.userId;
        let memberAvatar = "#c084fc"; // Default color
        try {
            // First try to look up by user ID directly (most common case for IDs)
            const { getUser, getUserById } = await import("@/lib/mongodbUtils");

            let memberUser = null;

            // If the ID looks like a mongo ID, try getUserById
            const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(joinRequest.userId);
            if (isValidObjectId) {
                memberUser = await getUserById(joinRequest.userId);
            }

            // If not found or not mongo ID, try getUser (which searches by email)
            if (!memberUser) {
                memberUser = await getUser(joinRequest.userId);
            }

            if (memberUser) {
                if (memberUser.name) memberName = memberUser.name;
                // You could also fetch avatar color here if you wanted to sync it
            }
        } catch (e) {
            console.error("Failed to fetch user details for new member", e);
        }

        // Add to members
        const newMember = {
            id: joinRequest.userId,
            name: memberName,
            avatarColor: "#c084fc", // Default color
            role: "member",
            expertise: "Explorer", // Default expertise
        };

        group.members.push(newMember);
        group.currentMembers += 1;

        // Update request status
        joinRequest.status = "approved";

        await group.save();

        // Send notification to the user
        try {
            // Try to find user by ID first, then email if that fails
            let requesterUser = await User.findById(joinRequest.userId);
            if (!requesterUser) {
                requesterUser = await User.findOne({ email: joinRequest.userId });
            }

            if (requesterUser) {
                requesterUser.notifications.push({
                    senderId: user.id, // The host who approved it
                    message: `Way to go! Your request to join the crew "${group.groupName}" has been accepted. Pack your bags!`,
                    seen: false,
                    createdAt: new Date(),
                });
                await requesterUser.save();
            }
        } catch (error) {
            console.error("Failed to send notification:", error);
        }

        return NextResponse.json({ message: "Request approved", member: newMember });

    } catch (error) {
        console.error("Error approving request:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
