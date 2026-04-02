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

/**
 * SEED GOA LANDMARKS
 * 
 * Maps OSM discovery data to the 'Place' model and inserts into MongoDB.
 * Ensures uniqueness using 'osmId'.
 */

async function seedGoa() {
    console.log('🚀 Connecting to MongoDB...');
    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: process.env.MONGODB_DB_NAME || "travoxa",
        });
        console.log('✅ Connected.');

        const filePath = path.join(process.cwd(), 'data', 'discovery', 'goa_landmarks.json');
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Discovery file not found at: ${filePath}`);
            process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const landmarks = data.landmarks;

        console.log(`📊 Processing ${landmarks.length} landmarks for Goa...`);

        let addedCount = 0;
        let skippedCount = 0;

        for (const item of landmarks) {
            // 1. Map Category
            let category = 'Sightseeing';
            if (item.category === 'beach') category = 'Beaches';
            if (item.category === 'place_of_worship') category = 'Pilgrimage';
            if (['viewpoint', 'museum', 'artwork', 'attraction', 'castle'].includes(item.category)) category = 'Sightseeing';

            // 2. Map Place Object
            const placeData = {
                name: item.name,
                category: category,
                location: {
                    type: 'Point',
                    coordinates: [item.lon, item.lat] // [lng, lat]
                },
                district: item.parentState || 'Goa',
                area: item.parentCity,
                tags: item.tags || [],
                source: 'osm',
                osmId: item.osmId
            };

            try {
                // Upsert based on osmId
                const result = await Place.findOneAndUpdate(
                    { osmId: item.osmId },
                    { $set: placeData },
                    { upsert: true, new: true, runValidators: true }
                );
                
                if (result.createdAt === result.updatedAt) {
                    // console.log(`   ✅ Added: ${item.name}`);
                    addedCount++;
                } else {
                    // console.log(`   🟡 Updated: ${item.name}`);
                    skippedCount++;
                }
            } catch (err: any) {
                console.error(`   ❌ Failed to seed ${item.name}:`, err.message);
            }
        }

        console.log(`\n🎉 Seeding Complete!`);
        console.log(`📈 New Landmarks Added: ${addedCount}`);
        console.log(`📈 Existing Updated/Skipped: ${skippedCount}`);
        
        process.exit(0);
    } catch (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    }
}

seedGoa();
