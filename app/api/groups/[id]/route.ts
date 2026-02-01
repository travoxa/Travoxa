import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BackpackerGroup from "@/lib/models/BackpackerGroup";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
// Note: You might need to import your authOptions if you have them, 
// for now using generic session check or assuming public/admin separation via logic

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const group = await BackpackerGroup.findById(id);

        if (!group) {
            return NextResponse.json(
                { error: "Group not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ group });
    } catch (error) {
        console.error("Failed to fetch group", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const { id } = await params;
        await connectDB();

        // In a real app, verify admin session here
        // const session = await getServerSession(authOptions);
        // if (!session || !isAdmin(session)) ...

        const updatedGroup = await BackpackerGroup.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!updatedGroup) {
            return NextResponse.json(
                { error: "Group not found" },
                { status: 404 }
            );
        }

        // Send notification if verifying
        if (body.verified === true) {
            try {
                // Find user by email (creatorId is email)
                await User.findOneAndUpdate(
                    { email: updatedGroup.creatorId },
                    {
                        $push: {
                            notifications: {
                                senderId: "system", // Or admin ID if available
                                message: `Your crew "${updatedGroup.groupName}" has been verified and published!`,
                                seen: false,
                                createdAt: new Date(),
                            },
                        },
                    }
                );
            } catch (notifyError) {
                console.error("Failed to send notification", notifyError);
                // Don't fail the request if notification fails, just log it
            }
        }

        return NextResponse.json({
            group: updatedGroup,
            message: "Group updated successfully",
        });
    } catch (error) {
        console.error("Failed to update group", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const deletedGroup = await BackpackerGroup.findByIdAndDelete(id);

        if (!deletedGroup) {
            return NextResponse.json(
                { error: "Group not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Group deleted successfully",
        });
    } catch (error) {
        console.error("Failed to delete group", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
