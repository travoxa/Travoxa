import { openrouter } from "./openrouter";
import AIConfig from "@/models/AIConfig";
import { connectDB } from "./mongodb";

export interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}

export interface AIResponse {
    content: string | null;
    raw?: any;
}

export async function generateAIResponse(
    messages: Message[],
    options: {
        temperature?: number;
        maxTokens?: number;
        response_format?: { type: "json_object" };
        overrideConfig?: {
            provider?: 'openrouter' | 'google';
            apiKey?: string;
            modelName?: string;
        }
    } = {}
): Promise<AIResponse> {
    await connectDB();
    const dbConfig = await AIConfig.findOne({});

    const provider = options.overrideConfig?.provider || dbConfig?.provider || "openrouter";
    const temperature = options.temperature ?? dbConfig?.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? dbConfig?.maxTokens ?? 1000;

    if (provider === "google") {
        return await callGoogleGemini(messages, {
            apiKey: options.overrideConfig?.apiKey || dbConfig?.googleApiKey,
            model: options.overrideConfig?.modelName || dbConfig?.googleModelName || "gemini-2.0-flash",
            temperature,
            maxTokens,
            responseFormat: options.response_format?.type
        });
    } else {
        // Default to OpenRouter
        const apiKey = options.overrideConfig?.apiKey || dbConfig?.apiKey || "";
        const model = options.overrideConfig?.modelName || dbConfig?.modelName || "google/gemini-2.0-flash-lite-preview-02-05:free";
        
        // We'll use a temporary OpenAI instance if an API key is provided, otherwise the default openrouter instance
        const client = apiKey ? new (require('openai'))({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: apiKey,
        }) : openrouter;

        const completion = await client.chat.completions.create({
            model: model,
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            temperature,
            max_tokens: maxTokens,
            response_format: options.response_format,
        });

        return {
            content: completion.choices[0].message.content,
            raw: completion
        };
    }
}

async function callGoogleGemini(
    messages: Message[],
    options: {
        apiKey?: string;
        model: string;
        temperature: number;
        maxTokens: number;
        responseFormat?: string;
    }
): Promise<AIResponse> {
    if (!options.apiKey) {
        throw new Error("Google API Key is not configured");
    }

    const systemMessage = messages.find(m => m.role === "system")?.content;
    const chatMessages = messages.filter(m => m.role !== "system");

    // Map roles: assistant -> model
    const contents = chatMessages.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
    }));

    const body: any = {
        contents,
        generationConfig: {
            temperature: options.temperature,
            maxOutputTokens: options.maxTokens,
        }
    };

    if (systemMessage) {
        body.systemInstruction = {
            parts: [{ text: systemMessage }]
        };
    }

    if (options.responseFormat === "json_object") {
        body.generationConfig.responseMimeType = "application/json";
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent?key=${options.apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Gemini API Error:", error);
        throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || null;

    return {
        content,
        raw: data
    };
}
