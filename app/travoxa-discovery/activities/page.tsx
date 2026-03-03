import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Activity from '@/models/Activity'; // Check if this model name is correct (Activity vs Activities)
import ActivitiesClient from './ActivitiesClient';

// Helper to serialize Mongoose documents
export const dynamic = 'force-dynamic';
const serializeConfig = (doc: any) => {
    const serialized = JSON.parse(JSON.stringify(doc));
    serialized.id = serialized._id;
    return serialized;
};

export default async function ActivitiesPage() {
    await connectDB();

    // Fetch all activities
    // We lean() to get POJOs, but IDs and Dates still need serialization for passing to Client Component
    const activitiesData = await Activity.find({}).lean();

    const serializedActivities = activitiesData.map(serializeConfig);

    return <ActivitiesClient initialPackages={serializedActivities} />;
}
