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

export async function GET() {
    try {
        await connectDB();

        const rentals = await Rental.find({});

        // Map MongoDB _id to id for frontend
        const rentalsWithId = rentals.map(rental => ({
            ...rental.toObject(),
            id: rental._id.toString(),
        }));

        return NextResponse.json({ success: true, data: rentalsWithId });
    } catch (error: any) {
        console.error('Error fetching rentals:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to fetch rentals'
        }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();

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

        const newRental = await Rental.create(body);

        const rentalWithId = {
            ...newRental.toObject(),
            id: newRental._id.toString(),
        };

        return NextResponse.json({ success: true, data: rentalWithId });
    } catch (error: any) {
        console.error('Error creating rental:', error);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to create rental'
        }, { status: 500 });
    }
}
