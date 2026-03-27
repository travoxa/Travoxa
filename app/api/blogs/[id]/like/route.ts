import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Please login to like this blog' }, { status: 401 });
        }

        const userId = session.user.id || session.user.email;
        const blog = await Blog.findById(id);

        if (!blog) {
            return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
        }

        const isLiked = blog.likedBy.includes(userId);

        if (isLiked) {
            // Unlike
            blog.likedBy = blog.likedBy.filter((uid: string) => uid !== userId);
            blog.likes = Math.max(0, blog.likes - 1);
        } else {
            // Like
            blog.likedBy.push(userId);
            blog.likes += 1;
        }

        await blog.save();

        return NextResponse.json({ success: true, liked: !isLiked, likes: blog.likes }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
