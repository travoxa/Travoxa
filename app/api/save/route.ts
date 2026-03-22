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
        const { itemId, itemType, title, itemLink, email } = await req.json();
        const user = await authenticateRequest(req);

        // Use provided email (mobile) or session email (web)
        const userEmail = email || user?.email;

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log('[API SAVE] Received:', { itemId, itemType, title, itemLink, userEmail });

        if (!itemId || !itemType) {
            return NextResponse.json({ error: "Missing itemId or itemType" }, { status: 400 });
        }

        await connectDB();

        // Check if already saved
        const existing = await SavedItem.findOne({
            userId: userEmail,
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
                userId: userEmail,
                itemId,
                itemType,
                title,
                itemLink,
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
        const { searchParams } = new URL(req.url);
        const emailParam = searchParams.get("email");
        const user = await authenticateRequest(req);

        const userEmail = emailParam || user?.email;

        if (!userEmail) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const itemId = searchParams.get("itemId");
        const itemType = searchParams.get("itemType");

        await connectDB();

        if (itemId && itemType) {
            // Check if specific item is saved
            const existing = await SavedItem.findOne({
                userId: userEmail,
                itemId,
                itemType,
            });
            return NextResponse.json({ saved: !!existing });
        }

        // Fetch all saved items
        const savedItems = await SavedItem.find({ userId: userEmail }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: savedItems });
    } catch (error: any) {
        console.error("Fetch saved items error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
