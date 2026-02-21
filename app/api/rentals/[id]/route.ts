import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Rental from '@/models/Rental';

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

        const rental = await Rental.findById(id);

        if (!rental) {
            return NextResponse.json(
                { success: false, error: 'Rental not found' },
                { status: 404 }
            );
        }

        const rentalWithId = {
            ...rental.toObject(),
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
