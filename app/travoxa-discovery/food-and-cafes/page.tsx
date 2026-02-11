import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';
import FoodClient from './FoodClient';

const serializeConfig = (doc: any) => {
    return {
        ...doc,
        _id: doc._id.toString(),
        id: doc._id.toString(),
        category: doc.type, // Map 'type' from DB to 'category' for UI
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
    };
};

export default async function FoodAndCafesPage() {
    await connectDB();

    const foodData = await Food.find({}).lean();
    const serializedFood = foodData.map(serializeConfig);

    return <FoodClient initialPackages={serializedFood} />;
}
