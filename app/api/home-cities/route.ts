import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import HomeCity from '@/models/HomeCity';

// Helper to connect to DB
async function connectDB() {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI as string, {
            dbName: process.env.MONGODB_DB_NAME || "travoxa"
        });
    }
}

// GET all home cities
export async function GET() {
    try {
        await connectDB();
        const cities = await HomeCity.find({}).sort({ createdAt: 1 });
        return NextResponse.json({ success: true, data: cities }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST a new home city
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        // Validation
        if (!body.name || !body.state || !body.image || !body.rating || !body.reviews) {
            return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
        }

        const city = await HomeCity.create(body);
        return NextResponse.json({ success: true, data: city }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
