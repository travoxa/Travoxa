import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Sightseeing from '@/models/Sightseeing';

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

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        await connectDB();

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Sightseeing package ID is required' },
                { status: 400 }
            );
        }

        const body = await req.json();

        // Validate required fields
        if (!body.title || !body.city || !body.state || !body.price) {
            return NextResponse.json(
                { success: false, error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        const updatedPackage = await Sightseeing.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedPackage) {
            return NextResponse.json(
                { success: false, error: 'Sightseeing package not found' },
                { status: 404 }
            );
        }

        const packageWithId = {
            ...updatedPackage.toObject(),
            id: updatedPackage._id.toString(),
        };

        return NextResponse.json({ success: true, data: packageWithId });
    } catch (error: any) {
        console.error('Error updating sightseeing package:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to update sightseeing package'
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
                { success: false, error: 'Sightseeing package ID is required' },
                { status: 400 }
            );
        }

        const result = await Sightseeing.findByIdAndDelete(id);

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Sightseeing package not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Sightseeing package deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting sightseeing package:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to delete sightseeing package'
        }, { status: 500 });
    }
}
