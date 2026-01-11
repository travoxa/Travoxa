
import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/authUtils";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Trip from "@/lib/models/Trip";

export async function POST(req: Request) {
    try {
        // 1. Authenticate Request
        const authUser = await authenticateRequest(req as any);
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { profile } = body;

        if (!profile) {
            return NextResponse.json({ error: "Missing profile data" }, { status: 400 });
        }

        await connectDB();

        // 2. Resolve User ID (Upsert User if missing)
        let user = await User.findOne({ email: authUser.email });

        if (!user) {
            console.log("User not found in MongoDB, creating Just-in-Time user:", authUser.email);
            user = await User.create({
                name: authUser.name,
                email: authUser.email,
                authProvider: "google", // Assumed from NextAuth default
                profileComplete: false
            });
        }

        // 3. Construct Trip Name & Summary
        const origin = profile.origin_city || "Unknown Origin";
        const style = profile.travel_style || "Trip";
        const groupSize = profile.group_size ? `${profile.group_size} People` : profile.companions || "Solo";

        const summary = `${style} from ${origin} (${groupSize})`;
        const name = `${profile.user_name}'s ${style}`;

        // 4. Save Trip
        const newTrip = await Trip.create({
            userId: user._id,
            name: name,
            originCity: origin,
            destinationSummary: summary,
            profile: profile
        });

        return NextResponse.json({ success: true, tripId: newTrip._id });

    } catch (error) {
        console.error("Error saving trip:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const authUser = await authenticateRequest(req as any);
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: authUser.email });

        if (!user) {
            return NextResponse.json({ trips: [] });
        }

        const trips = await Trip.find({ userId: user._id }).sort({ createdAt: -1 });

        return NextResponse.json({ trips });

    } catch (error) {
        console.error("Error fetching trips:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
