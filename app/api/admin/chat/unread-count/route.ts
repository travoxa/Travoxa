import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';

/**
 * Get total count of unread messages for the admin
 */
export async function GET(req: Request) {
    try {
        await connectDB();

        // Count all messages sent by 'user' that are not yet read
        const count = await ChatMessage.countDocuments({ 
            sender: 'user', 
            isRead: false 
        });

        return NextResponse.json({ success: true, count });
    } catch (error: any) {
        console.error('Unread Count Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
