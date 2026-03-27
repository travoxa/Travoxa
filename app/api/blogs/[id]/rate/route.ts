import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        const { rating } = await req.json();
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Please login to rate this blog' }, { status: 401 });
        }

        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json({ success: false, error: 'Invalid rating. Must be 1-5' }, { status: 400 });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
        }

        // Add rating and update average
        blog.ratings.push(rating);
        const sum = blog.ratings.reduce((a: number, b: number) => a + b, 0);
        blog.averageRating = sum / blog.ratings.length;

        await blog.save();

        return NextResponse.json({ success: true, averageRating: blog.averageRating, totalRatings: blog.ratings.length }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
