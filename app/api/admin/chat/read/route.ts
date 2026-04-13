import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';
import { pusher } from '@/lib/pusher';

/**
 * Mark all messages in a channel as read
 */
export async function POST(req: Request) {
    try {
        await connectDB();
        const { channel, reader, all } = await req.json();

        if (!all && (!channel || !reader)) {
            return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
        }

        // If admin is reading, mark all messages sent by 'user' as read
        const senderToMarkAsRead = reader === 'admin' ? 'user' : 'admin';

        if (all) {
            await ChatMessage.updateMany(
                { sender: senderToMarkAsRead, isRead: { $ne: true } },
                { $set: { isRead: true } }
            );
        } else {
            await ChatMessage.updateMany(
                { channel, sender: senderToMarkAsRead, isRead: { $ne: true } },
                { $set: { isRead: true } }
            );
            
            // Notify specific channel that messages have been read
            await pusher.trigger(channel, 'messages-read', {
                reader,
                channel
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Mark Read Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
