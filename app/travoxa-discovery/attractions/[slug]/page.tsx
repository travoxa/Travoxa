import React from 'react';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import Attraction from '@/models/Attraction';
import Tour from '@/models/Tour';
import Sightseeing from '@/models/Sightseeing';
import Activity from '@/models/Activity';
import Rental from '@/models/Rental';
import Stay from '@/models/Stay';
import Food from '@/models/Food';
import AttractionDetailsClient from '../AttractionDetailsClient';
import { notFound, permanentRedirect } from 'next/navigation';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Helper to serialize Mongoose documents
const serializeConfig = (doc: any) => {
    const serialized = JSON.parse(JSON.stringify(doc));
    serialized.id = serialized._id.toString();
    return serialized;
};

export default async function AttractionDetailsPage({ params }: PageProps) {
    await connectDB();
    const { slug: slugParam } = await params;

    try {
        // Ensure models are registered (sometimes needed in dev)
        Tour.find().limit(1); Sightseeing.find().limit(1); Activity.find().limit(1); Rental.find().limit(1); Stay.find().limit(1); Food.find().limit(1); Attraction.find().limit(1);

        let attraction;
        const isObjectId = mongoose.Types.ObjectId.isValid(slugParam);

        if (isObjectId) {
            // If it's an ID, find by ID and then redirect to slug
            attraction = await Attraction.findByIdAndUpdate(
                slugParam,
                { $inc: { views: 1 } },
                { new: true }
            ).lean();
            if (attraction && attraction.slug) {
                permanentRedirect(`/travoxa-discovery/attractions/${attraction.slug}`);
            }
        } else {
            // Find by slug
            attraction = await Attraction.findOneAndUpdate(
                { slug: slugParam },
                { $inc: { views: 1 } },
                { new: true }
            )
                .populate('relatedTours', 'title image _id googleRating rating location city state')
                .populate('relatedSightseeing', 'title image _id rating location city state')
                .populate('relatedActivities', 'title image _id rating location city state')
                .populate('relatedRentals', 'title name image _id rating location city state')
                .populate('relatedStays', 'title name image _id rating location city state')
                .populate('relatedFood', 'name image _id rating location city state cuisine')
                .populate('relatedAttractions', 'title image _id rating location city state type category slug')
                .lean();
        }

        // If we found it via ID but it didn't have a slug (fallback)
        if (isObjectId && attraction && !attraction.slug) {
            attraction = await Attraction.findByIdAndUpdate(
                slugParam,
                { $inc: { views: 1 } },
                { new: true }
            )
                .populate('relatedTours', 'title image _id googleRating rating location city state')
                .populate('relatedSightseeing', 'title image _id rating location city state')
                .populate('relatedActivities', 'title image _id rating location city state')
                .populate('relatedRentals', 'title name image _id rating location city state')
                .populate('relatedStays', 'title name image _id rating location city state')
                .populate('relatedFood', 'name image _id rating location city state cuisine')
                .populate('relatedAttractions', 'title image _id rating location city state type category slug')
                .lean();
        }

        if (!attraction) {
            notFound();
        }

        const serializedAttraction = serializeConfig(attraction);

        return <AttractionDetailsClient attraction={serializedAttraction} />;
    } catch (error) {
        console.error('Error fetching attraction:', error);
        notFound();
    }
}
