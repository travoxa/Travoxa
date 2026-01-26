import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';

export async function GET() {
    try {
        await connectDB();
        const members = await TeamMember.find({}).sort({ createdAt: 1 });
        return NextResponse.json({ success: true, data: members });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        if (!body.name || !body.role || !body.image) {
            return NextResponse.json(
                { success: false, error: 'Name, role, and image are required' },
                { status: 400 }
            );
        }

        const newMember = await TeamMember.create(body);
        return NextResponse.json({ success: true, data: newMember }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
