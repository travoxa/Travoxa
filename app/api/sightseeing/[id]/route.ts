import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Sightseeing from '@/models/Sightseeing';
import Tour from '@/models/Tour';
import Activity from '@/models/Activity';
import Rental from '@/models/Rental';
import Stay from '@/models/Stay';
import Food from '@/models/Food';
import Attraction from '@/models/Attraction';

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
        Tour.find().limit(1); Sightseeing.find().limit(1); Activity.find().limit(1); Rental.find().limit(1); Stay.find().limit(1); Food.find().limit(1); Attraction.find().limit(1);

        let pkg = null;

        // Try finding by slug first
        pkg = await Sightseeing.findOneAndUpdate(
            { slug: id },
            { $inc: { views: 1 } },
            { new: true }
        )
            .populate('relatedTours', 'title image _id googleRating rating location city state slug')
            .populate('relatedSightseeing', 'title image _id rating location city state slug')
            .populate('relatedActivities', 'title image _id rating location city state slug')
            .populate('relatedRentals', 'title name image _id rating location city state slug')
            .populate('relatedStays', 'title name image _id rating location city state slug')
            .populate('relatedFood', 'name image _id rating location city state cuisine slug')
            .populate('relatedAttractions', 'title image _id rating location city state type category slug');

        // If not found, try by ID if it's a valid ObjectId
        if (!pkg && id.match(/^[0-9a-fA-F]{24}$/)) {
            pkg = await Sightseeing.findByIdAndUpdate(
                id,
                { $inc: { views: 1 } },
                { new: true }
            )
                .populate('relatedTours', 'title image _id googleRating rating location city state slug')
                .populate('relatedSightseeing', 'title image _id rating location city state slug')
                .populate('relatedActivities', 'title image _id rating location city state slug')
                .populate('relatedRentals', 'title name image _id rating location city state slug')
                .populate('relatedStays', 'title name image _id rating location city state slug')
                .populate('relatedFood', 'name image _id rating location city state cuisine slug')
                .populate('relatedAttractions', 'title image _id rating location city state type category slug');
        }

        if (!pkg) {
            return NextResponse.json(
                { success: false, error: 'Sightseeing package not found' },
                { status: 404 }
            );
        }

        const packageWithId = {
            ...JSON.parse(JSON.stringify(pkg)),
            id: pkg._id.toString(),
        };

        return NextResponse.json({ success: true, data: packageWithId });
    } catch (error: any) {
        console.error('Error fetching sightseeing package:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch sightseeing package'
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
