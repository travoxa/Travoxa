import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';
import FoodClient from './FoodClient';
import { FoodPackage } from './FoodClient';

// FoodClient.tsx




export const dynamic = 'force-dynamic';

const serializeConfig = (doc: any): FoodPackage => {
    const serialized = JSON.parse(JSON.stringify(doc));
    return {
        ...serialized,
        id: serialized._id,
        category: serialized.type || '', // Handle mapping 'type' to 'category' if needed by Client
        cuisine: Array.isArray(serialized.cuisine) ? serialized.cuisine : [serialized.cuisine || ''],
    };
};

export default async function FoodAndCafesPage() {
    await connectDB();

    const foodData = await Food.find({}).lean();
    const serializedFood = foodData.map(serializeConfig);

    return <FoodClient initialPackages={serializedFood} />;
}











// const serializeConfig = (doc: any) => {
//     return {
//         // ...doc,
//         // _id: doc._id.toString(),
//         // id: doc._id.toString(),
//         // category: doc.type, // Map 'type' from DB to 'category' for UI
//         // createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
       
//     };
// };