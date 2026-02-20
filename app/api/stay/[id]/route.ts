import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Stay from '@/models/Stay';

// Helper to connect to DB
const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    await mongoose.connect(process.env.MONGODB_URI);
};

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await connectDB();

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Stay ID is required' },
                { status: 400 }
            );
        }

        const stay = await Stay.findById(id);

        if (!stay) {
            return NextResponse.json(
                { success: false, error: 'Stay not found' },
                { status: 404 }
            );
        }

        const stayWithId = {
            ...stay.toObject(),
            id: stay._id.toString(),
        };

        return NextResponse.json({ success: true, data: stayWithId });
    } catch (error: any) {
        console.error('Error fetching stay details:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch stay details'
        }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await connectDB();

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Stay ID is required' },
                { status: 400 }
            );
        }

        const body = await req.json();

        const updatedStay = await Stay.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedStay) {
            return NextResponse.json(
                { success: false, error: 'Stay not found' },
                { status: 404 }
            );
        }

        const stayWithId = {
            ...updatedStay.toObject(),
            id: updatedStay._id.toString(),
        };

        return NextResponse.json({ success: true, data: stayWithId });
    } catch (error: any) {
        console.error('Error updating stay:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to update stay'
        }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await connectDB();

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Stay ID is required' },
                { status: 400 }
            );
        }

        const result = await Stay.findByIdAndDelete(id);

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Stay not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Stay deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting stay:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to delete stay'
        }, { status: 500 });
    }
}
