import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';

/**
 * Search for users by name or email to start a new chat
 */
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query');

        if (!query || query.length < 2) {
            return NextResponse.json({ success: true, users: [] });
        }

        // Search for users matching name or email
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        })
        .select('name email')
        .limit(10)
        .lean();

        return NextResponse.json({ success: true, users });
    } catch (error: any) {
        console.error('User Search Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to search users' },
            { status: 500 }
        );
    }
}
