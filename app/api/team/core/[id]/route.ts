import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import TeamMember from '@/models/TeamMember';
import bcrypt from 'bcryptjs';

export async function PUT(
    req: Request,
    request: { params: Promise<{ id: string }> } // Correct type for Next.js 15+ dynamic routes (params is a Promise)
) {
    try {
        await connectDB();
        const { id } = await request.params; // Await params
        const body = await req.json();

        // Hash password if provided and not empty
        if (body.password && body.password.trim() !== '') {
            body.password = await bcrypt.hash(body.password, 10);
        } else {
            // Remove password from body if it's empty to avoid overwriting with empty string
            delete body.password;
        }

        const updatedMember = await TeamMember.findByIdAndUpdate(
            id,
            { ...body },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedMember) {
            return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedMember });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ success: false, error: 'Username already exists' }, { status: 400 });
        }
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    request: { params: Promise<{ id: string }> } // Correct type for Next.js 15+ dynamic routes (params is a Promise)
) {
    try {
        await connectDB();
        const { id } = await request.params; // Await params

        const deletedMember = await TeamMember.findByIdAndDelete(id);

        if (!deletedMember) {
            return NextResponse.json({ success: false, error: 'Team member not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Team member deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
