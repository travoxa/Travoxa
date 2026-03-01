import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Activity from '@/models/Activity'; // Check if this model name is correct (Activity vs Activities)
import Tour from '@/models/Tour';
import Sightseeing from '@/models/Sightseeing';
import Rental from '@/models/Rental';
import Stay from '@/models/Stay';
import Food from '@/models/Food';
import Attraction from '@/models/Attraction';
import ActivityDetailsClient from '../ActivityDetailsClient';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

// Helper to serialize Mongoose documents
const serializeConfig = (doc: any) => {
    const serialized = JSON.parse(JSON.stringify(doc));
    serialized.id = serialized._id.toString();
    return serialized;
};

export default async function ActivityDetailsPage({ params }: PageProps) {
    await connectDB();
    // Await params for Next.js 15+
    const { id } = await params;

    try {
        Tour.find().limit(1); Sightseeing.find().limit(1); Activity.find().limit(1); Rental.find().limit(1); Stay.find().limit(1); Food.find().limit(1); Attraction.find().limit(1);

        const activity = await Activity.findById(id)
            .populate('relatedTours', 'title image _id googleRating rating location city state')
            .populate('relatedSightseeing', 'title image _id rating location city state')
            .populate('relatedActivities', 'title image _id rating location city state')
            .populate('relatedRentals', 'title name image _id rating location city state')
            .populate('relatedStays', 'title name image _id rating location city state')
            .populate('relatedFood', 'name image _id rating location city state cuisine')
            .populate('relatedAttractions', 'title image _id rating location city state type category')
            .lean();

        if (!activity) {
            notFound();
        }

        const serializedActivity = serializeConfig(activity);

        return <ActivityDetailsClient activity={serializedActivity} />;
    } catch (error) {
        console.error('Error fetching activity:', error);
        notFound();
    }
}
