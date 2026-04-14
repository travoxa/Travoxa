"use client";

import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import AITripPlannerSection from "@/components/ai-trip-planner/AITripPlannerSection";

export default function AiTripPlannerPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />
            <main className="flex-grow pt-24 pb-12 px-4 md:px-8">
                <AITripPlannerSection />
            </main>
            <Footer />
        </div>
    );
}
