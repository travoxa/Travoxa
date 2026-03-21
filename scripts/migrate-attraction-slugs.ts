
import mongoose from 'mongoose';
import Attraction from '../models/Attraction';
import { slugify } from '../utils/slugify';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const migrateSlugs = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const attractions = await Attraction.find({});
        console.log(`Found ${attractions.length} attractions to process.`);

        const slugMap = new Map();

        for (const attraction of attractions) {
            let baseSlug = slugify(attraction.title || 'attraction');
            let slug = baseSlug;
            let counter = 1;

            // Basic duplicate prevention within this run
            while (slugMap.has(slug)) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            slugMap.set(slug, true);

            attraction.slug = slug;
            await attraction.save();
            console.log(`Updated: ${attraction.title} -> ${slug}`);
        }

        console.log('Migration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

migrateSlugs();
