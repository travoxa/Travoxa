
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tour from '../models/Tour';
import Activity from '../models/Activity';
import Stay from '../models/Stay';
import Food from '../models/Food';
import Rental from '../models/Rental';
import Sightseeing from '../models/Sightseeing';
import Helpline from '../models/Helpline';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

async function populateSlugs() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to MongoDB');

        const collections = [
            { model: Tour, name: 'Tours' },
            { model: Activity, name: 'Activities' },
            { model: Stay, name: 'Stays' },
            { model: Food, name: 'Food' },
            { model: Rental, name: 'Rentals' },
            { model: Sightseeing, name: 'Sightseeing' },
            { model: Helpline, name: 'Helplines' }
        ];

        for (const col of collections) {
            console.log(`Processing ${col.name}...`);
            const items = await col.model.find({ $or: [{ slug: { $exists: false } }, { slug: '' }, { slug: null }] });
            console.log(`Found ${items.length} items without slugs in ${col.name}`);

            for (const item of items) {
                const titleField = (item as any).title || (item as any).name || (item as any).serviceName;
                if (titleField) {
                    let baseSlug = titleField
                        .toString()
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, '-')
                        .replace(/[^\w-]+/g, '')
                        .replace(/--+/g, '-');
                    
                    let slug = baseSlug;
                    let counter = 1;
                    let success = false;

                    while (!success) {
                        try {
                            item.slug = slug;
                            await item.save();
                            console.log(`  Updated: ${titleField} -> ${item.slug}`);
                            success = true;
                        } catch (err: any) {
                            if (err.code === 11000) {
                                // Duplicate key error
                                slug = `${baseSlug}-${counter}`;
                                counter++;
                                console.log(`  Retrying with slug: ${slug}`);
                            } else {
                                console.error(`  Failed to update: ${titleField}`, err);
                                break;
                            }
                        }
                    }
                }
            }
        }

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

populateSlugs();
