import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { authenticateRequest } from "@/lib/authUtils";
import SavedItem from "@/lib/models/SavedItem";

/**
 * POST /api/save
 * Toggle save status for an item
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

function corsResponse(data: any, status: number = 200) {
    return NextResponse.json(data, {
        status,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST(req: NextRequest) {
    try {
        let body;
        try {
            body = await req.json();
        } catch (e) {
            console.error('[API SAVE POST] Failed to parse body:', e);
            return corsResponse({ error: "Invalid JSON body" }, 400);
        }

        const { itemId, itemType, title, itemLink, email } = body || {};

        console.log('[API SAVE POST] Early Body:', { itemId, itemType, email });

        let userEmail = email;
        if (!userEmail) {
            const user = await authenticateRequest(req);
            userEmail = user?.email;
            console.log('[API SAVE POST] Session User:', userEmail);
        }

        if (!userEmail) {
            console.warn('[API SAVE POST] Unauthorized: No email in body or session');
            return corsResponse({ error: "Unauthorized" }, 401);
        }

        console.log('[API SAVE] Received:', { itemId, itemType, title, itemLink, userEmail });

        if (!itemId || !itemType) {
            return corsResponse({ error: "Missing itemId or itemType" }, 400);
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
            return corsResponse({ saved: false, message: "Item removed from saved" }, 200);
        } else {
            // Save
            await SavedItem.create({
                userId: userEmail,
                itemId,
                itemType,
                title,
                itemLink,
            });
            return corsResponse({ saved: true, message: "Item saved successfully" }, 200);
        }
    } catch (error: any) {
        console.error("Save toggle error:", error);
        return corsResponse({ error: error.message }, 500);
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

        console.log('[API SAVE GET] Params:', {
            itemId: searchParams.get("itemId"),
            itemType: searchParams.get("itemType"),
            emailParam
        });

        let userEmail = emailParam;
        if (!userEmail) {
            const user = await authenticateRequest(req);
            userEmail = user?.email;
            console.log('[API SAVE GET] Session User:', userEmail);
        }

        if (!userEmail) {
            console.warn('[API SAVE GET] Unauthorized: No email in params or session');
            return corsResponse({ error: "Unauthorized" }, 401);
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
            return corsResponse({ saved: !!existing }, 200);
        }

        // Fetch all saved items
        const savedItems = await SavedItem.find({ userId: userEmail }).sort({ createdAt: -1 });
        return corsResponse({ success: true, data: savedItems }, 200);
    } catch (error: any) {
        console.error("Fetch saved items error:", error);
        return corsResponse({ error: error.message }, 500);
    }
}
