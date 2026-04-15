import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { generateAIResponse } from '@/lib/ai-service';
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

    // 4. Call Unified AI Service
    let aiResponse;
    try {
        const aiOptions: any = {
            response_format: { type: 'json_object' }
        };

        if (overrideConfig?.USE_LOCAL_CONFIG) {
            aiOptions.overrideConfig = {
                provider: overrideConfig.PROVIDER || 'openrouter',
                apiKey: overrideConfig.API_KEY,
                modelName: overrideConfig.MODEL
            };
        }

        aiResponse = await generateAIResponse([
            { role: 'system', content: 'You are an AI travel assistant that provides accurate location recommendations.' },
            { role: 'user', content: userPrompt }
        ], aiOptions);
    } catch (apiError: any) {
        console.error("AI Service Error", apiError);
        throw new Error(`AI Service Error: ${apiError.message}`);
    }

    const messageContent = aiResponse.content || '{}';
    const data = aiResponse.raw;

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
