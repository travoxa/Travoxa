import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AIConfig from '@/models/AIConfig';
import RecommendationCache from '@/models/RecommendationCache';
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
    const { primaryType, secondaryTypes, departure } = await req.json();

    if (!primaryType || !departure) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // 1. Prepare Cache Key
    const sortedSecondaries = secondaryTypes && secondaryTypes.length > 0 ? [...secondaryTypes].sort().join('-') : 'none';
    const cacheKey = `ai_v2-${primaryType}-${sortedSecondaries}-${departure.lat.toFixed(2)}-${departure.lon.toFixed(2)}`;
    
    // Fetch existing cache but don't return yet
    const cachedResult = await RecommendationCache.findOne({ key: cacheKey });
    const existingPayload = (cachedResult && cachedResult.rawPayload) ? cachedResult.rawPayload : [];
    
    // 2. Fetch Config securely from DB
    const config = await AIConfig.findOne({});
    if (!config || !config.apiKey) {
        return NextResponse.json({ success: false, error: 'AI OpenRouter API Key is not configured on the server.' }, { status: 500 });
    }

    // 3. Compile AI Prompt
    let userPrompt = config.promptTemplate || `Find top 5 location recommendations for primaryType: {primaryType} near {lat}, {lon}. Return JSON array where objects have name, description, lat, lon.`;
    
    userPrompt = userPrompt.replace(/\{primaryType\}/g, primaryType || '')
                           .replace(/\{lat\}/g, departure.lat.toString() || '')
                           .replace(/\{lon\}/g, departure.lon.toString() || '')
                           .replace(/\{departureName\}/g, departure.name || '');

    if (secondaryTypes && secondaryTypes.length > 0) {
      userPrompt += ` Consider secondary preferences: ${secondaryTypes.join(', ')}.`;
    }

    // 4. Secure OpenRouter Direct Call
    const payload = {
        model: config.modelName || "google/gemini-2.0-flash-lite-preview-02-05:free",
        messages: [
            { role: 'system', content: 'You are a precise AI travel assistant. You ONLY output an array of raw JSON objects representing places (e.g., [{"name": "...", "description": "...", "lat": 12.3, "lon": 45.6}]). No markdown, no introductory text.' },
            { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
    };

    console.log(`Making secure OpenRouter call to ${payload.model} for ${primaryType}...`);
    const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://www.travoxa.in',
            'X-Title': 'Travoxa Backend AI'
        },
        body: JSON.stringify(payload)
    });

    if (!openRouterResponse.ok) {
        const errorData = await openRouterResponse.text();
        console.error("Openrouter Error", errorData);
        // Fallback to cache if AI fails
        if (existingPayload.length > 0) {
            console.log("AI failed, falling back to cache content.");
            return NextResponse.json({ success: true, data: existingPayload, source: 'cache_fallback' });
        }
        return NextResponse.json({ success: false, error: 'AI generation failed from OpenRouter' }, { status: 500 });
    }

    const aiData = await openRouterResponse.json();
    let messageContent = aiData.choices[0]?.message?.content || '[]';
    
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
        // Fallback to cache if parse fails
        if (existingPayload.length > 0) {
            return NextResponse.json({ success: true, data: existingPayload, source: 'cache_fallback_parse_error' });
        }
        return NextResponse.json({ success: false, error: 'Model returned unparseable text format' }, { status: 500 });
    }

    // 5. Enrich & Format Data (Inject Wikipedia Images)
    console.log(`Received ${aiPlaces.length} places from AI. Enriching with Wikipedia images...`);
    const freshResults = await Promise.all(aiPlaces.map(async (place: any, index: number) => {
        const lat = parseFloat(place.lat) || departure.lat;
        const lon = parseFloat(place.lon) || departure.lon;
        const dist = calculateDistance(departure.lat, departure.lon, lat, lon);

        // Run place through Wikipedia exactly like the old logic to get image/summary
        const wiki = await fetchPlaceDetails(place.name);

        return {
            _id: new mongoose.Types.ObjectId().toHexString(), // Generate a fake Mongoose _id so React Native renders keys properly
            name: place.name || "Unknown Place",
            description: wiki.summary || place.description || "A beautiful place to visit.",
            image: wiki.image || null,
            location: {
                type: "Point",
                coordinates: [lon, lat]
            },
            distance: dist,
            category: place.category || primaryType,
            tags: [primaryType, ...(secondaryTypes || [])],
            source: 'ai_direct',
            score: (100 - index) // Arbitrary score based on AI output order
        };
    }));

    // Filter out generic bad drops
    const validFreshResults = freshResults.filter(p => p.name !== "Unknown Place");

    // 6. Merge with Cache (Priority to Fresh Results)
    const mergedResults = [...validFreshResults];
    const freshNames = new Set(validFreshResults.map(p => p.name.toLowerCase().trim()));

    for (const cachedPlace of existingPayload) {
        if (!freshNames.has(cachedPlace.name.toLowerCase().trim())) {
            mergedResults.push(cachedPlace);
        }
    }

    // Limit total results to 12 for performance/UI
    const finalResults = mergedResults.slice(0, 12);

    // 7. Save merged results into RecommendationCache
    if (finalResults.length > 0) {
        await RecommendationCache.updateOne(
            { key: cacheKey },
            { 
                $set: { 
                    rawPayload: finalResults,
                    preferences: { primaryType, secondaryTypes, departure }
                } 
            },
            { upsert: true }
        );
    }

    return NextResponse.json({ 
        success: true, 
        data: finalResults, 
        source: validFreshResults.length > 0 ? 'fresh_ai_merged' : 'cache_only' 
    });

  } catch (error: any) {
    console.error('AI Recommendation Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
