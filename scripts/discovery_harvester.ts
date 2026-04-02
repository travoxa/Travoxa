import fs from 'fs';
import path from 'path';
import { fetchTownsByAreaId, fetchLandmarksAround } from '../utils/osm';

/**
 * PHASE 1: TARGETED DISCOVERY HARVESTER (V2)
 * 
 * Instead of scanning the whole state (which causes timeouts),
 * we find all towns/villages first and then search around each one.
 */

const STATE_CONFIG = {
  'Goa': [
    { name: 'North Goa', id: 3601997190 },
    { name: 'South Goa', id: 3601997191 }
  ],
  'Himachal Pradesh': [
    { name: 'Shimla', id: 3603417757 },
    { name: 'Kullu', id: 3603417758 }
  ],
  'Kerala': [
    { name: 'Idukki', id: 3600644026 },
    { name: 'Wayanad', id: 3601332727 }
  ]
};

async function harvestState(stateName: string) {
  const districts = STATE_CONFIG[stateName as keyof typeof STATE_CONFIG];
  if (!districts) {
    console.error(`State config for ${stateName} not found.`);
    return;
  }

  console.log(`🚀 Starting TARGETED Discovery Pass for: ${stateName}`);
  const allDiscoveredPlaces: any[] = [];

  for (const district of districts) {
    console.log(`\n--- Processing District: ${district.name} ---`);
    
    // Step 1: Find all towns in this district
    console.log(`🔍 Step 1: Identifying settlements in ${district.name}...`);
    const towns = await fetchTownsByAreaId(district.id);
    
    if (towns.length === 0) {
      console.log(`⚠️ No towns found in ${district.name}. Skipping...`);
      continue;
    }

    // Step 2: Loop through each town and find landmarks
    console.log(`🔍 Step 2: Scanning around ${towns.length} towns/villages...`);
    
    for (let i = 0; i < towns.length; i++) {
      const town = towns[i];
      const progress = `[${i + 1}/${towns.length}]`;
      
      process.stdout.write(`${progress} Searching near ${town.name}... `);
      
      const landmarks = await fetchLandmarksAround(town.lat, town.lon);
      
      if (landmarks.length > 0) {
        process.stdout.write(`✅ Found ${landmarks.length} landmarks.\n`);
        // Simple log of some names to show it's working
        const examples = landmarks.slice(0, 3).map(l => l.name).join(', ');
        console.log(`   ✨ Highlights: ${examples}${landmarks.length > 3 ? '...' : ''}`);
        
        allDiscoveredPlaces.push(...landmarks);
      } else {
        process.stdout.write(`⏹️ None found.\n`);
      }

      // Small delay to be kind to the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Deduplicate and Save
  const uniquePlaces = Array.from(new Map(allDiscoveredPlaces.map(p => [p.osmId, p])).values());
  
  const discoveryData = {
    state: stateName,
    lastUpdated: new Date().toISOString(),
    totalCount: uniquePlaces.length,
    places: uniquePlaces
  };

  const outputPath = path.join(process.cwd(), 'data', 'discovery', `${stateName.toLowerCase()}_discovery.json`);
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(discoveryData, null, 2));
  
  console.log(`\n🎉 Discovery Phase Complete for ${stateName}!`);
  console.log(`📦 Saved ${uniquePlaces.length} unique landmarks to: ${outputPath}`);
}

// Check arguments
const arg = process.argv[2];
if (arg) {
  harvestState(arg).catch(e => console.error(e));
} else {
  console.log('Usage: npx tsx scripts/discovery_harvester.ts "State Name"');
}
