
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { tourData } from "@/data/tourData";
import PackageCard from "@/components/Pages/Tour/PackageCard";
import CustomTourForm from "@/components/Pages/Tour/CustomTourForm";
import TourFilterSearch from "@/components/Pages/Tour/TourFilterSearch";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footor"; // Note: typo in original file 'Footor'
import Image from "next/image";

export default function TourPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TourContent />
        </Suspense>
    );
}

function TourContent() {
    const searchParams = useSearchParams();
    const [filteredPackages, setFilteredPackages] = useState(tourData);
    const [isExpanded, setIsExpanded] = useState(false);

    // Initial filter from URL params
    useEffect(() => {
        const priceParam = searchParams.get("priceRange");
        const queryParam = searchParams.get("searchQuery");

        // We can reuse the logic by constructing a filter object, 
        // but handleFilter expects a specific shape and also triggers setFilteredPackages.
        // Let's call handleFilter with the params if they exist.

        const initialFilters = {
            searchQuery: queryParam || "",
            priceRange: priceParam || "Any Price",
            duration: "Any Duration"
        };

        // Only trigger if there's actually a param to filter by, otherwise default load is fine
        if (priceParam || queryParam) {
            handleFilter(initialFilters);
        }
    }, [searchParams]);

    const handleFilter = (filters: { searchQuery: string, priceRange: string, duration: string }) => {
        let results = tourData;

        // Filter by Search Query (Title or Location)
        if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            results = results.filter(pkg =>
                pkg.title.toLowerCase().includes(query) ||
                pkg.location.toLowerCase().includes(query)
            );
        }

        // Filter by Price
        if (filters.priceRange !== "Any Price") {
            if (filters.priceRange === "Under $1000") {
                results = results.filter(pkg => pkg.price < 1000);
            } else if (filters.priceRange === "$1000 - $2000") {
                results = results.filter(pkg => pkg.price >= 1000 && pkg.price <= 2000);
            } else if (filters.priceRange === "Above $2000") {
                results = results.filter(pkg => pkg.price > 2000);
            }
        }

        // Filter by Duration
        if (filters.duration !== "Any Duration") {
            // A simple heuristic based on the string format "X Days"
            results = results.filter(pkg => {
                const days = parseInt(pkg.duration.split(" ")[0]);
                if (filters.duration.includes("< 5") && days < 5) return true;
                if (filters.duration.includes("5-8") && days >= 5 && days <= 8) return true;
                if (filters.duration.includes("> 8") && days > 8) return true;
                // Allow sorting values to pass through filtering
                if (filters.duration === "Short to Long" || filters.duration === "Long to Short") return true;
                return false;
            });
        }

        // Apply Sorting
        // Sort by Price
        if (filters.priceRange === "Low to High") {
            results.sort((a, b) => a.price - b.price);
        } else if (filters.priceRange === "High to Low") {
            results.sort((a, b) => b.price - a.price);
        }

        // Sort by Duration
        if (filters.duration === "Short to Long") {
            results.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        } else if (filters.duration === "Long to Short") {
            results.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
        }

        setFilteredPackages(results);
        setIsExpanded(false); // Reset expansion on filter change
    };

    // Determine displayed packages
    const displayedPackages = isExpanded ? filteredPackages : filteredPackages.slice(0, 9);
    const showLoadMore = !isExpanded && filteredPackages.length > 9;

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

            {/* Search Bar - Below Hero with Gap */}
            <div className="relative z-20 mt-10 px-4">
                <TourFilterSearch onFilterChange={handleFilter} />
            </div>

            {/* Packages Grid */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto pt-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Packages</h2>
                        <div className="h-1 w-20 bg-green-500 rounded-full"></div>
                    </div>
                    <p className="text-gray-500 max-w-md text-right md:text-left">
                        Explore our most requested destinations and itineraries, crafted by travel experts for unforgettable memories.
                    </p>
                </div>

                {filteredPackages.length > 0 ? (
                    <div className="relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {displayedPackages.map((pkg, index) => {
                                const isBlurItem = !isExpanded && index >= 6;
                                return (
                                    <PackageCard
                                        key={pkg.id}
                                        pkg={pkg}
                                        isBlurItem={isBlurItem}
                                    />
                                );
                            })}
                        </div>

                        {/* Gradient Overlay & Show More Button */}
                        {showLoadMore && (
                            <div className="absolute inset-x-0 bottom-0 h-[400px] bg-gradient-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-10 z-10 pointer-events-none">
                                <button
                                    onClick={() => setIsExpanded(true)}
                                    className="pointer-events-auto bg-black text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-green-600 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    Show More Tours
                                </button>
                            </div>
                        )}

                        {/* Show Less Button */}
                        {isExpanded && filteredPackages.length > 9 && (
                            <div className="flex justify-center mt-12 pb-10">
                                <button
                                    onClick={() => {
                                        setIsExpanded(false);
                                        // scroll to top of grid if needed, but for now simple toggle
                                    }}
                                    className="bg-white border border-gray-200 text-gray-900 px-8 py-3 rounded-full font-bold shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                                >
                                    Show Less
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No packages found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria or price range.</p>
                        <button
                            onClick={() => {
                                setFilteredPackages(tourData);
                                // Note: This doesn't reset the Search Component state, simpler to just let user manually clear
                            }}
                            className="mt-4 text-green-600 font-bold hover:underline"
                        >
                            View All Packages
                        </button>
                    </div>
                )}
            </section>

            {/* Custom Tour Request Form */}
            <section className="bg-gray-50 py-20 px-6">
                <CustomTourForm />
            </section>

            <Footer />
        </main>
    );
}
