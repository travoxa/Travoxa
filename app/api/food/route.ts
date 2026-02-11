import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';

export async function GET() {
    try {
        await connectDB();
        const food = await Food.find({});
        return NextResponse.json({ success: true, data: food }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const food = await Food.create(body);
        return NextResponse.json({ success: true, data: food }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
