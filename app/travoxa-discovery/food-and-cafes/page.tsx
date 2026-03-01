import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';
import FoodClient from './FoodClient';
import { FoodPackage } from './FoodClient';

// FoodClient.tsx




export const dynamic = 'force-dynamic';

const serializeConfig = (doc: any): FoodPackage => ({
    _id: doc._id.toString(),
    id: doc._id.toString(),

    title: doc.title || '',
    city: doc.city || '',
    state: doc.state || '',
    location: doc.location || '',

    rating: Number(doc.rating) || 0,
    reviews: Number(doc.reviews) || 0,

    image: doc.image || '',
    category: doc.type || '',

    cuisine: Array.isArray(doc.cuisine)
        ? doc.cuisine
        : [doc.cuisine || ''],

    overview: doc.overview || '',

    price: Number(doc.price) || 0,

    // convert number to string because filter expects string
    priceRange: String(doc.priceRange || doc.price || ''),

    createdAt: doc.createdAt
        ? new Date(doc.createdAt).toISOString()
        : new Date().toISOString(),

    famousDish: doc.famousDish || '',
    dishType: doc.dishType || '',

    fullMenu: doc.fullMenu || [],
});

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