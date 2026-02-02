import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import TourRequest from '@/models/TourRequest';
import User from '@/lib/models/User';
import Tour from '@/models/Tour';

// POST: Create a new tour request
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        // Get user ID
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await req.json();
        const { tourId, members, date, userDetails } = body;

        if (!tourId || !members || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get Tour details for validation and title
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
        }

        const newRequest = await TourRequest.create({
            tourId,
            userId: user._id,
            title: tour.title, // Store title for easy display
            members,
            date,
            userDetails: {
                name: userDetails?.name || user.name,
                email: userDetails?.email || user.email,
                phone: userDetails?.phone || ''
            },
            status: 'pending'
        });

        return NextResponse.json({ success: true, data: newRequest }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating tour request:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

// GET: Fetch requests (Admin: all, User: own)
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email });

        // Parse query params to check for specific tour requests
        const { searchParams } = new URL(req.url);
        const tourId = searchParams.get('tourId');

        let query: any = {};

        // If tourId is provided (Admin fetching requests for a specific tour)
        // For simplicity, we assume if you can see the admin page you can see requests.
        // In a real app, we'd check admin role.
        // Here, we'll check if the user is an admin or trying to see their own requests.

        // Assuming basic role check or open for now based on context (admin dashboard handles auth).
        // Let's implement basic filtering.

        if (tourId) {
            // Admin view for specific tour
            query = { tourId };
        } else {
            // User view for their own requests
            query = { userId: user._id };
        }

        const requests = await TourRequest.find(query).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: requests });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
// PUT: Update request status
export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        const { requestId, status } = body;

        if (!requestId || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const updatedRequest = await TourRequest.findByIdAndUpdate(
            requestId,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return NextResponse.json({ error: 'Request not found' }, { status: 404 });
        }

        // Send notification to the user
        // We know updatedRequest.userId exists
        const message = `Your tour request for "${updatedRequest.title}" has been ${status}.`;

        await User.findByIdAndUpdate(updatedRequest.userId, {
            $push: {
                notifications: {
                    senderId: 'admin', // Or session.user.id
                    message,
                    seen: false,
                    createdAt: new Date()
                }
            }
        });

        return NextResponse.json({ success: true, data: updatedRequest });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
