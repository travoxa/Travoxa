import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { cookies } from 'next/headers';

// Helper to verify admin
async function isAdmin() {
    const cookieStore = await cookies();
    const adminAccess = cookieStore.get('admin_access')?.value;
    return !!adminAccess;
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '10');
        const blogs = await Blog.find().sort({ createdAt: -1 }).limit(limit);
        return NextResponse.json({ success: true, data: blogs }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function POST(req: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const blogData = await req.json();

        // Generate slug if not provided
        if (!blogData.slug && blogData.title) {
            blogData.slug = blogData.title
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        }

        const blog = await Blog.create(blogData);
        return NextResponse.json({ success: true, data: blog }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
