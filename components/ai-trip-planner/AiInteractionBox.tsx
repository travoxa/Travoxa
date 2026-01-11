"use client";

import { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaMagic, FaStar, FaUser, FaClock, FaMoneyBillWave, FaMapMarkedAlt, FaSmile, FaCheckCircle, FaSave } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { QuestionnairePhase } from "@/lib/ai-trip-planner/prompts";

type Props = {
    onComplete?: () => void;
    initialProfile?: UserProfile | null;
};

type Message = {
    role: "user" | "assistant";
    content: string;
};

type UserProfile = {
    user_name?: string;
    origin_city?: string;
    group_size?: number;
    arrival_airport?: string;
    travel_style?: string;
    duration?: string;
    companions?: string;
    budget_tier?: string;
    transport_preference?: string;
    specific_interests?: string[];
    constraints?: string[];
};

// Phase order for progress tracking
const PHASE_ORDER = [
    QuestionnairePhase.ORIGIN,
    QuestionnairePhase.TRAVELERS,
    QuestionnairePhase.DESTINATION,
    QuestionnairePhase.DETAILS,
    QuestionnairePhase.SUMMARY
];

export default function AiInteractionBox({ onComplete, initialProfile }: Props) {
    const { data: session, status } = useSession();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState<UserProfile>({});
    const [isComplete, setIsComplete] = useState(false);

    // Track current questionnaire phase
    const [currentPhase, setCurrentPhase] = useState<QuestionnairePhase>(QuestionnairePhase.ORIGIN);

    // Use container ref for scrolling instead of element ref
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    };

    // Hydrate from Saved Trip
    useEffect(() => {
        if (initialProfile) {
            setProfile(initialProfile);

            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                const welcomeMsg = `Welcome back! I've loaded your "${initialProfile.travel_style || 'Trip'}" plan. What would you like to adjust or add?`;

                // Prevent duplicate welcome messages
                if (lastMsg?.content === welcomeMsg) return prev;

                return [
                    ...prev,
                    { role: "assistant", content: welcomeMsg }
                ];
            });

            // If profile looks complete, set to SUMMARY but DO NOT lock the input (isComplete) 
            // so user can continue editing.
            if (initialProfile.origin_city && initialProfile.duration) {
                setCurrentPhase(QuestionnairePhase.SUMMARY);
                setIsComplete(false); // Ensure input remains unlocked
                if (onComplete) onComplete();
            }
        }
    }, [initialProfile, onComplete]);

    // Initialize chat based on auth status
    useEffect(() => {
        if (status === "loading") return; // Wait for session load
        if (messages.length > 0) return; // Prevent re-init if messages already exist (e.g., from initialProfile)

        if (session?.user?.name) {
            setProfile(p => ({ ...p, user_name: session.user.name || "Traveler" }));
            // Initial AI Greeting is simplified as the API will drive the first question
            setMessages([
                { role: "assistant", content: `Hi ${session.user.name}! I'm your AI Trip Planner. To get started, where are you generally from?` }
            ]);
        } else {
            setMessages([
                { role: "assistant", content: "Hi! I'm your AI Travel Planner. Let's design your perfect trip. To get started, where are you generally from?" }
            ]);
        }
    }, [session, status, messages.length]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");

        // Optimistic update
        const newHistory: Message[] = [...messages, { role: "user", content: userMsg }];
        setMessages(newHistory);
        setIsLoading(true);

        try {
            const res = await fetch("/api/ai-trip-planner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: newHistory,
                    current_profile: profile,
                    current_phase: currentPhase
                }),
            });

            if (!res.ok) throw new Error("Failed to fetch");

            const data = await res.json();

            // Update Profile
            if (data.profile_update) {
                setProfile(prev => ({ ...prev, ...data.profile_update }));
            }

            // Handle Phase Transition
            if (data.step_completed) {
                const currentIndex = PHASE_ORDER.indexOf(currentPhase);
                if (currentIndex < PHASE_ORDER.length - 1) {
                    const nextPhase = PHASE_ORDER[currentIndex + 1];
                    setCurrentPhase(nextPhase);
                    console.log(`Phase Advanced: ${currentPhase} -> ${nextPhase}`);
                }
            }

            // Handle Response
            if (data.next_step === "finish" || currentPhase === QuestionnairePhase.SUMMARY) {
                setIsComplete(true);
                setMessages(prev => [...prev, { role: "assistant", content: "Perfect! I have everything I need. Generating your map..." }]);

                // Delay helping user feel the "generation" phase
                setTimeout(() => {
                    if (onComplete) onComplete();
                }, 1500);
            } else {
                setMessages(prev => [...prev, { role: "assistant", content: data.question || "Tell me more?" }]);
            }

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Could you try asking that again?" }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Render loading state if session is still loading
    if (status === "loading") {
        return (
            <div className="w-full relative z-10 mx-auto transition-all duration-500">
                <div className="relative overflow-hidden rounded-2xl border border-[#4da528]/20 bg-white/10 backdrop-blur-xl shadow-2xl h-[550px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <FaStar className="text-4xl text-[#4da528] animate-spin-slow" />
                        <span className="text-[#4da528] font-semibold animate-pulse">Personalizing your planner...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full relative z-10 mx-auto transition-all duration-500">
            {/* Glassmorphism Container */}
            <div className="relative overflow-hidden rounded-2xl border border-[#4da528]/20 bg-white/10 backdrop-blur-xl shadow-2xl">

                {/* Main Split Layout */}
                <div className="relative grid grid-cols-1 lg:grid-cols-2 h-[550px] divide-y lg:divide-y-0 lg:divide-x divide-[#4da528]/10 bg-white/50">

                    {/* Left Panel: Chat Interface */}
                    <div className="flex flex-col h-full overflow-hidden">
                        {/* Chat Header */}
                        <div className="p-4 bg-white/30 border-b border-[#4da528]/10 flex items-center justify-between backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <FaMagic className="text-[#4da528]" />
                                <h3 className="font-semibold text-gray-800">Travel Assistant</h3>
                            </div>
                            {/* Phase Indicator */}
                            <div className="text-xs font-medium px-2 py-1 bg-[#4da528]/10 text-[#4da528] rounded-full">
                                Step {PHASE_ORDER.indexOf(currentPhase) + 1} / 4
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/20 scroll-smooth"
                        >
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === "user"
                                        ? "bg-[#4da528] text-white rounded-br-none"
                                        : "bg-white text-gray-700 rounded-bl-none border border-gray-100"
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-gray-500 text-sm border border-gray-100">
                                        <FaStar className="animate-spin text-[#4da528]" /> Analyzing...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-gray-100">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your answer..."
                                    disabled={isLoading || isComplete}
                                    className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 pr-12 text-gray-800 placeholder-gray-400 focus:border-[#4da528] focus:ring-1 focus:ring-[#4da528] outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading || isComplete}
                                    className="absolute right-2 p-2 text-white bg-[#4da528] rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors shadow-sm"
                                >
                                    <FaPaperPlane className="text-xs" />
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Panel: Live Profile Report */}
                    <div className="flex flex-col h-full overflow-hidden bg-white/30">
                        <div className="p-6 border-b border-[#4da528]/10 bg-white/20 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-[#4da528]">
                                    Trip Profile
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">Updates live as we chat</p>
                            </div>
                            <button
                                onClick={async () => {
                                    if (Object.keys(profile).length === 0) {
                                        alert("Profile is empty!");
                                        return;
                                    }
                                    try {
                                        const res = await fetch("/api/trips", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ profile }),
                                        });
                                        if (res.ok) {
                                            alert("Trip saved to your account successfully!");
                                        } else {
                                            const err = await res.json();
                                            alert("Failed to save trip: " + err.error);
                                        }
                                    } catch (e) {
                                        alert("Network error: Could not save trip.");
                                    }
                                }}
                                title="Save Trip to Account"
                                className="p-2 text-[#4da528] bg-white/50 hover:bg-white rounded-lg transition-all border border-[#4da528]/20 shadow-sm"
                            >
                                <FaSave />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {/* Profile Cards */}
                            <ProfileCard
                                icon={<FaUser />}
                                label="Name"
                                value={profile.user_name}
                                emptyText="What's your name?"
                            />
                            <ProfileCard
                                icon={<FaMapMarkedAlt />}
                                label="Origin"
                                value={profile.origin_city}
                                subValue={profile.origin_city && `From: ${profile.origin_city}`}
                                emptyText="Where are you coming from?"
                                active={currentPhase === QuestionnairePhase.ORIGIN}
                            />
                            {(profile.group_size || profile.companions || currentPhase === QuestionnairePhase.TRAVELERS) && (
                                <ProfileCard
                                    icon={<FaSmile />}
                                    label="Travelers"
                                    value={profile.group_size ? `${profile.group_size} People (${profile.companions || ''})` : profile.companions}
                                    emptyText="Who's coming with you?"
                                    active={currentPhase === QuestionnairePhase.TRAVELERS}
                                />
                            )}
                            {(profile.duration || currentPhase === QuestionnairePhase.DETAILS) && (
                                <ProfileCard
                                    icon={<FaClock />}
                                    label="Duration"
                                    value={profile.duration}
                                    emptyText="How long are you going?"
                                    active={currentPhase === QuestionnairePhase.DETAILS}
                                />
                            )}
                            {profile.travel_style && (
                                <ProfileCard
                                    icon={<FaMapMarkedAlt />}
                                    label="Travel Style"
                                    value={profile.travel_style}
                                    emptyText="Defining your vibe..."
                                />
                            )}
                            {(profile.budget_tier || currentPhase === QuestionnairePhase.DETAILS) && (
                                <ProfileCard
                                    icon={<FaMoneyBillWave />}
                                    label="Budget"
                                    value={profile.budget_tier}
                                    emptyText="Planning the finances..."
                                    active={currentPhase === QuestionnairePhase.DETAILS}
                                />
                            )}

                            {/* Dynamic Extras */}
                            {profile.transport_preference && (
                                <div className="bg-white/60 p-4 rounded-xl border border-white/40 shadow-sm animate-fadeIn">
                                    <p className="text-xs text-uppercase tracking-wider text-gray-500 font-semibold mb-1">TRANSPORT</p>
                                    <p className="text-gray-800 font-medium">{profile.transport_preference}</p>
                                </div>
                            )}

                            {(profile.specific_interests?.length || 0) > 0 && (
                                <div className="bg-white/60 p-4 rounded-xl border border-white/40 shadow-sm animate-fadeIn">
                                    <p className="text-xs text-uppercase tracking-wider text-gray-500 font-semibold mb-2">INTERESTS</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.specific_interests?.map((tag, i) => (
                                            <span key={i} className="text-xs bg-[#4da528]/10 text-[#4da528] px-2 py-1 rounded-full border border-[#4da528]/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Overlay when complete */}
                        {isComplete && (
                            <div className="mt-4 mx-4 bg-[#4da528]/10 border border-[#4da528]/20 p-4 rounded-xl text-center animate-fadeIn">
                                <p className="text-[#4da528] font-semibold flex items-center justify-center gap-2">
                                    <FaStar /> Profile Complete! Map Unlocked.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileCard({ icon, label, value, subValue, emptyText, active }: { icon: React.ReactNode, label: string, value?: string, subValue?: string, emptyText: string, active?: boolean }) {
    const hasValue = !!value;
    return (
        <div className={`p-3 rounded-xl border transition-all duration-300 ${active
            ? "ring-2 ring-[#4da528]/50 bg-white shadow-md scale-[1.02]"
            : hasValue
                ? "bg-white/90 border-[#4da528]/30 shadow-sm"
                : "bg-white/40 border-white/20 text-gray-400"
            }`}>
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${hasValue || active ? "bg-[#4da528]/10 text-[#4da528]" : "bg-gray-50 text-gray-300"}`}>
                    {icon}
                </div>
                <div className="flex-1 cursor-default">
                    <div className="flex justify-between items-center">
                        <p className="text-[10px] uppercase tracking-wider font-bold opacity-60">{label}</p>
                        {active && <span className="text-[10px] text-[#4da528] font-semibold animate-pulse">EDITING</span>}
                    </div>
                    <p className={`font-medium ${hasValue ? "text-gray-900 text-sm" : "text-gray-400 text-xs italic"}`}>
                        {value || emptyText}
                    </p>
                    {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
                </div>
                {hasValue && <FaCheckCircle className="text-[#4da528] text-xs opacity-50" />}
            </div>
        </div>
    );
}
