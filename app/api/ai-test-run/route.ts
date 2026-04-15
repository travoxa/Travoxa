import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { generateAIResponse } from '@/lib/ai-service';
import AIConfig from '@/models/AIConfig';

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown error';
}

export async function POST(req: Request) {
  try {
    const {
      primaryType,
      secondaryTypes,
      departure,
      overrideConfig,
      generationConfig,
    } = await req.json();

    let promptTemplate = overrideConfig?.USE_LOCAL_CONFIG ? overrideConfig.PROMPT : '';

    if (!overrideConfig?.USE_LOCAL_CONFIG) {
        await connectDB();
        const config = await AIConfig.findOne({});
        if (config) {
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
        const aiOptions: {
          temperature?: number;
          maxTokens?: number;
          topP?: number;
          topK?: number;
          thinkingBudget?: number;
          stopSequences?: string[];
          responseSchema?: unknown;
          response_format: { type: 'json_object' };
          overrideConfig?: {
            provider?: 'openrouter' | 'google';
            apiKey?: string;
            modelName?: string;
          };
        } = {
            response_format: { type: 'json_object' }
        };

        if (typeof generationConfig?.temperature === 'number') aiOptions.temperature = generationConfig.temperature;
        if (typeof generationConfig?.maxTokens === 'number') aiOptions.maxTokens = generationConfig.maxTokens;
        if (typeof generationConfig?.topP === 'number') aiOptions.topP = generationConfig.topP;
        if (typeof generationConfig?.topK === 'number') aiOptions.topK = generationConfig.topK;
        if (typeof generationConfig?.thinkingBudget === 'number') aiOptions.thinkingBudget = generationConfig.thinkingBudget;
        if (Array.isArray(generationConfig?.stopSequences) && generationConfig.stopSequences.length > 0) {
          aiOptions.stopSequences = generationConfig.stopSequences;
        }
        if (generationConfig?.responseSchema) {
          aiOptions.responseSchema = generationConfig.responseSchema;
        }

        if (overrideConfig?.USE_LOCAL_CONFIG) {
            aiOptions.overrideConfig = {
                provider: overrideConfig.PROVIDER || 'openrouter',
                apiKey: overrideConfig.API_KEY,
                modelName: overrideConfig.MODEL
            };
        }

        aiResponse = await generateAIResponse([
            { role: 'system', content: 'You are an AI travel assistant. Return only valid JSON with no markdown or commentary. If the user asks for a list of places, return a bare JSON array.' },
            { role: 'user', content: userPrompt }
        ], aiOptions);
    } catch (apiError: unknown) {
        console.error("AI Service Error", apiError);
        throw new Error(`AI Service Error: ${getErrorMessage(apiError)}`);
    }

    const messageContent = aiResponse.content || '{}';
    const data = aiResponse.raw;

    let parsedResult;
    try {
        parsedResult = JSON.parse(messageContent);
    } catch {
        // If not valid JSON, just return the raw text
        parsedResult = messageContent;
    }

    return NextResponse.json({ 
      success: true, 
      originalPrompt: userPrompt, 
      data: parsedResult,
      rawContent: messageContent,
      generationConfig: generationConfig || null,
      finishReason: aiResponse.finishReason || data?.candidates?.[0]?.finishReason || null,
      usageMetadata: aiResponse.usageMetadata || data?.usageMetadata || null,
      fullResponse: data
    });

  } catch (error: unknown) {
    console.error('AI Test API error:', error);
    return NextResponse.json({ success: false, error: getErrorMessage(error) }, { status: 500 });
  }
}
