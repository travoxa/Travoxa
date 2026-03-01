import { NextRequest, NextResponse } from "next/server";
import { checkUserExists, updateUser } from "@/lib/mongodbUtils";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Require business specifics
        const {
            email,
            businessName,
            businessType,
            address,
            taxId
        } = body;

        if (!email || !businessName || !businessType || !address) {
            return NextResponse.json(
                { error: "Missing required fields: email, businessName, businessType, and address are required" },
                { status: 400 }
            );
        }

        const vendorDetails = {
            businessName,
            businessType,
            address,
            taxId: taxId || ""
        };

        const exists = await checkUserExists(email);

        if (exists) {
            // Update existing user to include vendor details and set profile status
            await updateUser(email, {
                vendorDetails,
                profileComplete: true
            });
            return NextResponse.json(
                { message: "Vendor profile saved successfully" },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { error: "Vendor user does not exist in the database. Please sign up first." },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error in vendor onboarding API:", error);
        return NextResponse.json(
            { error: "Failed to save vendor profile", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
