import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await connectDB();
        // Exclude password from the response
        const members = await TeamMember.find({}).select('-password').sort({ createdAt: 1 });
        return NextResponse.json({ success: true, data: members });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        if (!body.name || !body.role) {
            return NextResponse.json(
                { success: false, error: 'Name and role are required' },
                { status: 400 }
            );
        }

        // Hash password if provided
        if (body.password) {
            body.password = await bcrypt.hash(body.password, 10);
        }

        const newMember = await TeamMember.create(body);

        // Don't return password in response
        const memberObj = newMember.toObject();
        delete memberObj.password;

        return NextResponse.json({ success: true, data: memberObj }, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: 'Username already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
