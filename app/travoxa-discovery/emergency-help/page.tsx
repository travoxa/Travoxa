import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Helpline from '@/models/Helpline';
import EmergencyHelpClient from './EmergencyHelpClient';

export const dynamic = 'force-dynamic';

const serializeConfig = (doc: any) => {
    return {
        ...doc,
        _id: doc._id.toString(),
        id: doc._id.toString(),
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
        lastUpdated: doc.lastUpdated ? new Date(doc.lastUpdated).toISOString() : null,
    };
};

export default async function EmergencyHelpPage() {
    await connectDB();

    const helplinesData = await Helpline.find({}).lean();
    const serializedHelplines = helplinesData.map(serializeConfig);

    return <EmergencyHelpClient initialHelplines={serializedHelplines} />;
}

