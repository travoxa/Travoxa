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

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const vendorId = searchParams.get('vendorId');
        const admin = searchParams.get('admin');
        const statusParam = searchParams.get('status');

        const query: any = {};
        if (vendorId) {
            query.vendorId = vendorId;
        } else if (admin === 'true') {
            if (statusParam) query.status = statusParam;
        } else {
            query.status = 'approved';
        }

        // 1. Try direct DB query
        let tours = await Tour.find(query).sort({ createdAt: -1 });

        // 2. SELF-HEALING & FALLBACK
        // If direct query fails for public page, but documents actually exist
        if (tours.length === 0 && !vendorId && admin !== 'true') {
            const allTours = await Tour.find({}).sort({ createdAt: -1 });
            const approvedTours = allTours.filter(t => t.status === 'approved');

            if (approvedTours.length > 0) {
                console.log(`[API/GET] ! Direct query failed but found ${approvedTours.length} approved tours via fallback.`);
                tours = approvedTours;

                // Attempt to "Self-Heal" by re-saving the documents
                // This is done asynchronously to not block the request
                allTours.forEach(async (t) => {
                    try {
                        await Tour.findByIdAndUpdate(t._id, { status: t.status });
                    } catch (e) {
                        // Ignore errors during healing
                    }
                });
            }
        }

        // Map _id to id for frontend compatibility
        const toursWithId = tours.map(tour => {
            const tourObj = (tour as any).toObject ? (tour as any).toObject() : tour;
            return {
                ...tourObj,
                id: (tourObj._id || tourObj.id).toString(),
            };
        });

        return NextResponse.json({ success: true, data: toursWithId });
    } catch (error) {
        console.error('[API/GET] Failed to fetch tours:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch tours' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        if (!body.title || !body.location || !body.price) {
            return NextResponse.json(
                { success: false, error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        const tourData = {
            ...body,
            status: body.vendorId ? 'pending' : 'approved'
        };

        const tour = await Tour.create(tourData);

        const tourWithId = {
            ...tour.toObject(),
            id: tour._id.toString(),
        };

        return NextResponse.json({ success: true, data: tourWithId }, { status: 201 });
    } catch (error: any) {
        console.error('[API/POST] Error creating tour:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create tour'
        }, { status: 500 });
    }
}
