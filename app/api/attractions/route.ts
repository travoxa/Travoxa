import { NextResponse } from 'next/server';
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
        const attraction = await Attraction.create(body);
        return NextResponse.json({ success: true, data: attraction }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
