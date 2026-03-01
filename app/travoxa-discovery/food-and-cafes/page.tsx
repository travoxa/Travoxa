import React from 'react';
import { connectDB } from '@/lib/mongodb';
import Food from '@/models/Food';
import FoodClient from './FoodClient';

// FoodClient.tsx
export interface FoodPackage {
    _id: string;
    id: string;
    title: string;
    city: string;
    state: string;
    location?: string;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    cuisine: string | string[];
    overview: string;
    priceRange: string;
    price: number;
}

export const dynamic = 'force-dynamic';



const serializeConfig = (doc: any): FoodPackage => ({
    _id: doc._id.toString(),
    id: doc._id.toString(),
    title: doc.title || doc.name || '',        // fallback if DB uses `name`
    city: doc.city || '',
    state: doc.state || '',
    location: doc.location || '',
    rating: doc.rating?.toString ? parseFloat(doc.rating.toString()) : doc.rating || 0,
    reviews: doc.reviews?.toString ? parseInt(doc.reviews.toString()) : doc.reviews || 0,
    image: doc.image || '',
    category: doc.type || '',
    cuisine: Array.isArray(doc.cuisine) ? doc.cuisine : [doc.cuisine || ''],
    overview: doc.overview || '',
    priceRange: doc.price?.toString ? parseFloat(doc.price.toString()) : doc.price || 0,
    price :doc.price?.toString ? parseFloat(doc.price.toString()) : doc.price || 0,
});
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











// const serializeConfig = (doc: any) => {
//     return {
//         // ...doc,
//         // _id: doc._id.toString(),
//         // id: doc._id.toString(),
//         // category: doc.type, // Map 'type' from DB to 'category' for UI
//         // createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : null,
       
//     };
// };