import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Tour from '@/models/Tour';

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

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Await params as required by Next.js 15
    const { id } = await params;

    console.log('[API/DELETE] Tour deletion request received for ID:', id);
    try {
        await connectDB();

        if (!id) {
            console.error('[API/DELETE] No ID provided');
            return NextResponse.json(
                { success: false, error: 'Tour ID is required' },
                { status: 400 }
            );
        }

        console.log('[API/DELETE] Attempting to delete tour with id:', id);
        const result = await Tour.findByIdAndDelete(id);

        if (!result) {
            console.error('[API/DELETE] Tour not found with id:', id);
            return NextResponse.json(
                { success: false, error: 'Tour not found' },
                { status: 404 }
            );
        }

        console.log('[API/DELETE] ✓ Tour deleted successfully:', id);
        return NextResponse.json({ success: true, message: 'Tour deleted successfully' });
    } catch (error: any) {
        console.error('[API/DELETE] ✗ Error deleting tour:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to delete tour'
        }, { status: 500 });
    }
}
