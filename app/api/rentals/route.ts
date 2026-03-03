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

        // 1. Try direct DB query
        let rentals = await Rental.find(query).sort({ createdAt: -1 });

        // 2. SELF-HEALING & FALLBACK
        // If direct query fails for public page, but documents actually exist
        if (rentals.length === 0 && !vendorId && admin !== 'true') {
            const allRentalsRaw = await Rental.find({}).sort({ createdAt: -1 });
            const approvedRentals = allRentalsRaw.filter(rental => rental.status === 'approved');

            if (approvedRentals.length > 0) {
                console.log(`[API/RENTALS] ! Direct query failed but found ${approvedRentals.length} approved items via fallback.`);
                rentals = approvedRentals;

                // Attempt to "Self-Heal" by re-saving
                allRentalsRaw.forEach(async (rental) => {
                    try {
                        await Rental.findByIdAndUpdate(rental._id, { status: rental.status });
                    } catch (e) {
                        // Ignore errors during healing
                    }
                });
            }
        }

        // Map MongoDB _id to id for frontend
        const rentalsWithId = rentals.map(rental => {
            const rentalObj = (rental as any).toObject ? (rental as any).toObject() : rental;
            return {
                ...rentalObj,
                id: (rentalObj._id || rentalObj.id).toString(),
            };
        });

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

        const rentalData = await req.json();

        if (rentalData.vendorId) {
            rentalData.status = 'pending';
        }

        // Validate required fields
        if (!rentalData.name || !rentalData.type || !rentalData.price || !rentalData.state || !rentalData.city || !rentalData.whatsapp) {
            return NextResponse.json(
                { success: false, error: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        // Set location from state and city for backward compatibility
        rentalData.location = `${rentalData.city}, ${rentalData.state}`;

        const newRental = await Rental.create(rentalData);

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
