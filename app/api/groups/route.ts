import { NextResponse } from "next/server";

import { createBackpackerGroup, listGroups, type CreateGroupPayload } from "@/data/backpackers";
import { checkUserExists, getUser } from "@/lib/mongodbUtils";
import { connectDB } from "@/lib/mongodb";
import BackpackerGroup, { type IBackpackerGroup } from "../../../lib/models/BackpackerGroup";

export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Fetch groups from MongoDB
    const mongoGroups = await BackpackerGroup.find().sort({ createdAt: -1 });
    
    // Convert MongoDB documents to the expected format
    const groups = mongoGroups.map((group: any) => ({
      id: group.id,
      groupName: group.groupName,
      destination: group.destination,
      startDate: group.startDate,
      endDate: group.endDate,
      duration: group.duration,
      maxMembers: group.maxMembers,
      avgBudget: group.avgBudget,
      currentMembers: group.currentMembers,
      budgetRange: group.budgetRange,
      pickupLocation: group.pickupLocation,
      accommodationType: group.accommodationType,
      approvalCriteria: group.approvalCriteria,
      plan: {
        overview: group.plan.overview,
        itinerary: group.plan.itinerary,
        activities: group.plan.activities,
        estimatedCosts: Object.fromEntries(group.plan.estimatedCosts),
      },
      tripType: group.tripType,
      documentsRequired: group.documentsRequired,
      creatorId: group.creatorId,
      coverImage: group.coverImage,
      members: group.members,
      hostProfile: group.hostProfile,
      badges: group.badges,
    }));
    
    return NextResponse.json({ groups });
  } catch (error) {
    console.error("Failed to fetch groups", error);
    return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<CreateGroupPayload>;

    // Validate required fields
    if (!payload.groupName || !payload.destination || !payload.startDate || !payload.endDate) {
      return NextResponse.json({ error: "Missing required fields: Group Name, Destination, Start Date, and End Date are required" }, { status: 400 });
    }

    // Validate user authentication
    if (!payload.creatorId) {
      return NextResponse.json({ error: "User authentication required" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectDB();

    // Validate user exists in database
    const userExists = await checkUserExists(payload.creatorId);
    if (!userExists) {
      return NextResponse.json({ error: "User not found. Please complete your profile first." }, { status: 404 });
    }

    // Get user details for host profile
    const user = await getUser(payload.creatorId);
    if (!user) {
      return NextResponse.json({ error: "Failed to retrieve user information" }, { status: 500 });
    }

    // Calculate duration
    const start = new Date(payload.startDate!);
    const end = new Date(payload.endDate!);
    const duration = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    const totalCost = Object.values(payload.estimatedCosts ?? {}).reduce((sum, value) => sum + value, 0);

    // Generate unique ID
    const id = payload.groupName!
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .concat("-", Date.now().toString(36));

    // Create host member and profile
    const creatorId = payload.creatorId;
    const hostMember = {
      id: creatorId,
      name: creatorId.replace("user_", "").replace(/(^|-)?\w/g, (c) => c.toUpperCase()),
      avatarColor: "#34d399",
      role: "host" as const,
      expertise: "Trip curator",
    };

    const hostProfile = {
      id: creatorId,
      handle: `@${hostMember.name.toLowerCase().replace(/\s+/g, "")}`,
      verificationLevel: "Pending verification",
      pastTripsHosted: 0,
      testimonials: [],
      bio: "Host will update their bio soon.",
      avatarColor: hostMember.avatarColor,
    };

    const defaultBadges = [
      { label: "Community beta", theme: "emerald" },
      { label: `${payload.tripType ?? "trip"} crew`, theme: "sky" },
    ];

    // Create MongoDB document
    const mongoGroup = new BackpackerGroup({
      id,
      groupName: payload.groupName,
      destination: payload.destination,
      startDate: payload.startDate,
      endDate: payload.endDate,
      duration,
      maxMembers: payload.maxMembers ?? 10,
      avgBudget: totalCost,
      currentMembers: 1,
      budgetRange: payload.budgetRange ?? "₹20k - ₹40k",
      pickupLocation: payload.pickupLocation ?? "To be decided",
      accommodationType: payload.accommodationType ?? "Hostels",
      approvalCriteria: {
        minAge: payload.minAge ?? 18,
        genderPreference: payload.genderPreference ?? "any",
        trekkingExperience: payload.trekkingExperience ?? "beginner",
        mandatoryRules: payload.mandatoryRules ?? ["Travel responsibly"],
      },
      plan: {
        overview: payload.planOverview ?? "Host will update the plan soon",
        itinerary: payload.itinerary ?? ["Day 1: Welcome and orientation"],
        activities: payload.activities ?? ["Icebreaker session"],
        estimatedCosts: new Map(Object.entries(payload.estimatedCosts ?? { stay: 10000 })),
      },
      tripType: payload.tripType ?? "open",
      documentsRequired: {
        aadhaar: true,
        passport: false,
        emergencyContact: true,
      },
      creatorId: payload.creatorId,
      coverImage: "/Destinations/Des1.jpeg", // You could randomize this
      members: [hostMember],
      hostProfile,
      badges: defaultBadges,
    });

    // Save to MongoDB
    const savedGroup = await mongoGroup.save();

    // Also add to memory for backward compatibility
    const newGroup = {
      id: savedGroup.id,
      groupName: savedGroup.groupName,
      destination: savedGroup.destination,
      startDate: savedGroup.startDate,
      endDate: savedGroup.endDate,
      duration: savedGroup.duration,
      maxMembers: savedGroup.maxMembers,
      avgBudget: savedGroup.avgBudget,
      currentMembers: savedGroup.currentMembers,
      budgetRange: savedGroup.budgetRange,
      pickupLocation: savedGroup.pickupLocation,
      accommodationType: savedGroup.accommodationType,
      approvalCriteria: savedGroup.approvalCriteria,
      plan: {
        overview: savedGroup.plan.overview,
        itinerary: savedGroup.plan.itinerary,
        activities: savedGroup.plan.activities,
        estimatedCosts: Object.fromEntries(savedGroup.plan.estimatedCosts),
      },
      tripType: savedGroup.tripType,
      documentsRequired: savedGroup.documentsRequired,
      creatorId: savedGroup.creatorId,
      coverImage: savedGroup.coverImage,
      members: savedGroup.members,
      hostProfile: savedGroup.hostProfile,
      badges: savedGroup.badges,
    };

    return NextResponse.json({
      group: newGroup,
      message: "Group created successfully"
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create group", error);
    return NextResponse.json({ error: "Server error. Please try again later." }, { status: 500 });
  }
}
