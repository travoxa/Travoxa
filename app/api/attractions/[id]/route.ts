import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Attraction from '@/models/Attraction';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const attraction = await Attraction.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!attraction) {
            return NextResponse.json({ success: false, error: 'Attraction not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: attraction }, { status: 200 });
    } catch (error: any) {
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
