import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Helpline from '@/models/Helpline';

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const vendorId = searchParams.get('vendorId');
        const admin = searchParams.get('admin');
        const status = searchParams.get('status');

        const query: any = {};
        if (vendorId) {
            query.vendorId = vendorId;
        } else if (admin === 'true') {
            if (status) query.status = status;
        } else {
            query.status = 'approved';
        }

        const helplines = await Helpline.find(query).sort({ createdAt: -1 });
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

        const helplineData = {
            ...body,
            status: body.vendorId ? 'pending' : 'approved'
        };

        const helpline = await Helpline.create(helplineData);
        return NextResponse.json({ success: true, data: helpline }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
