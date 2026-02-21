import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Attraction from '@/models/Attraction';
import AttractionDetailsClient from '../AttractionDetailsClient';
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
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : null,
    };
};

export default async function AttractionDetailsPage({ params }: PageProps) {
    await connectDB();
    const { id } = await params;

    try {
        const attraction = await Attraction.findById(id).lean();

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
