import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BackpackerGroup from "@/lib/models/BackpackerGroup";

const REPORT_THRESHOLD = 5;

export async function POST(request: Request) {
  try {
    const { groupId, reporterId, reason } = await request.json();

    if (!groupId || !reporterId || !reason) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const group = await BackpackerGroup.findById(groupId);
    if (!group) {
        // Try searching by the slug-like id as well
        const groupById = await BackpackerGroup.findOne({ id: groupId });
        if (!groupById) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }
        
        // Use the found group
        return processReport(groupById, reporterId, reason);
    }

    return processReport(group, reporterId, reason);

  } catch (error) {
    console.error("Failed to report group:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function processReport(group: any, reporterId: string, reason: string) {
  // Check if already reported by this user
  const alreadyReported = group.reports.some((r: any) => r.reporterId === reporterId);
  if (alreadyReported) {
    return NextResponse.json({ message: "Already reported by you" }, { status: 200 });
  }

  // Add report
  group.reports.push({
    reporterId,
    reason,
    createdAt: new Date(),
  });

  group.reportCount = (group.reportCount || 0) + 1;

  // Check threshold
  if (group.reportCount >= REPORT_THRESHOLD) {
    group.isAutoHidden = true;
  }

  await group.save();

  return NextResponse.json({ success: true, message: "Report submitted successfully" });
}
