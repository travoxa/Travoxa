import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { BlogSubscriber } from '@/lib/models/BlogSubscriber';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const existingSubscriber = await BlogSubscriber.findOne({ email });

        if (existingSubscriber) {
            return NextResponse.json({ message: 'You are already subscribed!' }, { status: 200 }); // Treat as success UI-wise but with a specific message if needed, or just 200
        }

        await BlogSubscriber.create({ email });

        return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 201 });
    } catch (error) {
        console.error('Error subscribing to blog:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
