import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Place from '../models/Place';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "travoxa";

/**
 * GENERIC STATE SEEDER
 * 
 * Usage: npx tsx scripts/seed_places.ts "State Name"
 */

export async function seedState(stateName: string) {
    console.log(`🚀 Connecting to MongoDB for ${stateName}...`);
    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: process.env.MONGODB_DB_NAME || "travoxa",
        });
        console.log('✅ Connected.');

        const filePath = path.join(process.cwd(), 'data', 'discovery', `${stateName.toLowerCase()}_landmarks.json`);
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Discovery file not found for ${stateName} at: ${filePath}`);
            return;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const landmarks = data.landmarks;

        console.log(`📊 Processing ${landmarks.length} landmarks for ${stateName}...`);

        let addedCount = 0;
        let skippedCount = 0;

        for (const item of landmarks) {
            let category = 'Sightseeing';
            if (item.category === 'beach') category = 'Beaches';
            if (item.category === 'place_of_worship') category = 'Pilgrimage';
            if (['viewpoint', 'museum', 'artwork', 'attraction', 'castle'].includes(item.category)) category = 'Sightseeing';

            const placeData = {
                name: item.name,
                category: category,
                location: {
                    type: 'Point',
                    coordinates: [item.lon, item.lat] // [lng, lat]
                },
                district: stateName,
                area: item.parentCity,
                tags: item.tags || [],
                source: 'osm',
                osmId: item.osmId
            };

            try {
                await Place.findOneAndUpdate(
                    { osmId: item.osmId },
                    { $set: placeData },
                    { upsert: true, new: true, runValidators: true }
                );
                addedCount++;
            } catch (err: any) {
                if (err.code === 11000) {
                    skippedCount++;
                } else {
                    console.error(`   ❌ Failed to seed ${item.name}:`, err.message);
                }
            }
        }

        console.log(`\n🎉 Seeding Complete for ${stateName}!`);
        console.log(`📈 Total Landmarks Processed: ${landmarks.length}`);
        console.log(`📈 Unique Seeding Successes: ${addedCount - skippedCount}`);
        console.log(`📈 Duplicate/Name Conflicts Skipped: ${skippedCount}`);
    } catch (err) {
        console.error('❌ Database connection error:', err);
    }
}

if (require.main === module) {
    const stateArg = process.argv[2];
    if (stateArg) {
        seedState(stateArg).catch(e => console.error(e)).finally(() => process.exit(0));
    } else {
        console.log('Usage: npx tsx scripts/seed_places.ts "State Name"');
    }
}
