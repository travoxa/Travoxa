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

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const vendorId = searchParams.get('vendorId');
        const admin = searchParams.get('admin');
        const status = searchParams.get('status');

        const query: any = {};
        if (vendorId) {
            query.vendorId = vendorId;
        } else if (admin === 'true') {
            if (status) query.status = status;
        } else {
            query.status = 'approved';
        }

        const packages = await Sightseeing.find(query).sort({ createdAt: -1 });

        // Map _id to id for frontend compatibility
        const packagesWithId = packages.map(pkg => ({
            ...pkg.toObject(),
            id: pkg._id.toString(),
        }));

        return NextResponse.json({ success: true, data: packagesWithId });
    } catch (error) {
        console.error('Failed to fetch sightseeing packages:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch sightseeing packages' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const sightseeingData = await req.json();

        // Auto-set pending if created by vendor
        if (sightseeingData.vendorId) {
            sightseeingData.status = 'pending';
        }

        // Validate required fields
        if (!sightseeingData.title || !sightseeingData.city || !sightseeingData.state || !sightseeingData.price) {
            return NextResponse.json(
                { success: false, error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        const sightseeingPackage = await Sightseeing.create(sightseeingData);

        // Return with id field
        const packageWithId = {
            ...sightseeingPackage.toObject(),
            id: sightseeingPackage._id.toString(),
        };

        return NextResponse.json({ success: true, data: packageWithId }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating sightseeing package:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create sightseeing package'
        }, { status: 500 });
    }
}
