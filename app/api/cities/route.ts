import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Tour from '@/models/Tour';
import Sightseeing from '@/models/Sightseeing';
import Rental from '@/models/Rental';
import Stay from '@/models/Stay';
import Activity from '@/models/Activity';

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

        // Fetch unique cities/locations from all relevant collections
        // We use Promise.all to fetch them in parallel
        const [tours, sightseeing, rentals, stays, activities] = await Promise.all([
            Tour.distinct('location', { status: 'approved' }),
            Sightseeing.distinct('city', { status: 'approved' }),
            Rental.distinct('city', { status: 'approved' }),
            Stay.distinct('city', { status: 'approved' }),
            Activity.distinct('city', { status: 'approved' })
        ]);

        // Combine all cities into a single Set to get unique values
        const allCities = new Set<string>();

        // Process Tours (they use 'location' field which might be "City, State")
        tours.forEach(loc => {
            if (loc) {
                const city = loc.split(',')[0].trim();
                if (city) allCities.add(city);
            }
        });

        // Process others (they use 'city' field directly)
        [...sightseeing, ...rentals, ...stays, ...activities].forEach(city => {
            if (city) {
                const trimmedCity = city.trim();
                if (trimmedCity) allCities.add(trimmedCity);
            }
        });

        // Convert Set to sorted Array
        const sortedCities = Array.from(allCities).sort();

        return NextResponse.json({ success: true, data: sortedCities });
    } catch (error) {
        console.error('[API/CITIES/GET] Failed to fetch cities:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch cities' }, { status: 500 });
    }
}
