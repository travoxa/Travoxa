import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const food = await Food.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!food) {
            return NextResponse.json({ success: false, error: 'Food not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: food }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const food = await Food.findByIdAndDelete(id);
        if (!food) {
            return NextResponse.json({ success: false, error: 'Food not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
