import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';
import FoodClient from './FoodClient';

export const dynamic = 'force-dynamic';
const serializeConfig = (doc: any) => {
    return {
        ...doc,
        _id: doc._id.toString(),
        id: doc._id.toString(),
        category: doc.type, // Map 'type' from DB to 'category' for UI
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
        fullMenu: doc.fullMenu ? doc.fullMenu.map((cat: any) => ({
            ...cat,
            _id: cat._id?.toString(),
            items: cat.items?.map((item: any) => ({
                ...item,
                _id: item._id?.toString()
            }))
        })) : []
    };
};

export default async function FoodAndCafesPage() {
    await connectDB();

    const foodData = await Food.find({}).lean();
    const serializedFood = foodData.map(serializeConfig);

    return <FoodClient initialPackages={serializedFood} />;
}
