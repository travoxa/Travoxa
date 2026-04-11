import { NextResponse } from 'next/server';
import { pusher } from '@/lib/pusher';

/**
 * API route to trigger Pusher messages for real-time chat testing
 */
export async function POST(req: Request) {
    try {
        const { message, sender, channel = 'travoxa-test-chat', id, timestamp } = await req.json();

        if (!message || !sender) {
            return NextResponse.json(
                { success: false, error: 'Missing message or sender' },
                { status: 400 }
            );
        }

        // Trigger the Pusher event
        await pusher.trigger(channel, 'new-message', {
            id: id || Date.now().toString(),
            text: message,
            sender: sender, // 'user' or 'admin'
            timestamp: timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Pusher trigger error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
