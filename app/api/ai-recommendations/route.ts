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
    if (cachedResult) {
      console.log('Serving from cache:', cacheKey);
      return NextResponse.json({ success: true, data: cachedResult.results, source: 'cache' });
    }

    // 2. Query MongoDB for existing places
    // Search in primary and secondary categories
    const categoriesToSearch = [primaryType, ...secondaryTypes];
    
    // We'll search in a radius of 1000km to find good results
    let places = await Place.find({
      category: { $in: categoriesToSearch },
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [departure.lon, departure.lat] },
          $maxDistance: 1000 * 1000 // 1000km in meters
        }
      }
    }).limit(50);

    // 3. IF low density (< 10), fetch from OSM
    if (places.length < 10) {
      console.log('Low mongo data, fetching from OSM...');
      const osmPlaces = await fetchPlacesFromOSM(departure.lat, departure.lon, primaryType, 500000); // 500km radius
      
      // Add each new OSM place to MongoDB
      for (const osmPlace of osmPlaces) {
        try {
          // Check for existing place
          const existing = await Place.findOne({ 
             $or: [
                 { osmId: osmPlace.osmId },
                 { name: osmPlace.name, category: osmPlace.category }
             ]
          });

          if (!existing) {
             // Create and enrich with Wikipedia
             const wiki = await fetchPlaceDetails(osmPlace.name);
             const newPlace = await Place.create({
                ...osmPlace,
                location: {
                    type: "Point",
                    coordinates: [osmPlace.lon, osmPlace.lat]
                },
                description: wiki.summary,
                image: wiki.image,
                source: 'osm'
             });
             places.push(newPlace);
          } else {
             places.push(existing);
          }
        } catch (err) {
          console.error('Error adding OSM place:', err);
        }
      }
    }

    // 4. Enrich Wikipedia for top 10 if missing
    for (let i = 0; i < Math.min(places.length, 10); i++) {
        if (!places[i].description || !places[i].image) {
            const wiki = await fetchPlaceDetails(places[i].name);
            places[i].description = wiki.summary || places[i].description;
            places[i].image = wiki.image || places[i].image;
            await places[i].save();
        }
    }

    // 5. Scoring Logic
    const scoredPlaces = places.map((place: any) => {
      let score = 0;
      
      // Match primary category
      if (place.category === primaryType) score += 50;
      
      // Match secondary categories
      secondaryTypes.forEach((type: string) => {
        if (place.category === type || (place.tags && place.tags.includes(type))) {
          score += 20;
        }
      });

      // Distance bonus
      const dist = calculateDistance(departure.lat, departure.lon, place.location.coordinates[1], place.location.coordinates[0]);
      
      // Max bonus is 30, it decreases as distance increases (closer is better)
      const distanceBonus = Math.max(0, 30 - (dist / 10)); // e.g. 0km = +30, 300km = +0
      score += distanceBonus;

      return { ...place.toObject(), score, distance: dist };
    });

    // 6. Sort by Score and Return top 20
    const topResults = scoredPlaces
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    // 7. Save to Cache
    await RecommendationCache.create({
        key: cacheKey,
        results: topResults.map(p => p._id),
        preferences: { primaryType, secondaryTypes, departure }
    });

    return NextResponse.json({ success: true, data: topResults, source: 'fresh' });

  } catch (error: any) {
    console.error('AI Recommendation endpoint error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
