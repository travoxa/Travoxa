import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Attraction from '@/models/Attraction';

export async function GET() {
    try {
        await connectDB();
        const attractions = await Attraction.find({});
        return NextResponse.json({ success: true, data: attractions }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        console.log('Attraction POST Payload:', JSON.stringify(body, null, 2));

        // Force re-registration if schema might have changed in dev
        if (process.env.NODE_ENV === 'development' && mongoose.models.Attraction) {
            delete mongoose.models.Attraction;
        }

        const attraction = await Attraction.create(body);
        console.log('Created Attraction:', JSON.stringify(attraction, null, 2));
        return NextResponse.json({ success: true, data: attraction }, { status: 201 });
    } catch (error: any) {
        console.error('Attraction POST Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
