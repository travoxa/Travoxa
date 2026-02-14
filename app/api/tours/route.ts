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

export async function GET() {
    console.log('[API/GET] Fetching all tours...');
    try {
        await connectDB();
        const tours = await Tour.find({}).sort({ createdAt: -1 });
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
        const tour = await Tour.create(body);
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


