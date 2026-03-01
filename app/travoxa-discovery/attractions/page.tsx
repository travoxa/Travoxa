import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Attraction from '@/models/Attraction';
import AttractionsClient from './AttractionsClient';

// Helper to serialize Mongoose documents
export const dynamic = 'force-dynamic';
const serializeConfig = (doc: any) => {
    const serialized = JSON.parse(JSON.stringify(doc));
    serialized.id = serialized._id.toString();
    return serialized;
};

export default async function AttractionsPage() {
    await connectDB();

    const attractionsData = await Attraction.find({}).lean();
    const serializedAttractions = attractionsData.map(serializeConfig);

    return <AttractionsClient initialPackages={serializedAttractions} />;
}
