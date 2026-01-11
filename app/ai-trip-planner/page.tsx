"use client";

import Header from "@/components/ui/Header";
import Footor from "@/components/ui/Footor";
import MapModule from "@/components/Maps/MapModule";
import AiInteractionBox from "@/components/ai-trip-planner/AiInteractionBox";
import SavedTripsList from "@/components/ai-trip-planner/SavedTripsList";
import { useState } from "react";

export default function AiTripPlannerPage() {
    const [isMapUnlocked, setIsMapUnlocked] = useState(false);
    const [selectedTrip, setSelectedTrip] = useState<any>(null);

    return (
        <>
            <Header />
            <main className="min-h-screen bg-dots-svg mt-[50px] px-4 py-24 text-black sm:px-6 lg:px-12">
                <div className="mx-auto max-w-7xl space-y-10">
                    <header className="space-y-3 text-left Mont">
                        <p className="text-xs uppercase tracking-[0.7em] text-[var(--green)]">
                            AI Trip Planner
                        </p>
                        <h1 className="text-[3.5vw] font-semibold leading-tight">
                            Interactive Ai Trip planner
                        </h1>
                    </header>

                    <SavedTripsList onSelectTrip={(profile) => setSelectedTrip(profile)} />

                    <AiInteractionBox
                        initialProfile={selectedTrip}
                        onComplete={() => setIsMapUnlocked(true)}
                    />

                    <div className="relative">
                        {!isMapUnlocked && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/10 backdrop-blur-md border border-gray-200 rounded-xl">
                                <div className="text-center p-6 bg-white/80 rounded-xl shadow-lg">
                                    <p className="text-lg font-semibold text-gray-800 mb-2">Map Locked</p>
                                    <p className="text-sm text-gray-600">Please complete the AI profile setup above to unlock the map.</p>
                                </div>
                            </div>
                        )}
                        <div className={!isMapUnlocked ? "pointer-events-none opacity-50" : ""}>
                            <MapModule />
                        </div>
                    </div>
                </div>
            </main>
            <Footor />
        </>
    );
}
