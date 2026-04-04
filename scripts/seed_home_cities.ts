import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import HomeCity from '../models/HomeCity';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "travoxa";

export async function seedHomeCities() {
    console.log(`🚀 Connecting to MongoDB...`);
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: MONGODB_DB_NAME,
        });
        console.log('✅ Connected.');

        const filePath = path.join(process.cwd(), 'scripts', 'home-cities-data.json');
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Data file not found at: ${filePath}`);
            return;
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        console.log(`📊 Processing ${data.length} home cities...`);

        let addedCount = 0;

        for (const item of data) {
            try {
                // Using findOneAndUpdate to avoid duplicates if run multiple times
                await HomeCity.findOneAndUpdate(
                    { name: item.name },
                    { $set: item },
                    { upsert: true, new: true, runValidators: true }
                );
                addedCount++;
                console.log(`   ✅ Seeded: ${item.name}`);
            } catch (err: any) {
                console.error(`   ❌ Failed to seed ${item.name}:`, err.message);
            }
        }

        console.log(`\n🎉 Seeding Complete!`);
        console.log(`📈 Cities Processed/Updated: ${addedCount}`);
    } catch (err) {
        console.error('❌ Database connection error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

if (require.main === module) {
    seedHomeCities().catch(e => console.error(e)).finally(() => process.exit(0));
}
