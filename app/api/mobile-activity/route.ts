import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import MobileActivity from '@/models/MobileActivity';

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        const activity = await MobileActivity.create(body);
        
        return NextResponse.json({ success: true, data: activity }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 400 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = parseInt(searchParams.get('skip') || '0');
        const type = searchParams.get('type');
        const userEmail = searchParams.get('userEmail');
        
        let query: any = {};
        if (type) query.type = type;
        if (userEmail) query.userEmail = { $regex: userEmail, $options: 'i' };
        
        const activities = await MobileActivity.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await MobileActivity.countDocuments(query);
        
        return NextResponse.json({ success: true, data: activities, total });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
