import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Journey from '@/models/Journey';

export async function GET() {
    try {
        await connectDB();
        const items = await Journey.find().sort({ order: 1, createdAt: 1 });
        return NextResponse.json({ success: true, data: items });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch journey items' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        // Auto-increment order if not provided
        if (body.order === undefined) {
            const lastItem = await Journey.findOne().sort({ order: -1 });
            body.order = lastItem ? lastItem.order + 1 : 0;
        }

        const item = await Journey.create(body);
        return NextResponse.json({ success: true, data: item });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create journey item' }, { status: 500 });
    }
}
