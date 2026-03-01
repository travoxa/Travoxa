import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';

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

        const foodListings = await Food.find(query);
        return NextResponse.json({ success: true, data: foodListings }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const foodData = await req.json();

        if (foodData.vendorId) {
            foodData.status = 'pending';
        }

        const food = await Food.create(foodData);
        return NextResponse.json({ success: true, data: food }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
