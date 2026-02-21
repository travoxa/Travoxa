import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Attraction from '@/models/Attraction';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        console.log(`Attraction PUT Payload for ${id}:`, JSON.stringify(body, null, 2));

        // Force re-registration if schema might have changed in dev
        if (process.env.NODE_ENV === 'development' && mongoose.models.Attraction) {
            delete mongoose.models.Attraction;
        }

        const attraction = await Attraction.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!attraction) {
            return NextResponse.json({ success: false, error: 'Attraction not found' }, { status: 404 });
        }

        console.log('Updated Attraction:', JSON.stringify(attraction, null, 2));
        return NextResponse.json({ success: true, data: attraction }, { status: 200 });
    } catch (error: any) {
        console.error('Attraction PUT Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const attraction = await Attraction.findByIdAndDelete(id);
        if (!attraction) {
            return NextResponse.json({ success: false, error: 'Attraction not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
