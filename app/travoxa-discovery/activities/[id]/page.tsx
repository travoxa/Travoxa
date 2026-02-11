import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Activity from '@/models/Activity'; // Check if this model name is correct (Activity vs Activities)
import ActivityDetailsClient from '../ActivityDetailsClient';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

// Helper to serialize Mongoose documents
const serializeConfig = (doc: any) => {
    return {
        ...doc,
        _id: doc._id.toString(),
        id: doc._id.toString(),
        // Check for Dates
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
        // Since we use lean(), other fields should be POJOs. 
        // Just in case bestMonths is missing or partial, lean() usually handles it well.
    };
};

export default async function ActivityDetailsPage({ params }: PageProps) {
    await connectDB();
    // Await params for Next.js 15+
    const { id } = await params;

    try {
        const activity = await Activity.findById(id).lean();

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
