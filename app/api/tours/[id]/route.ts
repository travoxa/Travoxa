import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Tour from '@/models/Tour';
import TourRequest from '@/models/TourRequest';
import User from '@/lib/models/User';

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
                { success: false, error: 'Tour ID is required' },
                { status: 400 }
            );
        }

        const body = await req.json();
        console.log('[API/PUT] Received update data for tour:', id);
        console.log('[API/PUT] Meals data:', body.meals);

        // Validate required fields
        if (!body.title || !body.location || !body.price) {
            return NextResponse.json(
                { success: false, error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        const updatedTour = await Tour.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedTour) {
            return NextResponse.json(
                { success: false, error: 'Tour not found' },
                { status: 404 }
            );
        }

        const tourWithId = {
            ...updatedTour.toObject(),
            id: updatedTour._id.toString(),
        };

        return NextResponse.json({ success: true, data: tourWithId });
    } catch (error: any) {
        console.error('Error updating tour:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to update tour'
        }, { status: 500 });
    }
}

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

        // 1. Find all PENDING requests for this tour
        const pendingRequests = await TourRequest.find({
            tourId: id,
            status: 'pending'
        });

        // 2. Reject them and notify users
        const cancellationMessage = `Your tour request has been rejected because the tour package was cancelled/deleted by the admin.`;

        for (const req of pendingRequests) {
            // Update request status
            await TourRequest.findByIdAndUpdate(req._id, {
                status: 'rejected'
            });

            // Send notification to user
            await User.findByIdAndUpdate(req.userId, {
                $push: {
                    notifications: {
                        senderId: 'admin',
                        message: cancellationMessage,
                        seen: false,
                        createdAt: new Date()
                    }
                }
            });
        }

        const result = await Tour.findByIdAndDelete(id);

        if (!result) {
            console.error('[API/DELETE] Tour not found with id:', id);
            return NextResponse.json(
                { success: false, error: 'Tour not found' },
                { status: 404 }
            );
        }

        console.log('[API/DELETE] ✓ Tour deleted successfully:', id);
        return NextResponse.json({ success: true, message: 'Tour deleted successfully. Users notified.' });
    } catch (error: any) {
        console.error('[API/DELETE] ✗ Error deleting tour:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to delete tour'
        }, { status: 500 });
    }
}
