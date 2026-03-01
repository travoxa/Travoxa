import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Helpline from '@/models/Helpline';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const urlParams = await params;
        await connectDB();
        const helpline = await Helpline.findById(urlParams.id);
        if (!helpline) {
            return NextResponse.json({ success: false, error: 'Helpline not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: helpline }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const urlParams = await params;
        await connectDB();
        const body = await req.json();
        const helpline = await Helpline.findByIdAndUpdate(urlParams.id, body, {
            new: true,
            runValidators: true,
        });
        if (!helpline) {
            return NextResponse.json({ success: false, error: 'Helpline not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: helpline }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const urlParams = await params;
        await connectDB();
        const deletedHelpline = await Helpline.findByIdAndDelete(urlParams.id);
        if (!deletedHelpline) {
            return NextResponse.json({ success: false, error: 'Helpline not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
