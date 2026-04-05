import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Tour from '@/models/Tour';
import Sightseeing from '@/models/Sightseeing';
import Activity from '@/models/Activity';
import Rental from '@/models/Rental';
import Stay from '@/models/Stay';
import Food from '@/models/Food';
import Attraction from '@/models/Attraction';

export async function GET() {
    try {
        await connectDB();
        console.log('API Migration: Connected to MongoDB');

        const models = [
            { model: Tour, name: 'Tour', field: 'title' },
            { model: Sightseeing, name: 'Sightseeing', field: 'title' },
            { model: Activity, name: 'Activity', field: 'title' },
            { model: Rental, name: 'Rental', field: 'name' },
            { model: Stay, name: 'Stay', field: 'title' },
            { model: Food, name: 'Food', field: 'title' },
            { model: Attraction, name: 'Attraction', field: 'title' }
        ];

        const results: any = {};

        for (const { model, name, field } of models) {
            console.log(`API Migration: Processing ${name}...`);
            const documents = await model.find({ slug: { $exists: false } }).lean();
            console.log(`API Migration: Found ${documents.length} documents without slug in ${name}`);

            let count = 0;
            for (const doc of documents) {
                const title = (doc as any)[field];
                if (title) {
                    const slug = title
                        .toString()
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w-]+/g, '')
                        .replace(/--+/g, '-');
                    
                    await model.updateOne({ _id: doc._id }, { $set: { slug } });
                    count++;
                }
            }
            results[name] = count;
        }

        return NextResponse.json({ success: true, results });
    } catch (error: any) {
        console.error('API Migration failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
