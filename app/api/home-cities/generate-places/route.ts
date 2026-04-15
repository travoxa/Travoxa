import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { generateAIResponse } from '@/lib/ai-service';
import AIConfig from '@/models/AIConfig';
import HomeCity from '@/models/HomeCity';
import { fetchPlaceDetails } from '@/utils/wikipedia';
import mongoose from 'mongoose';

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
    const { cityId, cityName, lat, lon } = await req.json();

    if (!cityId || !cityName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // 1. Check if HomeCity already has populated touristPlaces
    const city = await HomeCity.findById(cityId);
    if (!city) {
      return NextResponse.json({ success: false, error: 'HomeCity not found' }, { status: 404 });
    }

    const minPlaces = 6;
    const existingPlaces = city.touristPlaces || [];
    
    // If we already have enough places, just return them
    if (existingPlaces.length >= minPlaces) {
      console.log(`Serving ${existingPlaces.length} cached touristPlaces for city: ${cityName}`);
      return NextResponse.json({ success: true, data: existingPlaces, source: 'cache_city' });
    }

    console.log(`City ${cityName} has only ${existingPlaces.length} places. Supplementing with AI...`);

    // 2. Fetch Config securely from DB
    const config = await AIConfig.findOne({});
    if (!config || (config.provider === 'openrouter' && !config.apiKey) || (config.provider === 'google' && !config.googleApiKey)) {
        return NextResponse.json({ success: false, error: `AI ${config?.provider || 'OpenRouter'} API Key is not configured on the server.` }, { status: 500 });
    }

    // 3. Compile AI Prompt specifically for city places
    let userPrompt = config.cityPromptTemplate || `Find top 10 sightseeing places in {cityName}. Return JSON array where objects have name, description, lat, lon and category.`;
    
    userPrompt = userPrompt.replace(/\{cityName\}/g, cityName || '');

    // 4. Call Unified AI Service
    let aiResponse;
    try {
        aiResponse = await generateAIResponse([
            { role: 'system', content: 'You are a precise AI travel assistant. You ONLY output an array of raw JSON objects representing places (e.g., [{"name": "...", "description": "...", "lat": 12.3, "lon": 45.6, "category": "Monument"}]). No markdown, no introductory text.' },
            { role: 'user', content: userPrompt }
        ], {
            response_format: { type: 'json_object' }
        });
    } catch (apiError) {
        console.error("AI Service Error", apiError);
        return NextResponse.json({ success: false, error: 'AI generation failed' }, { status: 500 });
    }

    let messageContent = aiResponse.content || '[]';
    
    // Strip possible hallucinated markdown wrapper
    messageContent = messageContent.replace(/```json/g, '').replace(/```/g, '').trim();

    let aiPlaces = [];
    try {
        aiPlaces = JSON.parse(messageContent);
        if (!Array.isArray(aiPlaces)) {
            if (aiPlaces.recommendations) aiPlaces = aiPlaces.recommendations;
            else if (aiPlaces.places) aiPlaces = aiPlaces.places;
            else aiPlaces = [aiPlaces]; // Last resort wrap
        }
    } catch (e) {
        console.error("Failed to parse JSON from AI", messageContent);
        return NextResponse.json({ success: false, error: 'Model returned unparseable text format' }, { status: 500 });
    }

    // 5. Enrich & Format Data (Inject Wikipedia Images)
    console.log(`Received ${aiPlaces.length} specific places for ${cityName} from AI. Enriching with Wikipedia images...`);
    const finalResults = await Promise.all(aiPlaces.map(async (place: any, index: number) => {
        const placeLat = parseFloat(place.lat) || lat || 0;
        const placeLon = parseFloat(place.lon) || lon || 0;
        
        let dist = 0;
        if (lat && lon) {
             dist = calculateDistance(lat, lon, placeLat, placeLon);
        }

        const wiki = await fetchPlaceDetails(place.name);

        return {
            _id: new mongoose.Types.ObjectId().toHexString(),
            name: place.name || "Unknown Place",
            description: wiki.summary || place.description || "A beautiful place to visit.",
            image: wiki.image || null,
            location: {
                type: "Point",
                coordinates: [placeLon, placeLat]
            },
            distance: dist,
            category: place.category || 'Sightseeing',
            tags: [place.category || 'Attraction', cityName],
            source: 'city_ai',
            score: (100 - index)
        };
    }));

    const validResults = finalResults.filter(p => p.name !== "Unknown Place");

    // 6. Merge & Save results directly to HomeCity (Prioritize manual entries)
    if (validResults.length > 0) {
        const manualPlaces = existingPlaces.filter((p: any) => p.source === 'manual');
        // Filter AI places to not duplicate manual ones by name
        const uniqueAiPlaces = validResults.filter((ai: any) => 
            !manualPlaces.some((m: any) => m.name.toLowerCase() === ai.name.toLowerCase())
        );
        
        city.touristPlaces = [...manualPlaces, ...uniqueAiPlaces];
        await city.save();
    }

    return NextResponse.json({ success: true, data: city.touristPlaces, source: 'hybrid_city_ai' });

  } catch (error: any) {
    console.error('AI City Places Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
