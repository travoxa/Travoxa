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
    return {
        ...doc,
        _id: doc._id.toString(),
        id: doc._id.toString(),
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
        lastUpdated: doc.lastUpdated ? new Date(doc.lastUpdated).toISOString() : null,
    };
};

export default async function HelplineDetailsPage({ params }: PageProps) {
    await connectDB();
    const { id } = await params;

    try {
        const helpline = await Helpline.findById(id).lean();

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
