import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { authenticateRequest } from "@/lib/authUtils";
import SavedItem from "@/lib/models/SavedItem";

/**
 * POST /api/save
 * Toggle save status for an item
 */
export async function POST(req: NextRequest) {
    try {
        const user = await authenticateRequest(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { itemId, itemType } = await req.json();

        if (!itemId || !itemType) {
            return NextResponse.json({ error: "Missing itemId or itemType" }, { status: 400 });
        }

        await connectDB();

        // Check if already saved
        const existing = await SavedItem.findOne({
            userId: user.id,
            itemId,
            itemType,
        });

        if (existing) {
            // Unsave
            await SavedItem.deleteOne({ _id: existing._id });
            return NextResponse.json({ saved: false, message: "Item removed from saved" });
        } else {
            // Save
            await SavedItem.create({
                userId: user.id,
                itemId,
                itemType,
            });
            return NextResponse.json({ saved: true, message: "Item saved successfully" });
        }
    } catch (error: any) {
        console.error("Save toggle error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * GET /api/save
 * Fetch saved items for the user or check if a specific item is saved
 */
export async function GET(req: NextRequest) {
    try {
        const user = await authenticateRequest(req);
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get("itemId");
        const itemType = searchParams.get("itemType");

        await connectDB();

        if (itemId && itemType) {
            // Check if specific item is saved
            const existing = await SavedItem.findOne({
                userId: user.id,
                itemId,
                itemType,
            });
            return NextResponse.json({ saved: !!existing });
        }

        // Fetch all saved items
        const savedItems = await SavedItem.find({ userId: user.id }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: savedItems });
    } catch (error: any) {
        console.error("Fetch saved items error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
