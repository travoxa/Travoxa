import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import ChatMessage from '@/models/ChatMessage';

/**
 * Delete chat messages
 * DELETE /api/admin/chat/delete?channel=... (specific)
 * DELETE /api/admin/chat/delete?all=true (everything)
 */
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const channel = searchParams.get('channel');
        const deleteAll = searchParams.get('all') === 'true';

        if (!channel && !deleteAll) {
            return NextResponse.json({ success: false, error: 'Missing channel or all parameter' }, { status: 400 });
        }

        await connectDB();

        if (deleteAll) {
            // Delete EVERYTHING
            await ChatMessage.deleteMany({});
            return NextResponse.json({ success: true, message: 'All chat history deleted' });
        } else if (channel) {
            // Delete specific conversation
            await ChatMessage.deleteMany({ channel });
            return NextResponse.json({ success: true, message: `History for ${channel} deleted` });
        }

        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    } catch (error: any) {
        console.error('Delete Chat Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
