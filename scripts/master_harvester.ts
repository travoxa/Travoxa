import { harvestState } from './checklist_harvester';
import { seedState } from './seed_places';

/**
 * MASTER HARVESTER
 * 
 * Combines Discovery (Fetch) and Database Seeding into a single command.
 * Usage: npx tsx scripts/master_harvester.ts "State Name"
 */

async function runFullPipeline(stateName: string) {
    console.log(`\n🌍 Starting Full Travel Data Pipeline for: ${stateName}`);
    console.log(`====================================================\n`);

    try {
        // Step 1: Discovery (Fetch)
        console.log('📡 PHASE 1: DISCOVERY (FETCHING DATA)');
        await harvestState(stateName);

        console.log(`\n💾 PHASE 2: SEEDING (SAVING TO DATABASE)`);
        // Step 2: Seeding
        await seedState(stateName);

        console.log(`\n✨ Successfully completed full pipeline for ${stateName}!`);
        process.exit(0);
    } catch (err) {
        console.error(`\n❌ Pipeline failed for ${stateName}:`, err);
        process.exit(1);
    }
}

const stateArg = process.argv[2];
if (stateArg) {
    runFullPipeline(stateArg);
} else {
    console.log('Usage: npx tsx scripts/master_harvester.ts "State Name"');
}
