
import mongoose from 'mongoose';
import Tour from '../models/Tour';
import Activity from '../models/Activity';
import Sightseeing from '../models/Sightseeing';
import Attraction from '../models/Attraction';
import Food from '../models/Food';
import Stay from '../models/Stay';
import Rental from '../models/Rental';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const migrateViews = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const models = [
            { name: 'Tour', model: Tour },
            { name: 'Activity', model: Activity },
            { name: 'Sightseeing', model: Sightseeing },
            { name: 'Attraction', model: Attraction },
            { name: 'Food', model: Food },
            { name: 'Stay', model: Stay },
            { name: 'Rental', model: Rental }
        ];

        for (const { name, model } of models) {
            console.log(`Migrating ${name}...`);
            const result = await (model as any).updateMany(
                { views: { $exists: false } }, // only if doesn't exist
                { $set: { views: 0 } }
            );
            console.log(`${name} migration result:`, result);
        }

        console.log('Migration completed successfully!');

    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
};

migrateViews();
