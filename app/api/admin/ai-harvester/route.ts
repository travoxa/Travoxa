import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Place from '@/models/Place';
import { fetchPlaceDetails } from '@/utils/wikipedia';
import { scrapeMapsPlace } from '@/lib/maps-scraper';

/**
 * Searches OSM Nominatim for a location by name
 */
/**
 * Searches OSM Nominatim for a location by name
 */
async function searchOSMByName(name: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}&addressdetails=1&limit=1&accept-language=en`;
    const res = await fetch(url, {
        headers: { 'User-Agent': 'Travoxa-Admin-Harvester' }
    });
    const data = await res.json();
    return data && data.length > 0 ? data[0] : null;
}

/**
 * Extracts coordinates and place name from a Google Maps URL
 */
function extractFromMapsUrl(url: string) {
    // 1. Try to find coordinates (@lat,lon)
    const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    
    // 2. Try to find place name (/place/Name+Of+Place)
    const nameMatch = url.match(/\/place\/([^\/]+)\//);
    const placeName = nameMatch ? decodeURIComponent(nameMatch[1].replace(/\+/g, ' ')) : null;

    return {
        lat: coordMatch?.[1] ? parseFloat(coordMatch[1]) : null,
        lon: coordMatch?.[2] ? parseFloat(coordMatch[2]) : null,
        name: placeName
    };
}

/**
 * Resolves a shortened Google Maps URL to its final URL
 */
async function resolveShortUrl(shortUrl: string) {
    try {
        const response = await fetch(shortUrl, { 
            method: 'HEAD',
            redirect: 'follow',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36' }
        });
        return response.url;
    } catch (error) {
        console.error('Error resolving URL:', error);
        return shortUrl;
    }
}

/**
 * Reverse geocodes coordinates to get the official name and area
 */
async function reverseGeocode(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&accept-language=en`;
    const res = await fetch(url, {
        headers: { 'User-Agent': 'Travoxa-Admin-Harvester' }
    });
    return await res.json();
}

export async function POST(req: Request) {
    try {
        const { action, locationName, url, placeData } = await req.json();

        if (action === 'fetch') {
            let searchName = locationName;
            let coords = null;
            let scrapedData = null;

            // Handle URL input
            if (url) {
                // NEW: If it's a direct Google Maps /place/ URL, use the Playwright scraper
                if (url.includes('/maps/place/')) {
                    try {
                        scrapedData = await scrapeMapsPlace(url);
                        return NextResponse.json({ success: true, data: scrapedData });
                    } catch (err) {
                        console.error('Playwright scraping failed, falling back to basic extraction:', err);
                    }
                }

                // Fallback / legacy logic for other URLs (goo.gl, search links, etc.)
                let resolvedUrl = url;
                if (url.includes('goo.gl') || url.includes('maps.app')) {
                    resolvedUrl = await resolveShortUrl(url);
                }
                
                const extracted = extractFromMapsUrl(resolvedUrl);
                if (extracted.lat && extracted.lon) {
                    coords = { lat: extracted.lat, lon: extracted.lon };
                }
                if (extracted.name) {
                    searchName = extracted.name;
                }

                // If no name found but we have coords, reverse geocode
                if (!searchName && coords) {
                    const reverse = await reverseGeocode(coords.lat, coords.lon);
                    searchName = reverse.display_name.split(',')[0];
                }
            }

            if (!searchName && !coords) {
                return NextResponse.json({ success: false, error: 'Either Name or valid Maps URL is required' }, { status: 400 });
            }

            // 1. Fetch from OSM (Nominatim) for coordinates and official name if we don't have them
            let osmData = null;
            if (coords) {
                // If we have coords from URL, we can use them as primary truth
                const reverse = await reverseGeocode(coords.lat, coords.lon);
                osmData = reverse;
            } else {
                osmData = await searchOSMByName(searchName);
            }

            if (!osmData) {
                return NextResponse.json({ success: false, error: 'Location not found on OpenStreetMap' }, { status: 404 });
            }

            const name = osmData.display_name?.split(',')[0] || osmData.name || searchName;

            // 2. Fetch from Wikipedia for description and image
            const wikiData = await fetchPlaceDetails(name);

            // 3. Construct the result
            const result = {
                name: name,
                category: 'Sightseeing', // Default
                description: wikiData.summary || 'Details for this place will be added soon.',
                location: {
                    type: "Point",
                    coordinates: coords 
                        ? [coords.lon, coords.lat] 
                        : [parseFloat(osmData.lon), parseFloat(osmData.lat)]
                },
                area: osmData.address?.city || osmData.address?.town || osmData.address?.village || osmData.display_name?.split(',')[1]?.trim() || '',
                district: osmData.address?.state || osmData.address?.county || '',
                tags: [osmData.type, osmData.class, ...(osmData.address?.suburb ? [osmData.address.suburb] : [])].filter(Boolean),
                image: wikiData.image || '',
                source: 'manual'
            };

            return NextResponse.json({ success: true, data: result });
        }

        if (action === 'seed') {
            if (!placeData) {
                return NextResponse.json({ success: false, error: 'Place data is required for seeding' }, { status: 400 });
            }

            await connectDB();

            // Check if place already exists (by name and area/district)
            const existing = await Place.findOne({
                name: placeData.name,
                district: placeData.district,
                area: placeData.area
            });

            if (existing) {
                return NextResponse.json({ success: false, error: 'A place with this name already exists in this area.' }, { status: 409 });
            }

            const newPlace = await Place.create(placeData);
            return NextResponse.json({ success: true, data: newPlace });
        }

        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

    } catch (error: any) {
        console.error('AI Harvester Error:', error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || 'An unexpected error occurred' 
        }, { status: 500 });
    }
}
