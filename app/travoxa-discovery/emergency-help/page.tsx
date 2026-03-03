import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Helpline from '@/models/Helpline';
import EmergencyHelpClient from './EmergencyHelpClient';

export const dynamic = 'force-dynamic';

const serializeConfig = (doc: any) => {
    const serialized = JSON.parse(JSON.stringify(doc));
    serialized.id = serialized._id;
    return serialized;
};

export default async function EmergencyHelpPage() {
    await connectDB();

    const helplinesData = await Helpline.find({}).lean();
    const serializedHelplines = helplinesData.map(serializeConfig);

    return <EmergencyHelpClient initialHelplines={serializedHelplines} />;
}

