import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Journey from "@/models/Journey";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const updateditem = await Journey.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!updateditem) {
            return NextResponse.json(
                { success: false, error: "Item not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, data: updateditem });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to update item" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const deletedItem = await Journey.findByIdAndDelete(id);
        if (!deletedItem) {
            return NextResponse.json(
                { success: false, error: "Item not found" },
                { status: 404 }
            );
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to delete item" },
            { status: 500 }
        );
    }
}
