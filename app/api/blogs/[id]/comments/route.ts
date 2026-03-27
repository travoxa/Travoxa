import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Comment from '@/models/Comment';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        const comments = await Comment.find({ blogId: id }).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, data: comments }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        const { content } = await req.json();
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Please login to comment' }, { status: 401 });
        }

        if (!content || content.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Comment cannot be empty' }, { status: 400 });
        }

        const comment = await Comment.create({
            blogId: id,
            userId: session.user.id || session.user.email,
            userName: session.user.name,
            userImage: session.user.image,
            content,
        });

        return NextResponse.json({ success: true, data: comment }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
