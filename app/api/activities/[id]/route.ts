import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Activity from '@/models/Activity';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const activity = await Activity.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!activity) {
            return NextResponse.json({ success: false, error: 'Activity not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: activity }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const activity = await Activity.findByIdAndDelete(id);
        if (!activity) {
            return NextResponse.json({ success: false, error: 'Activity not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
