import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import PushSubscription from '@/models/PushSubscription';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, token, platform } = await req.json();

        if (!email || !token) {
            return NextResponse.json({ success: false, error: 'Email and token are required' }, { status: 400 });
        }

        // Upsert the token for this user
        const subscription = await PushSubscription.findOneAndUpdate(
            { token }, // Find by token to avoid duplicates across accounts if a device changes ownership
            { email, platform, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, data: subscription });
    } catch (error: any) {
        console.error('Push Registration Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
