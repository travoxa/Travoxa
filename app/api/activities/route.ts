import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Activity from '@/models/Activity';

export async function GET() {
    try {
        await connectDB();
        const activities = await Activity.find({});
        return NextResponse.json({ success: true, data: activities }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const activity = await Activity.create(body);
        return NextResponse.json({ success: true, data: activity }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
