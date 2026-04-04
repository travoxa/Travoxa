import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import HomeCity from '@/models/HomeCity';

async function connectDB() {
    if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI as string, {
            dbName: process.env.MONGODB_DB_NAME || "travoxa"
        });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const body = await req.json();
        
        // Next.js 15+ resolution of runtime params requires await if accessed dynamically
        const p = await params;
        
        const city = await HomeCity.findByIdAndUpdate(p.id, body, {
            new: true,
            runValidators: true,
        });

        if (!city) {
            return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: city }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const p = await params;
        
        const city = await HomeCity.findByIdAndDelete(p.id);

        if (!city) {
            return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
