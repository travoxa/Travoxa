
"use client";

import { tourPackages } from "@/data/tourPackages";
import PackageCard from "@/components/Pages/Tour/PackageCard";
import CustomTourForm from "@/components/Pages/Tour/CustomTourForm";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footor"; // Note: typo in original file 'Footor'
import Image from "next/image";

export default function TourPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-green-100 selection:text-green-900">
            <Header forceWhite={true} />

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/Destinations/Des5.jpg"
                        alt="Tour Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto mt-20">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-widest uppercase mb-4 border border-white/30">
                        Discover the World
                    </span>
                    <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-wide drop-shadow-md">
                        Curated Tours for the <br />
                        <span className="font-semibold italic font-serif" style={{ textShadow: '0 0 20px rgba(0,0,0,0.3)' }}>Modern Explorer</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white drop-shadow-md max-w-2xl mx-auto leading-relaxed font-light">
                        Handpicked experiences designed to immerse you in the culture, nature, and beauty of our planet.
                    </p>
                </div>
            </section>

            {/* Packages Grid */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Packages</h2>
                        <div className="h-1 w-20 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-gray-500 max-w-md text-right md:text-left">
                        Explore our most requested destinations and itineraries, crafted by travel experts for unforgettable memories.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {tourPackages.map((pkg) => (
                        <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                </div>
            </section>

            {/* Custom Tour Request Form */}
            <section className="bg-gray-50 py-20 px-6">
                <CustomTourForm />
            </section>

            <Footer />
        </main>
    );
}
