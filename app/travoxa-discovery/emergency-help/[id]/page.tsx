import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Helpline from '@/models/Helpline';
import HelplineDetailsClient from '../HelplineDetailsClient';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const serializeConfig = (doc: any) => {
    const serialized = JSON.parse(JSON.stringify(doc));
    serialized.id = serialized._id;
    return serialized;
};

export default async function HelplineDetailsPage({ params }: PageProps) {
    await connectDB();
    const { id: identifier } = await params;

    try {
        let helpline = null;

        // Try finding by slug first
        helpline = await Helpline.findOne({ slug: identifier }).lean();

        // If not found and identifier is valid Mongo ID, try finding by ID
        if (!helpline && identifier.match(/^[0-9a-fA-F]{24}$/)) {
            helpline = await Helpline.findById(identifier).lean();
        }

        if (!helpline) {
            notFound();
        }

        const serializedHelpline = serializeConfig(helpline);

        return <HelplineDetailsClient helpline={serializedHelpline} />;
    } catch (error) {
        console.error('Error fetching helpline:', error);
        notFound();
    }
}
