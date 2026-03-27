import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { cookies } from 'next/headers';

async function isAdmin() {
    const cookieStore = await cookies();
    const adminAccess = cookieStore.get('admin_access')?.value;
    return !!adminAccess;
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        
        // Find by ID or slug
        const blog = await Blog.findOne({
            $or: [
                { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
                { slug: id }
            ].filter(Boolean)
        });

        if (!blog) {
            return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
        }

        // Increment views
        blog.views += 1;
        await blog.save();

        return NextResponse.json({ success: true, data: blog }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;
        const blogData = await req.json();

        const blog = await Blog.findByIdAndUpdate(id, blogData, { new: true, runValidators: true });

        if (!blog) {
            return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: blog }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { id } = await params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
