import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BackpackerGroup from "@/lib/models/BackpackerGroup";
import { authenticateRequest } from "@/lib/authUtils";
import User from "@/lib/models/User";

/**
 * POST /api/backpackers/group/[id]/requests/[requestId]/reject
 * Reject a join request
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; requestId: string }> }
) {
    try {
        const { id, requestId } = await params;

        if (!id || !requestId) {
            return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
        }

        const user = await authenticateRequest(request);
        if (!user) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 });
        }

        await connectDB();
        const group = await BackpackerGroup.findById(id);

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        // Check authorization
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
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        const joinRequest = group.requests.id(requestId);

        if (!joinRequest) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        if (joinRequest.status !== "pending") {
            return NextResponse.json({ error: `Request is already ${joinRequest.status}` }, { status: 400 });
        }

        joinRequest.status = "rejected";
        await group.save();

        // Send notification to the user
        try {
            let requesterUser = await User.findById(joinRequest.userId);
            if (!requesterUser) {
                requesterUser = await User.findOne({ email: joinRequest.userId });
            }

            if (requesterUser) {
                requesterUser.notifications.push({
                    senderId: user.id,
                    message: `Sorry, your request to join "${group.groupName}" was not accepted.`,
                    seen: false,
                    createdAt: new Date(),
                });
                await requesterUser.save();
            }
        } catch (error) {
            console.error("Failed to send notification:", error);
        }

        return NextResponse.json({ message: "Request rejected" });

    } catch (error) {
        console.error("Error rejecting request:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
