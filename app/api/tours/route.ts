import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Tour from '@/models/Tour';

// Helper to connect to DB
const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        console.log('[MongoDB] Already connected, readyState:', mongoose.connections[0].readyState);
        return;
    }

    if (!process.env.MONGODB_URI) {
        console.error('[MongoDB] MONGODB_URI is not defined!');
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }

    console.log('[MongoDB] Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[MongoDB] Connected successfully!');
};

export async function GET(req: Request) {
    console.log('[API/GET] Fetching all tours...');
    try {
        await connectDB();

        // Get vendorId and admin flag from URL query params
        const { searchParams } = new URL(req.url);
        const vendorId = searchParams.get('vendorId');
        const admin = searchParams.get('admin');
        const status = searchParams.get('status');

        // Build query
        const query: any = {};
        if (vendorId) {
            // Vendor dashboard: show all their items
            query.vendorId = vendorId;
        } else if (admin === 'true') {
            // Admin dashboard: show all items, optionally filtered by status
            if (status) query.status = status;
        } else {
            // Public frontend: only show approved items
            query.status = 'approved';
        }

        const tours = await Tour.find(query).sort({ createdAt: -1 });
        console.log(`[API/GET] Found ${tours.length} tours in database`);

        // Map _id to id for frontend compatibility
        const toursWithId = tours.map(tour => ({
            ...tour.toObject(),
            id: tour._id.toString(),
        }));

        console.log('[API/GET] Returning tours with id field mapped');
        return NextResponse.json({ success: true, data: toursWithId });
    } catch (error) {
        console.error('[API/GET] Failed to fetch tours:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch tours' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    console.log('[API/POST] Tour creation request received');
    try {
        await connectDB();
        const body = await req.json();

        console.log('[API/POST] Received tour data:');
        console.log(JSON.stringify(body, null, 2));
        console.log('[API/POST] Meals data:', body.meals);

        // Validate required fields
        if (!body.title || !body.location || !body.price) {
            console.error('[API/POST] Validation failed!');
            console.error('[API/POST] Missing - Title:', !body.title, 'Location:', !body.location, 'Price:', !body.price);
            return NextResponse.json(
                { success: false, error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        console.log('[API/POST] Validation passed, creating tour in MongoDB...');

        // Ensure vendorId is provided for vendor creations
        // If there is a vendorId, it means a vendor created it, so auto-set status to 'pending'
        const tourData = {
            ...body,
            status: body.vendorId ? 'pending' : 'approved'
        };

        const tour = await Tour.create(tourData);
        console.log('[API/POST] ✓ Tour created successfully with _id:', tour._id);

        // Return with id field
        const tourWithId = {
            ...tour.toObject(),
            id: tour._id.toString(),
        };

        console.log('[API/POST] ✓ Returning tour with id field:', tourWithId.id);
        return NextResponse.json({ success: true, data: tourWithId }, { status: 201 });
    } catch (error: any) {
        console.error('[API/POST] ✗ Error creating tour:');
        console.error(error);
        console.error('[API/POST] Error message:', error.message);
        if (error.stack) console.error('[API/POST] Error stack:', error.stack);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create tour'
        }, { status: 500 });
    }
}


