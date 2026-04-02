import fs from 'fs';
import path from 'path';
import { fetchLandmarksAround } from '../utils/osm';

/**
 * LOCAL-SOURCE CHECKLIST HARVESTER (V3)
 * 
 * Uses the project's existing 'data/india-locations.json' as the source of truth.
 * Finds landmarks near each city listed in that file.
 */

async function geocodeCity(cityName: string, stateName: string): Promise<{ lat: number, lon: number } | null> {
    const query = `${cityName}, ${stateName}, India`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Travoxa-Data-Harvester/1.0' }
        });
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        }
    } catch (err) {
        console.error(`❌ Geocoding failed for ${cityName}:`, err);
    }
    return null;
}

export async function harvestState(stateName: string) {
    const locationsPath = path.join(process.cwd(), 'data', 'india-locations.json');
    if (!fs.existsSync(locationsPath)) {
        console.error(`Local location file not found at ${locationsPath}`);
        return;
    }
    const allLocations = JSON.parse(fs.readFileSync(locationsPath, 'utf8'));
    const cities = allLocations[stateName];
    if (!cities || !Array.isArray(cities)) {
        console.error(`No cities found for state: ${stateName} in local data.`);
        return;
    }
    console.log(`🚀 Starting Local-Source Harvester for: ${stateName}`);
    console.log(`📍 Found ${cities.length} cities in your project data.`);
    const allLandmarks: any[] = [];
    for (let i = 0; i < cities.length; i++) {
        const cityName = cities[i];
        const progress = `[${i + 1}/${cities.length}]`;
        process.stdout.write(`${progress} Geocoding ${cityName}... `);
        const coords = await geocodeCity(cityName, stateName);
        if (!coords) {
            process.stdout.write(`❌ Failed to find location.\n`);
            continue;
        }
        process.stdout.write(`📍 Found at ${coords.lat}, ${coords.lon}. Searching landmarks... `);
        const landmarks = await fetchLandmarksAround(coords.lat, coords.lon);
        if (landmarks.length > 0) {
            process.stdout.write(`✅ Found ${landmarks.length} landmarks.\n`);
            allLandmarks.push(...landmarks.map(l => ({ 
                ...l, 
                parentCity: cityName, 
                parentState: stateName 
            })));
        } else {
            process.stdout.write(`⏹️ None found.\n`);
        }
        await new Promise(resolve => setTimeout(resolve, 1200));
    }
    const uniqueLandmarks = Array.from(new Map(allLandmarks.map(l => [l.osmId, l])).values());
    const discoveryData = {
        state: stateName,
        lastUpdated: new Date().toISOString(),
        source: 'local_india_locations_json',
        totalLandmarks: uniqueLandmarks.length,
        landmarks: uniqueLandmarks
    };
    const outputPath = path.join(process.cwd(), 'data', 'discovery', `${stateName.toLowerCase()}_landmarks.json`);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(discoveryData, null, 2));
    console.log(`\n🎉 Discovery Phase Complete for ${stateName}!`);
    console.log(`📦 Saved ${uniqueLandmarks.length} unique landmarks to: ${outputPath}`);
    return uniqueLandmarks;
}

if (require.main === module) {
    const stateArg = process.argv[2];
    if (stateArg) {
        harvestState(stateArg).catch(e => console.error(e));
    } else {
        console.log('Usage: npx tsx scripts/checklist_harvester.ts "State Name"');
    }
}
