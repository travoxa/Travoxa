
"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import ActivitiesHero from '@/components/Pages/Activities/ActivitiesHero';
import ActivitiesFilterSidebar from '@/components/Pages/Activities/ActivitiesFilterSidebar';
import ActivitiesCard from '@/components/Pages/Activities/ActivitiesCard';
import { activitiesPackages, ActivityPackage } from '@/data/activitiesData';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ActivitiesPage = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    // State
    const [filteredPackages, setFilteredPackages] = useState<ActivityPackage[]>(activitiesPackages);
    // Search State
    const [searchQuery, setSearchQuery] = useState({ state: "", city: "", category: "" });
    // Filters State
    const [filters, setFilters] = useState({
        category: [] as string[],
        level: [] as string[],
        priceRange: ""
    });

    // Handle Search from Hero
    const handleSearch = (query: { state: string; city: string; category: string }) => {
        setSearchQuery(query);
        // If a category is selected in dropdown, sync it with sidebar filter (optional, here we treat it as search criteria)
        // But for consistency with filters, we can just use search query criteria in the apply function.
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
        } else if (type === 'level') {
            if (newFilters.level.includes(value)) {
                newFilters.level = newFilters.level.filter(item => item !== value);
            } else {
                newFilters.level = [...newFilters.level, value];
            }
        } else if (type === 'priceRange') {
            newFilters.priceRange = newFilters.priceRange === value ? "" : value;
        }

        setFilters(newFilters);
        applyFilters(searchQuery, newFilters);
    };

    const handleResetFilters = () => {
        const resetFilters = { category: [], level: [], priceRange: "" };
        setFilters(resetFilters);
        applyFilters(searchQuery, resetFilters);
    };

    // Apply Logic
    const applyFilters = (query: typeof searchQuery, currentFilters: typeof filters) => {
        let results = activitiesPackages;

        // 1. Search Query Filters
        if (query.state) {
            results = results.filter(pkg => pkg.state === query.state);
        }
        if (query.city) {
            results = results.filter(pkg => pkg.city === query.city);
        }
        if (query.category) {
            // If category is selected in Hero, we filter by it
            results = results.filter(pkg => pkg.category === query.category);
        }

        // 2. Sidebar Filters
        if (currentFilters.category.length > 0) {
            results = results.filter(pkg => currentFilters.category.includes(pkg.category));
        }

        if (currentFilters.level.length > 0) {
            results = results.filter(pkg => currentFilters.level.includes(pkg.level));
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
                                <div key={pkg.id} data-aos="fade-up" data-aos-delay={index * 50}>
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

export default ActivitiesPage;
