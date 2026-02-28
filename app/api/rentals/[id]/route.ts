import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Rental from '@/models/Rental';
import Tour from '@/models/Tour';
import Sightseeing from '@/models/Sightseeing';
import Activity from '@/models/Activity';
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

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Rental ID is required' },
                { status: 400 }
            );
        }

        Tour.find().limit(1); Sightseeing.find().limit(1); Activity.find().limit(1); Rental.find().limit(1); Stay.find().limit(1); Food.find().limit(1); Attraction.find().limit(1);

        const rental = await Rental.findById(id)
            .populate('relatedTours', 'title image _id googleRating rating location city state')
            .populate('relatedSightseeing', 'title image _id rating location city state')
            .populate('relatedActivities', 'title image _id rating location city state')
            .populate('relatedRentals', 'title name image _id rating location city state')
            .populate('relatedStays', 'title name image _id rating location city state')
            .populate('relatedFood', 'name image _id rating location city state cuisine')
            .populate('relatedAttractions', 'title image _id rating location city state type category')
            .lean();

        if (!rental) {
            return NextResponse.json(
                { success: false, error: 'Rental not found' },
                { status: 404 }
            );
        }

        const rentalWithId = {
            ...JSON.parse(JSON.stringify(rental)),
            id: rental._id.toString(),
        };

        return NextResponse.json({ success: true, data: rentalWithId });
    } catch (error: any) {
        console.error('Error fetching rental:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch rental'
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
                { success: false, error: 'Rental ID is required' },
                { status: 400 }
            );
        }

        const body = await req.json();

        // Validate required fields
        if (!body.name || !body.type || !body.price || !body.state || !body.city || !body.whatsapp) {
            return NextResponse.json(
                { success: false, error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        // Set location from state and city for backward compatibility
        body.location = `${body.city}, ${body.state}`;

        const updatedRental = await Rental.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true }
        );

        if (!updatedRental) {
            return NextResponse.json(
                { success: false, error: 'Rental not found' },
                { status: 404 }
            );
        }

        const rentalWithId = {
            ...updatedRental.toObject(),
            id: updatedRental._id.toString(),
        };

        return NextResponse.json({ success: true, data: rentalWithId });
    } catch (error: any) {
        console.error('Error updating rental:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to update rental'
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
                { success: false, error: 'Rental ID is required' },
                { status: 400 }
            );
        }

        const result = await Rental.findByIdAndDelete(id);

        if (!result) {
            return NextResponse.json(
                { success: false, error: 'Rental not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Rental deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting rental:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to delete rental'
        }, { status: 500 });
    }
}
