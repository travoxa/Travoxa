import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Helpline from '@/models/Helpline';

export async function GET() {
    try {
        await connectDB();
        const helplines = await Helpline.find({});
        return NextResponse.json({ success: true, data: helplines }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Prevent schema issues in dev
        if (process.env.NODE_ENV === 'development' && mongoose.models.Helpline) {
            delete mongoose.models.Helpline;
        }

        const helpline = await Helpline.create(body);
        return NextResponse.json({ success: true, data: helpline }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
