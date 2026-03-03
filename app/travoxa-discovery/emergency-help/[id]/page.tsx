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
