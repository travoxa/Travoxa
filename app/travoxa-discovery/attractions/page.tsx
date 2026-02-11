import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Attraction from '@/models/Attraction';
import AttractionsClient from './AttractionsClient';

// Helper to serialize Mongoose documents
export const dynamic = 'force-dynamic';
const serializeConfig = (doc: any) => {
    return {
        ...doc,
        _id: doc._id.toString(),
        id: doc._id.toString(),
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    };
};

export default async function AttractionsPage() {
    await connectDB();

    const attractionsData = await Attraction.find({}).lean();
    const serializedAttractions = attractionsData.map(serializeConfig);

    return <AttractionsClient initialPackages={serializedAttractions} />;
}
