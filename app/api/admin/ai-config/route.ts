import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AIConfig from '@/models/AIConfig';

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
      });
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    console.error('Error fetching AI Config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    let config = await AIConfig.findOne({});
    
    if (config) {
      config.apiKey = body.apiKey ?? config.apiKey;
      config.modelName = body.modelName ?? config.modelName;
      config.promptTemplate = body.promptTemplate ?? config.promptTemplate;
      config.temperature = body.temperature ?? config.temperature;
      config.maxTokens = body.maxTokens ?? config.maxTokens;
      await config.save();
    } else {
      config = await AIConfig.create(body);
    }

    return NextResponse.json({ success: true, data: config });
  } catch (error: any) {
    console.error('Error updating AI Config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
