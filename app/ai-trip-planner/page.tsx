'use client';
import Header from "@/components/ui/Header";
import Footor from "@/components/ui/Footor";

export default function AiTripPlannerPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen bg-dots-svg mt-[50px] px-4 py-24 text-black sm:px-6 lg:px-12">
                <div className="mx-auto max-w-7xl space-y-10">
                    <header className="space-y-3 text-center Mont">
                        <p className="text-xs uppercase tracking-[0.7em] text-[var(--green)]">
                            AI Trip Planner
                        </p>
                        <h1 className="text-[3.5vw] font-semibold leading-tight">
                            Your intelligent travel companion
                        </h1>
                        <p className="text-base text-black/70 mx-auto max-w-2xl">
                            Let our AI curate the perfect itinerary tailored to your preferences, budget, and travel style.
                        </p>
                    </header>

                    <div className="flex justify-center py-20">
                        <div className="p-10 rounded-3xl border border-black/10 bg-white/50 backdrop-blur-sm shadow-sm text-center">
                            <p className="text-xl font-medium">Coming Soon</p>
                            <p className="text-sm text-black/60 mt-2">We are building the smartest way to plan your trips.</p>
                        </div>
                    </div>

                </div>
            </main>
            <Footor />
        </>
    );
}
