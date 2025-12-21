import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BackpackerGroup, { type IBackpackerGroup } from "@/lib/models/BackpackerGroup";
import { getUser } from "@/lib/mongodbUtils";

/**
 * Helper function to fetch user details and construct host profile
 */
async function createHostProfile(creatorId: string): Promise<any> {
  try {
    const user = await getUser(creatorId);
    if (!user) {
      throw new Error(`User not found for creatorId: ${creatorId}`);
    }
    
    const actualUserName = user?.name || creatorId;
    
    return {
      id: creatorId,
      name: actualUserName,
      handle: `@${actualUserName.toLowerCase().replace(/\s+/g, "")}`,
      verificationLevel: "Pending verification",
      pastTripsHosted: 0,
      testimonials: [],
      bio: "Host will update their bio soon.",
      avatarColor: "#34d399",
    };
  } catch (error) {
    console.error("Failed to create host profile:", error);
    // Return a fallback host profile if user fetch fails
    return {
      id: creatorId,
      // name: actualUserName,
      // handle: `@${actualUserName.toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "")}`,
      verificationLevel: "Pending verification",
      pastTripsHosted: 0,
      testimonials: [],
      bio: "Host will update their bio soon.",
      avatarColor: "#34d399",
    };
  }
}

/**
 * GET /api/backpackers/group/[id]
 * Fetch a single backpacker group by its MongoDB ObjectId
 */
export async function GET(
  request: Request,
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

    // Connect to MongoDB
    await connectDB();

    // Fetch group from MongoDB by ObjectId
    const mongoGroup = await BackpackerGroup.findById(id);
    
    if (!mongoGroup) {
      return NextResponse.json(
        { error: "Group not found" },
        { status: 404 }
      );
    }

    // Convert MongoDB document to the expected format
    const group = {
      id: mongoGroup._id.toString(),
      groupName: mongoGroup.groupName,
      destination: mongoGroup.destination,
      startDate: mongoGroup.startDate,
      endDate: mongoGroup.endDate,
      duration: mongoGroup.duration,
      maxMembers: mongoGroup.maxMembers,
      avgBudget: mongoGroup.avgBudget,
      currentMembers: mongoGroup.currentMembers,
      budgetRange: mongoGroup.budgetRange,
      pickupLocation: mongoGroup.pickupLocation,
      accommodationType: mongoGroup.accommodationType,
      approvalCriteria: mongoGroup.approvalCriteria,
      plan: {
        overview: mongoGroup.plan.overview,
        itinerary: mongoGroup.plan.itinerary,
        activities: mongoGroup.plan.activities,
        estimatedCosts: Object.fromEntries(mongoGroup.plan.estimatedCosts),
      },
      tripType: mongoGroup.tripType,
      documentsRequired: mongoGroup.documentsRequired,
      creatorId: mongoGroup.creatorId,
      coverImage: mongoGroup.coverImage,
      members: mongoGroup.members,
      hostProfile: await createHostProfile(mongoGroup.creatorId),
      badges: mongoGroup.badges,
      comments: mongoGroup.comments.map((comment: any) => ({
        id: comment.id,
        groupId: mongoGroup._id.toString(),
        authorId: comment.authorId,
        authorName: comment.authorName,
        avatarColor: comment.avatarColor,
        text: comment.text,
        createdAt: comment.createdAt.toISOString(),
        likes: comment.likes,
        roleLabel: comment.roleLabel || "Explorer",
      })),
    };

    return NextResponse.json({ group });
  } catch (error) {
    console.error("Failed to fetch group", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}