import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import AIConfig from '@/models/AIConfig';

export async function POST(req: Request) {
  try {
    const { primaryType, secondaryTypes, departure, overrideConfig } = await req.json();

    let apiKey = overrideConfig?.USE_LOCAL_CONFIG ? overrideConfig.API_KEY : '';
    let modelName = overrideConfig?.USE_LOCAL_CONFIG ? overrideConfig.MODEL : '';
    let promptTemplate = overrideConfig?.USE_LOCAL_CONFIG ? overrideConfig.PROMPT : '';

    if (!overrideConfig?.USE_LOCAL_CONFIG) {
        await connectDB();
        const config = await AIConfig.findOne({});
        if (config) {
            apiKey = config.apiKey;
            modelName = config.modelName;
            promptTemplate = config.promptTemplate;
        } else {
            return NextResponse.json({ success: false, error: 'No AI Configuration found in DB and local override is false.' }, { status: 400 });
        }
    }

    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'API Key is missing.' }, { status: 400 });
    }

    // Basic string replacement for the prompt template
    let userPrompt = promptTemplate || `Find top 5 location recommendations for primaryType: $\{primaryType\} near \{lat: $\{departure?.lat\}, lon: $\{departure?.lon\}\}. Return as JSON array.`;
    
    // Inject variables if they are templated like \{primaryType\}
    userPrompt = userPrompt.replace(/\{primaryType\}/g, primaryType || '')
                           .replace(/\{lat\}/g, departure?.lat || '')
                           .replace(/\{lon\}/g, departure?.lon || '')
                           .replace(/\{departureName\}/g, departure?.name || '');

    // Include secondary types context
    if (secondaryTypes && secondaryTypes.length > 0) {
      userPrompt += ` Also consider secondary preferences: ${secondaryTypes.join(', ')}.`;
    }

    const payload = {
      model: modelName || "google/gemini-2.0-flash-lite-preview-02-05:free",
      messages: [
        { role: 'system', content: 'You are an AI travel assistant that provides accurate location recommendations.' },
        { role: 'user', content: userPrompt }
      ],
      // OpenRouter standard formats to try and get JSON
      response_format: { type: 'json_object' }
    };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const messageContent = data.choices[0]?.message?.content || '{}';

    let parsedResult;
    try {
        parsedResult = JSON.parse(messageContent);
    } catch (e) {
        // If not valid JSON, just return the raw text
        parsedResult = messageContent;
    }

    return NextResponse.json({ 
      success: true, 
      originalPrompt: userPrompt, 
      data: parsedResult,
      rawContent: messageContent,
      fullResponse: data
    });

  } catch (error: any) {
    console.error('AI Test API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
