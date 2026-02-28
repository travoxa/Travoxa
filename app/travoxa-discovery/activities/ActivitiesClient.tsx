'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import ActivitiesHero from '@/components/Pages/Activities/ActivitiesHero';
import ActivitiesFilterSidebar from '@/components/Pages/Activities/ActivitiesFilterSidebar';
import ActivitiesCard from '@/components/Pages/Activities/ActivitiesCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Updated Interface matching the Mongoose Schema + Frontend needs
export interface ActivityPackage {
    _id: string;
    id: string; // virtual
    title: string;
    city: string;
    state: string;
    location?: { name: string; mapLink: string };
    duration: string;
    price: number;
    rating?: number;
    reviews?: number;
    image: string;
    category?: string; // Kept for compat
    type: string; // New field
    level?: string; // Kept for compat
    difficultyLevel: string; // New field
    highlights: string[];
    overview: string;
    suitableFor: string[];
    season?: string[];
    bestMonths?: { start: string; end: string };
    groupSize?: { min: number; max: number };
    ageLimit?: { min: number; max?: number };
    inclusions?: string[];
    exclusions?: string[];
    safetyLevel?: string;
    photographyAllowed?: boolean;
    parkingAvailable?: boolean;
    medicalRestrictions?: { exists: boolean; details: string };
    partners?: {
        name: string;
        logo?: string;
        phone?: string;
        website?: string;
        location?: string;
        state?: string;
        isVerified?: boolean;
    }[];
}

interface ActivitiesClientProps {
    initialPackages: ActivityPackage[];
}

const ActivitiesClient: React.FC<ActivitiesClientProps> = ({ initialPackages }) => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    // State
    const [filteredPackages, setFilteredPackages] = useState<ActivityPackage[]>(initialPackages);
    // Search State
    const [searchQuery, setSearchQuery] = useState({ state: "", city: "", category: "" });
    // Filters State
    const [filters, setFilters] = useState({
        category: [] as string[],
        level: [] as string[],
        suitableFor: [] as string[],
        priceRange: ""
    });

    // Handle Search from Hero
    const handleSearch = (query: { state: string; city: string; category: string }) => {
        setSearchQuery(query);
        applyFilters(query, filters);
    };

    // Handle Filters from Sidebar
    const handleFilterChange = (filterType: string, value: string) => {
        const newFilters = { ...filters };

        if (filterType === 'category') {
            if (newFilters.category.includes(value)) {
                newFilters.category = newFilters.category.filter(item => item !== value);
            } else {
                newFilters.category = [...newFilters.category, value];
            }
        } else if (filterType === 'level') {
            if (newFilters.level.includes(value)) {
                newFilters.level = newFilters.level.filter(item => item !== value);
            } else {
                newFilters.level = [...newFilters.level, value];
            }
        } else if (filterType === 'suitableFor') {
            if (newFilters.suitableFor.includes(value)) {
                newFilters.suitableFor = newFilters.suitableFor.filter(item => item !== value);
            } else {
                newFilters.suitableFor = [...newFilters.suitableFor, value];
            }
        } else if (filterType === 'priceRange') {
            newFilters.priceRange = newFilters.priceRange === value ? "" : value;
        }

        setFilters(newFilters);
        applyFilters(searchQuery, newFilters);
    };

    const handleResetFilters = () => {
        const resetFilters = { category: [], level: [], suitableFor: [], priceRange: "" };
        setFilters(resetFilters);
        setSearchQuery({ state: "", city: "", category: "" }); // Also reset search
        applyFilters({ state: "", city: "", category: "" }, resetFilters);
    };

    // Apply Logic
    const applyFilters = (query: typeof searchQuery, currentFilters: typeof filters) => {
        let results = initialPackages;

        // 1. Search Query Filters
        if (query.state) {
            results = results.filter(pkg => pkg.state === query.state);
        }
        if (query.city) {
            results = results.filter(pkg => pkg.city === query.city);
        }
        if (query.category) {
            // Check both type and category for backward compatibility
            results = results.filter(pkg =>
                (pkg.type === query.category) || (pkg.category === query.category)
            );
        }

        // 2. Sidebar Filters
        if (currentFilters.category.length > 0) {
            results = results.filter(pkg =>
                currentFilters.category.includes(pkg.type) ||
                (pkg.category && currentFilters.category.includes(pkg.category))
            );
        }

        if (currentFilters.level.length > 0) {
            results = results.filter(pkg =>
                currentFilters.level.includes(pkg.difficultyLevel) ||
                (pkg.level && currentFilters.level.includes(pkg.level))
            );
        }

        if (currentFilters.suitableFor.length > 0) {
            results = results.filter(pkg => {
                if (!pkg.suitableFor) return false;
                // Check if any selected suitability matches the package's suitableFor array
                return currentFilters.suitableFor.some(s => pkg.suitableFor.includes(s));
            });
        }

        if (currentFilters.priceRange) {
            results = results.filter(pkg => {
                if (currentFilters.priceRange === "Under ₹2000") return pkg.price < 2000;
                if (currentFilters.priceRange === "₹2000 - ₹5000") return pkg.price >= 2000 && pkg.price <= 5000;
                if (currentFilters.priceRange === "Above ₹5000") return pkg.price > 5000;
                return true;
            });
        }

        setFilteredPackages(results);
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            <Header forceWhite={true} />

            {/* HERO WITH SEARCH */}
            <ActivitiesHero onSearch={handleSearch} />

            {/* MAIN CONTENT */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">

                {/* SIDEBAR (25%) */}
                <div className="lg:w-1/4 hidden lg:block" data-aos="fade-right">
                    <ActivitiesFilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                    />
                </div>

                {/* GRID (75%) */}
                <div className="lg:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 Mont">
                            {searchQuery.city ? `Activities in ${searchQuery.city}` : 'Top Adventure Activities'}
                            <span className="text-sm font-normal text-slate-500 ml-2 Inter">({filteredPackages.length} found)</span>
                        </h2>
                    </div>

                    {filteredPackages.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPackages.map((pkg, index) => (
                                <div key={pkg._id || index} data-aos="fade-up" data-aos-delay={index * 50}>
                                    <ActivitiesCard pkg={pkg} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                            <h3 className="text-lg font-medium text-slate-900">No activities found</h3>
                            <p className="text-slate-500 mb-4">Try adjusting your search or filters.</p>
                            <button onClick={handleResetFilters} className="text-orange-600 font-bold hover:underline">Clear All Filters</button>
                        </div>
                    )}
                </div>
            </div>

            <Footor />
        </div>
    );
};

export default ActivitiesClient;
