'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import FoodHero from '@/components/Pages/FoodAndCafes/FoodHero';
import FoodFilterSidebar from '@/components/Pages/FoodAndCafes/FoodFilterSidebar';
import FoodCard from '@/components/Pages/FoodAndCafes/FoodCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

export interface FoodPackage {
    _id: string;
    id: string;
    title: string;
    city: string;
    state: string;
    location?: string;
    rating: number;
    reviews: number;
    image: string;
    category: string; // Mapped from 'type' in DB
    cuisine: string | string[]; // DB has array, UI might expect string or array
    overview: string;
    priceRange: string;
}

interface FoodClientProps {
    initialPackages: FoodPackage[];
}

const FoodClient: React.FC<FoodClientProps> = ({ initialPackages }) => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    // State
    const [filteredPackages, setFilteredPackages] = useState<FoodPackage[]>(initialPackages);
    // Search State
    const [searchQuery, setSearchQuery] = useState({ state: "", city: "", category: "" });
    // Filters State
    const [filters, setFilters] = useState({
        category: [] as string[],
        cuisine: [] as string[],
        priceRange: [] as string[]
    });

    // Handle Search from Hero
    const handleSearch = (query: { state: string; city: string; category: string }) => {
        setSearchQuery(query);
        applyFilters(query, filters);
    };

    // Handle Filters from Sidebar
    const handleFilterChange = (type: string, value: string) => {
        let newFilters = { ...filters };

        if (type === 'category') {
            if (newFilters.category.includes(value)) {
                newFilters.category = newFilters.category.filter(item => item !== value);
            } else {
                newFilters.category = [...newFilters.category, value];
            }
        } else if (type === 'cuisine') {
            if (newFilters.cuisine.includes(value)) {
                newFilters.cuisine = newFilters.cuisine.filter(item => item !== value);
            } else {
                newFilters.cuisine = [...newFilters.cuisine, value];
            }
        } else if (type === 'priceRange') {
            if (newFilters.priceRange.includes(value)) {
                newFilters.priceRange = newFilters.priceRange.filter(item => item !== value);
            } else {
                newFilters.priceRange = [...newFilters.priceRange, value];
            }
        }

        setFilters(newFilters);
        applyFilters(searchQuery, newFilters);
    };

    const handleResetFilters = () => {
        const resetFilters = { category: [], cuisine: [], priceRange: [] };
        setFilters(resetFilters);
        applyFilters(searchQuery, resetFilters);
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
            results = results.filter(pkg => pkg.category === query.category);
        }

        // 2. Sidebar Filters
        if (currentFilters.category.length > 0) {
            results = results.filter(pkg => currentFilters.category.includes(pkg.category));
        }

        if (currentFilters.cuisine.length > 0) {
            results = results.filter(pkg => {
                const pkgCuisines = Array.isArray(pkg.cuisine) ? pkg.cuisine : [pkg.cuisine];
                return currentFilters.cuisine.some(c => pkgCuisines.includes(c));
            });
        }

        if (currentFilters.priceRange.length > 0) {
            results = results.filter(pkg => currentFilters.priceRange.includes(pkg.priceRange));
        }

        setFilteredPackages(results);
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            <Header forceWhite={true} />

            {/* HERO WITH SEARCH */}
            <FoodHero onSearch={handleSearch} />

            {/* MAIN CONTENT */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">

                {/* SIDEBAR (25%) */}
                <div className="lg:w-1/4 hidden lg:block" data-aos="fade-right">
                    <FoodFilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                    />
                </div>

                {/* GRID (75%) */}
                <div className="lg:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 Mont">
                            {searchQuery.city ? `Cafes & Food in ${searchQuery.city}` : 'Culinary Delights'}
                            <span className="text-sm font-normal text-slate-500 ml-2 Inter">({filteredPackages.length} found)</span>
                        </h2>
                    </div>

                    {filteredPackages.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPackages.map((pkg, index) => (
                                <div key={pkg.id || index} data-aos="fade-up" data-aos-delay={index * 50}>
                                    <FoodCard pkg={pkg} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                            <h3 className="text-lg font-medium text-slate-900">No places found</h3>
                            <p className="text-slate-500 mb-4">Try adjusting your search or filters.</p>
                            <button onClick={handleResetFilters} className="text-yellow-600 font-bold hover:underline">Clear All Filters</button>
                        </div>
                    )}
                </div>
            </div>

            <Footor />
        </div>
    );
};

export default FoodClient;
