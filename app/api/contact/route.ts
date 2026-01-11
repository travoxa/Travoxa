import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SupportTicket from "@/lib/models/SupportTicket";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, email, phone, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, Email, and Message are required." },
                { status: 400 }
            );
        }

        const ticket = await SupportTicket.create({
            name,
            email,
            phone,
            message,
            responded: false, // Explicitly false as requested
        });

        return NextResponse.json(
            { message: "Ticket created successfully", ticket },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating support ticket:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
