
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
            additionalNotes,
        } = body;

        // 3. Validation
        if (!destination || !duration || !groupSize || !tripType || !budget) {
            return NextResponse.json(
                { message: "Missing required fields." },
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
            additionalNotes,
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
