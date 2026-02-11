import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Sightseeing from "@/models/Sightseeing";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        // Await params to access id
        const { id } = await params;

        const reviews = await Review.find({ itemId: id }).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: 'Not authenticated' },
                { status: 401 }
            );
        }

        await connectDB();

        // Await params to access id
        const { id } = await params;

        const body = await request.json();
        const { rating, comment } = body;

        // Validation
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { success: false, error: 'Please provide a valid rating between 1 and 5' },
                { status: 400 }
            );
        }

        if (!comment || !comment.trim()) {
            return NextResponse.json(
                { success: false, error: 'Please provide a comment' },
                { status: 400 }
            );
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            itemId: id,
            userId: session.user.email // Using email as ID since we might not have a database ID for user depending on auth provider
        });

        if (existingReview) {
            return NextResponse.json(
                { success: false, error: 'You have already reviewed this package' },
                { status: 400 }
            );
        }

        // Create Review
        const review = await Review.create({
            itemId: id,
            userId: session.user.email,
            userName: session.user.name || 'Anonymous',
            userImage: session.user.image,
            rating,
            comment
        });

        // Update Sightseeing Rating
        const stats = await Review.aggregate([
            { $match: { itemId: new Object(id) } }, // Not converting to ObjectId yet as itemId in Review is Ref which is ObjectId, but passed id is string. Mongoose handles cast usually but in aggregate we might need to be careful. However, let's try standard approach first.
            // Actually, for aggregate matching with ObjectId, we need to cast if it's stored as ObjectId.
            // But let's check Review schema: itemId is ObjectId. id param is string.
        ]);

        // Re-calculating using a simpler finding approach to be safe with types
        const allReviews = await Review.find({ itemId: id });
        const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
        const numReviews = allReviews.length;

        await Sightseeing.findByIdAndUpdate(id, {
            rating: avgRating,
            reviews: numReviews
        });

        return NextResponse.json({
            success: true,
            data: review
        });

    } catch (error: any) {
        console.error('Error posting review:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Failed to post review' },
            { status: 500 }
        );
    }
}
