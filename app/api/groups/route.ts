import { NextResponse } from "next/server";

import { createBackpackerGroup, listGroups, type CreateGroupPayload } from "@/data/backpackers";

export async function GET() {
  const groups = listGroups();
  return NextResponse.json({ groups });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<CreateGroupPayload>;

    if (!payload.groupName || !payload.destination || !payload.startDate || !payload.endDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newGroup = createBackpackerGroup({
      groupName: payload.groupName,
      destination: payload.destination,
      startDate: payload.startDate,
      endDate: payload.endDate,
      maxMembers: payload.maxMembers ?? 10,
      budgetRange: payload.budgetRange ?? "₹20k - ₹40k",
      pickupLocation: payload.pickupLocation ?? "To be decided",
      accommodationType: payload.accommodationType ?? "Hostels",
      minAge: payload.minAge ?? 18,
      genderPreference: payload.genderPreference ?? "any",
      trekkingExperience: payload.trekkingExperience ?? "beginner",
      mandatoryRules: payload.mandatoryRules ?? ["Travel responsibly"],
      planOverview: payload.planOverview ?? "Host will update the plan soon",
      itinerary: payload.itinerary ?? ["Day 1: Welcome and orientation"],
      activities: payload.activities ?? ["Icebreaker session"],
      estimatedCosts: payload.estimatedCosts ?? { stay: 10000 },
      tripType: payload.tripType ?? "open",
      creatorId: payload.creatorId,
    });

    return NextResponse.json({ group: newGroup }, { status: 201 });
  } catch (error) {
    console.error("Failed to create group", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
