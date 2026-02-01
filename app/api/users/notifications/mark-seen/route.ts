import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Update all notifications to seen: true for the user
        // The user request says "while showing a notification there must be a make the field in the object called seen to true"
        // Usually this means marking all as read when opening the dropdown.

        // We can support marking specific ones if body is provided, or all if not.
        // For now, let's just mark all as seen which is simpler and covers the "show notifications" use case.

        const result = await User.updateOne(
            { email: session.user.email },
            { $set: { "notifications.$[].seen": true } }
        );

        return NextResponse.json({ success: true, message: 'Notifications marked as seen' });
    } catch (error) {
        console.error('Error marking notifications as seen:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
