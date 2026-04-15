import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';
import User from '@/lib/models/User';
import PushSubscription from '@/models/PushSubscription';

/**
 * Fetch a list of all unique users who have active chat conversations
 */
export async function GET(req: Request) {
    try {
        await connectDB();

        // 1. Get unique senderIds for users (exclude 'admin')
        const uniqueUserIds = await ChatMessage.distinct('senderId', { sender: 'user' });

        // 2. For each unique user, get their profile and last message
        const chatSessions = await Promise.all(uniqueUserIds.map(async (email) => {
            const [userProfile, lastMsg, unreadCount, pushSub] = await Promise.all([
                User.findOne({ email }).select('name email').lean(),
                ChatMessage.findOne({ senderId: email })
                    .sort({ createdAt: -1 })
                    .select('text timestamp createdAt')
                    .lean(),
                ChatMessage.countDocuments({ senderId: email, sender: 'user', isRead: { $ne: true } }),
                PushSubscription.findOne({ email: email?.toLowerCase() }).select('_id').lean()
            ]);

            return {
                email: email,
                name: userProfile?.name || email,
                lastMessage: lastMsg?.text || '',
                timestamp: lastMsg?.timestamp || '',
                createdAt: lastMsg?.createdAt || new Date(0),
                unreadCount: unreadCount,
                unread: unreadCount > 0,
                hasPushToken: !!pushSub
            };
        }));

        // 3. Sort by most recent message
        chatSessions.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return NextResponse.json({ success: true, chats: chatSessions });
    } catch (error: any) {
        console.error('Fetch Admin Chats Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
