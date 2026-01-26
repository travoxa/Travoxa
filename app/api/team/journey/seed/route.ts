import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Journey from '@/models/Journey';

const seedData = [
    { title: "Ayodhya", desc: "The spiritual vibration here taught me that travel is about peace, not just sightseeing.", order: 1 },
    { title: "Varanasi", desc: "Wandering the ghats at 4 AM showed me the beauty of local rhythm and deep history.", order: 2 },
    { title: "Darjeeling", desc: "Watching the sunrise over Kanchenjunga made me realize why nature needs better eco-tourism.", order: 3 },
    { title: "Gangtok", desc: "Navigating the hills of Sikkim inspired our Smart Route Suggestion algorithms.", order: 4 },
    { title: "Mayapur", desc: "Community living here gave birth to the 'Volunteer Yatra' concept in Travoxa.", order: 5 },
    { title: "Delhi", desc: "The chaos and the food helped me understand the need for 'Food & Cafe' discovery.", order: 6 },
];

export async function GET() {
    try {
        await connectDB();

        // Check if data already exists to avoid duplicates
        const count = await Journey.countDocuments();
        if (count > 0) {
            // If data exists but seemingly empty to user, maybe we should return it to see what's there
            const items = await Journey.find();
            return NextResponse.json({ success: true, message: 'Data already exists', count, data: items });
        }

        await Journey.insertMany(seedData);
        return NextResponse.json({ success: true, message: 'Seed successful', data: seedData });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
