import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { CircleWaitlist } from '@/lib/models/CircleWaitlist';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email } = await req.json();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        const existingMember = await CircleWaitlist.findOne({ email });

        if (existingMember) {
            return NextResponse.json({ message: 'You are already on the waitlist!' }, { status: 200 });
        }

        await CircleWaitlist.create({ email });

        return NextResponse.json({ message: 'Successfully joined the waitlist!' }, { status: 201 });
    } catch (error) {
        console.error('Error joining circle waitlist:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
