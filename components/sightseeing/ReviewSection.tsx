"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { FaStar, FaRegStar, FaUserCircle } from "react-icons/fa";

interface Review {
    _id: string;
    userId: string;
    userName: string;
    userImage?: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewSectionProps {
    packageId: string;
}

export default function ReviewSection({ packageId }: ReviewSectionProps) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [error, setError] = useState("");

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/sightseeing/${packageId}/reviews`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (err) {
            console.error("Failed to load reviews", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [packageId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) {
            setError("Please select a rating");
            return;
        }
        if (!comment.trim()) {
            setError("Please write a comment");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const res = await fetch(`/api/sightseeing/${packageId}/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment })
            });
            const data = await res.json();

            if (data.success) {
                setComment("");
                setRating(0);
                fetchReviews(); // Refresh reviews
            } else {
                setError(data.error || "Failed to submit review");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (count: number) => {
        return (
            <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                    <span key={i}>
                        {i < count ? <FaStar /> : <FaRegStar />}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <section className="bg-white rounded-2xl p-8 border border-slate-200 mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 Mont">Reviews & Ratings</h2>

            {/* Reviews List */}
            <div className="space-y-8 mb-12">
                {loading ? (
                    <div className="text-center text-slate-500">Loading reviews...</div>
                ) : reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="flex gap-4 border-b border-slate-100 pb-8 last:border-0 last:pb-0">
                            <div className="shrink-0">
                                {review.userImage ? (
                                    <Image
                                        src={review.userImage}
                                        alt={review.userName}
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                    />
                                ) : (
                                    <FaUserCircle className="text-slate-300 w-12 h-12" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-bold text-slate-900">{review.userName}</h4>
                                    <span className="text-sm text-slate-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="mb-2">{renderStars(review.rating)}</div>
                                <p className="text-slate-600 leading-relaxed">{review.comment}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-xl">
                        <p className="text-slate-500">No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}
            </div>

            {/* Write Review Section */}
            <div className="bg-slate-50 rounded-xl p-6 md:p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Write a Review</h3>

                {session ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-slate-700">Rating</label>
                            <div className="flex gap-1 text-2xl text-yellow-400 cursor-pointer w-fit">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        {star <= (hoverRating || rating) ? <FaStar /> : <FaRegStar className="text-slate-300" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Your Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Tell us about your experience..."
                                required
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-slate-600 mb-4">Please log in to leave a review.</p>
                        <button
                            onClick={() => signIn()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
                        >
                            Log In / Sign Up
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
