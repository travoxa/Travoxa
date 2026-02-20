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

export async function GET() {
    try {
        await connectDB();
        const stays = await Stay.find({}).sort({ createdAt: -1 });

        // Map _id to id for frontend compatibility
        const staysWithId = stays.map(stay => ({
            ...stay.toObject(),
            id: stay._id.toString(),
        }));

        return NextResponse.json({ success: true, data: staysWithId });
    } catch (error) {
        console.error('Failed to fetch stay packages:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch stay packages' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Validate required fields
        if (!body.title || !body.city || !body.state || !body.price || !body.type || !body.coverImage) {
            return NextResponse.json(
                { success: false, error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        const stay = await Stay.create(body);

        // Return with id field
        const stayWithId = {
            ...stay.toObject(),
            id: stay._id.toString(),
        };

        return NextResponse.json({ success: true, data: stayWithId }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating stay package:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create stay package'
        }, { status: 500 });
    }
}
