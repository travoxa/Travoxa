import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Place from '@/models/Place';
import RecommendationCache from '@/models/RecommendationCache';
import { fetchPlacesFromOSM } from '@/utils/osm';
import { fetchPlaceDetails } from '@/utils/wikipedia';

// Haversine formula for distance calculation in KM
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; 
  return d;
}

export async function POST(req: Request) {
  try {
    const { primaryType, secondaryTypes, departure } = await req.json();

    if (!primaryType || !departure) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Generate cache key
    const sortedSecondaries = [...secondaryTypes].sort().join('-');
    const cacheKey = `${primaryType}-${sortedSecondaries}-${departure.lat.toFixed(2)}-${departure.lon.toFixed(2)}`;

    // 1. Check Cache
    const cachedResult = await RecommendationCache.findOne({ key: cacheKey }).populate('results');
    if (cachedResult && cachedResult.results && cachedResult.results.length > 0) {
      console.log('Serving from cache:', cacheKey);
      return NextResponse.json({ success: true, data: cachedResult.results, source: 'cache' });
    } else if (cachedResult) {
      // Clear empty cache to allow re-run
      await RecommendationCache.deleteOne({ key: cacheKey });
    }

    // 2. Query MongoDB for existing places
    // Search in primary and secondary categories, but also search in tags and name
    const categoriesToSearch = [primaryType, ...secondaryTypes];
    const searchRegex = new RegExp(primaryType, 'i');
    
    // We'll search in a radius of 1500km to find high-quality results
    let places = await Place.find({
      $or: [
        { category: { $in: categoriesToSearch } },
        { tags: { $in: categoriesToSearch } },
        { name: searchRegex }
      ],
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [departure.lon, departure.lat] },
          $maxDistance: 1500 * 1000 // 1500km in meters
        }
      }
    }).limit(60);

    // 3. IF low density (< 12), fetch from OSM
    if (places.length < 12) {
      console.log(`Low data (${places.length} found), fetching from OSM for: ${primaryType}`);
      const osmPlaces = await fetchPlacesFromOSM(departure.lat, departure.lon, primaryType, 300000); // 300km radius
      
      // Batch handle OSM places without Wikipedia enrichment initially to save time
      const newPlaces = [];
      for (const osmPlace of osmPlaces) {
        try {
          const existing = await Place.findOne({ 
             $or: [
                 { osmId: osmPlace.osmId },
                 { name: osmPlace.name, district: osmPlace.district }
             ]
          });

          if (!existing) {
             const newP = new Place({
                ...osmPlace,
                location: {
                    type: "Point",
                    coordinates: [osmPlace.lon, osmPlace.lat]
                },
                source: 'osm'
             });
             newPlaces.push(newP);
             places.push(newP);
          } else {
             places.push(existing);
          }
        } catch (err) {
          console.error('Error handling OSM place:', err);
        }
      }
      
      // Save new places in bulk
      if (newPlaces.length > 0) {
        await Place.insertMany(newPlaces, { ordered: false }).catch(e => console.log('Bulk insert partial success'));
      }
    }

    // 4. Scoring Logic (Fine-Tuned)
    const scoredPlaces = places.map((place: any) => {
      let score = 0;
      const placeName = place.name.toLowerCase();
      const primaryLow = primaryType.toLowerCase();
      
      // A. Relevance Scoring
      if (place.category === primaryType) score += 50;
      if (placeName.includes(primaryLow)) score += 30; // Strong match if style is in name (e.g. "Manali Hill")
      
      secondaryTypes.forEach((type: string) => {
        const typeLow = type.toLowerCase();
        if (place.category === type) score += 20;
        if (place.tags && place.tags.includes(type)) score += 15;
        if (placeName.includes(typeLow)) score += 10;
      });

      // B. Quality Scoring (Favor enriched data)
      if (place.description && place.description.length > 50) score += 15;
      if (place.image) score += 15;
      if (place.source === 'manual') score += 25; // Favor manually added/vetted content

      // C. Distance Scoring & Min Distance Check
      const dist = calculateDistance(departure.lat, departure.lon, place.location.coordinates[1], place.location.coordinates[0]);
      
      // EXCLUSION: If searching for Hill Station, skip anything closer than 100km (e.g. city attractions)
      if (primaryType === 'Hill Station' && dist < 100) return null;

      // Proximity bonus: max 40 points for being very close, decaying with distance
      const distanceBonus = Math.max(0, 40 * (1 - (dist / 1500))); 
      score += distanceBonus;

      // D. Elevation Bonus (Specific for Hill Stations)
      if (primaryType === 'Hill Station' && place.elevation) {
          if (place.elevation > 1500) score += 40;
          else if (place.elevation > 1000) score += 20;
      }

      return { ...place.toObject(), score, distance: dist };
    }).filter((p: any) => p !== null);

    // 5. Final Filtering & Ranking
    // Remove duplicates (by ID or name) and sort
    const uniquePlaces = Array.from(new Map(scoredPlaces.map(p => [p.name + p.category, p])).values());
    
    const topResults = uniquePlaces
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 20);

    // 6. Enrich top 5 remaining if they lack images (ensures premium UI)
    for (let i = 0; i < Math.min(topResults.length, 5); i++) {
        if (!topResults[i].description || !topResults[i].image) {
            const wiki = await fetchPlaceDetails(topResults[i].name);
            topResults[i].description = wiki.summary || topResults[i].description;
            topResults[i].image = wiki.image || topResults[i].image;
            // Update DB in background
            Place.findByIdAndUpdate(topResults[i]._id, { 
                description: topResults[i].description, 
                image: topResults[i].image 
            }).exec();
        }
    }

    // 7. Save to Cache (Only if we actually found something)
    if (topResults.length > 0) {
      await RecommendationCache.create({
          key: cacheKey,
          results: topResults.map((p: any) => p._id),
          preferences: { primaryType, secondaryTypes, departure }
      });
    }

    return NextResponse.json({ success: true, data: topResults, source: 'fresh' });

  } catch (error: any) {
    console.error('AI Recommendation endpoint error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
