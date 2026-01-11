import { NextResponse } from "next/server";
import { openrouter, MODEL_NAME } from "@/lib/openrouter";
import { PHASE_PROMPTS, QuestionnairePhase } from "@/lib/ai-trip-planner/prompts";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, current_profile, current_phase } = body;

        // Default to ORIGIN phase if not provided
        const phase = current_phase || QuestionnairePhase.ORIGIN;

        // Get the specific system prompt for this phase
        const systemPrompt = PHASE_PROMPTS[phase as QuestionnairePhase] || PHASE_PROMPTS[QuestionnairePhase.ORIGIN];

        // Current profile state
        const currentProfile = current_profile || {};

        const prompt = `
            ${systemPrompt}
            
            **Current Profile State:**
            ${JSON.stringify(currentProfile, null, 2)}
            
            **Conversation History (Last 10 messages):**
            ${JSON.stringify(messages?.slice(-10) || [], null, 2)}
        `;

        try {
            const completion = await openrouter.chat.completions.create({
                model: MODEL_NAME,
                messages: [
                    { role: "system", content: "You are a smart travel assistant that outputs JSON." },
                    { role: "user", content: prompt },
                ],
                response_format: { type: "json_object" },
            });

            const result = completion.choices[0].message.content;

            let parsedResult;
            try {
                parsedResult = JSON.parse(result || "{}");
            } catch (e) {
                console.error("Failed to parse AI response:", result);
                throw new Error("Invalid JSON response");
            }

            return NextResponse.json(parsedResult);
        } catch (apiError) {
            console.error("API Error (falling back to mock):", apiError);

            // Fallback mock response if API fails
            return NextResponse.json({
                next_step: "question",
                question: "I'm having a bit of trouble connecting. Could you repeat that?",
                step_completed: false,
                profile_update: {}
            });
        }
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
