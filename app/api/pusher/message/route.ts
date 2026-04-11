import { NextResponse } from 'next/server';
import { pusher } from '@/lib/pusher';
import { connectDB } from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';

/**
 * Handle sending and receiving chat messages with MongoDB persistence
 */

export async function POST(req: Request) {
    try {
        await connectDB();
        const { message, sender, senderId, receiverId, channel, id, timestamp, event, imageUrl } = await req.json();

        const eventName = event || 'new-message';

        // Validation: Must have message OR imageUrl
        if ((!message && !imageUrl) || !sender || !channel) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Save to MongoDB ONLY if it's a real message (not a presence pulse)
        let chatEntry = null;
        if (eventName === 'new-message') {
            chatEntry = await ChatMessage.create({
                text: message || '',
                sender: sender,         // 'user' or 'admin'
                senderId: senderId,     // email or 'admin'
                receiverId: receiverId, // 'admin' or userEmail
                channel: channel,
                imageUrl: imageUrl,
                id: id,
                timestamp: timestamp,
                createdAt: new Date()
            });
        }

        // 2. Trigger Pusher broadcast
        await pusher.trigger(channel, eventName, {
            id: id,
            text: message || '',
            sender: sender,
            senderId: senderId,
            timestamp: timestamp,
            imageUrl: imageUrl
        });

        return NextResponse.json({ success: true, data: chatEntry });
    } catch (error: any) {
        console.error('Pusher/DB Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * Fetch history for a specific channel
 */
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const channel = searchParams.get('channel');

        if (!channel) {
            return NextResponse.json({ success: false, error: 'Channel is required' }, { status: 400 });
        }

        // Fetch last 50 messages for this conversation
        const history = await ChatMessage.find({ channel })
            .sort({ createdAt: 1 }) // Show oldest first for chat flow
            .limit(50)
            .lean();

        return NextResponse.json({ success: true, history });
    } catch (error: any) {
        console.error('Fetch History Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
