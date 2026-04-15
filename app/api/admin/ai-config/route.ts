import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AIConfig from '@/models/AIConfig';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

function normalizeStopSequences(value: unknown) {
  if (!Array.isArray(value)) return undefined;
  return value.map((item) => String(item).trim()).filter(Boolean);
}

export async function GET() {
  try {
    await connectDB();
    let config = await AIConfig.findOne({});
    
    if (!config) {
      // Create a default one if it doesn't exist
      config = await AIConfig.create({
        apiKey: "",
        modelName: "google/gemini-2.0-flash-lite-preview-02-05:free",
        promptTemplate: `You are an AI travel assistant helping users find optimal locations. The user is looking for a $\{primaryType\} destination near $\{{lat: departure.lat, lon: departure.lon}\}. Provide top 5 detailed location recommendations in JSON.`,
        cityPromptTemplate: `Find top 10 sightseeing places in {cityName}. Return JSON array where objects have name, description, lat, lon and category.`,
        topP: null,
        topK: null,
        thinkingBudget: null,
        stopSequences: [],
        responseSchema: null,
      });
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error: unknown) {
    console.error('Error fetching AI Config:', error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    let config = await AIConfig.findOne({});
    
    if (config) {
      config.provider = body.provider ?? config.provider;
      config.apiKey = body.apiKey ?? config.apiKey;
      config.modelName = body.modelName ?? config.modelName;
      config.googleApiKey = body.googleApiKey ?? config.googleApiKey;
      config.googleModelName = body.googleModelName ?? config.googleModelName;
      config.promptTemplate = body.promptTemplate ?? config.promptTemplate;
      config.cityPromptTemplate = body.cityPromptTemplate ?? config.cityPromptTemplate;
      config.temperature = body.temperature ?? config.temperature;
      config.maxTokens = body.maxTokens ?? config.maxTokens;
      config.topP = body.topP ?? config.topP;
      config.topK = body.topK ?? config.topK;
      config.thinkingBudget = body.thinkingBudget ?? config.thinkingBudget;
      config.stopSequences = normalizeStopSequences(body.stopSequences) ?? config.stopSequences;
      config.responseSchema = body.responseSchema ?? config.responseSchema;
      await config.save();
    } else {
      config = await AIConfig.create({
        ...body,
        stopSequences: normalizeStopSequences(body.stopSequences) ?? [],
      });
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error: unknown) {
    console.error('Error updating AI Config:', error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
