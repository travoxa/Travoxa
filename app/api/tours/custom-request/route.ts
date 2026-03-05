
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CustomTourRequest from "@/lib/models/CustomTourRequest";
import { authenticateRequest } from "@/lib/authUtils";
import User from "@/lib/models/User";

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate Request
        const authUser = await authenticateRequest(req);

        if (!authUser) {
            return NextResponse.json(
                { message: "Unauthorized. Please login to submit a request." },
                { status: 401 }
            );
        }

        // 2. Parse Body
        const body = await req.json();
        const {
            destination,
            duration,
            groupSize,
            tripType,
            budget,
            startDate,
            departurePlace,
            pickupLocation,
            dropLocation,
            accommodationPreference,
            mealPlan,
            additionalNotes,
            userDetails,
        } = body;

        // 3. Validation
        if (!destination || !duration || !groupSize || !tripType || !budget || !departurePlace) {
            return NextResponse.json(
                { message: "Missing required fields." },
                { status: 400 }
            );
        }

        if (!userDetails?.name || !userDetails?.email || !userDetails?.phone) {
            return NextResponse.json(
                { message: "Contact details (name, email, phone) are required." },
                { status: 400 }
            );
        }

        // 4. Connect to DB
        await connectDB();

        // 5. Ensure User exists in our DB (in case of sync issues)
        // We look up by email first to avoid CastError if authUser.id is a Firebase UID string.
        let dbUser = await User.findOne({ email: authUser.email });

        if (!dbUser) {
            return NextResponse.json({ message: "User profile not found." }, { status: 404 });
        }

        // 6. Create Request
        const newRequest = await CustomTourRequest.create({
            userId: dbUser._id,
            destination,
            duration,
            groupSize,
            tripType,
            budget,
            startDate,
            departurePlace,
            pickupLocation,
            dropLocation,
            accommodationPreference,
            mealPlan,
            additionalNotes,
            userDetails: {
                name: userDetails.name,
                email: userDetails.email,
                phone: userDetails.phone,
            },
            status: "pending",
        });

        return NextResponse.json(
            { message: "Request submitted successfully!", requestId: newRequest._id },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating custom tour request:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const authUser = await authenticateRequest(req);

        if (!authUser) {
            return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        let query = {};
        if (userId) {
            query = { userId };
        }

        // Populate userId to get name, email
        const requests = await CustomTourRequest.find(query)
            .populate('userId', 'name email phone')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: requests });

    } catch (error: any) {
        console.error("Error fetching custom requests:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
