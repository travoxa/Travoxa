"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import { sightseeingPackages, SightseeingPackage } from '@/data/sightseeingData';
import SightseeingHero from '@/components/Pages/Sightseeing/SightseeingHero';
import SightseeingFilterSidebar from '@/components/Pages/Sightseeing/SightseeingFilterSidebar';
import SightseeingPackageCard from '@/components/Pages/Sightseeing/SightseeingPackageCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

const SightseeingPage = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    // State
    // State
    const [filteredPackages, setFilteredPackages] = useState<SightseeingPackage[]>(sightseeingPackages);
    // Removed date from state
    const [searchQuery, setSearchQuery] = useState({ state: "", city: "", members: "" });
    const [filters, setFilters] = useState({
        duration: [] as string[],
        vehicleType: [] as string[],
        priceRange: ""
    });

    // Handle Search from Hero
    const handleSearch = (query: { state: string; city: string; members: string }) => {
        setSearchQuery(query);
        applyFilters(query, filters);
    };

    // Handle Filters from Sidebar
    const handleFilterChange = (type: string, value: string) => {
        let newFilters = { ...filters };

        if (type === 'duration') {
            if (newFilters.duration.includes(value)) {
                newFilters.duration = newFilters.duration.filter(item => item !== value);
            } else {
                newFilters.duration = [...newFilters.duration, value];
            }
        } else if (type === 'vehicleType') {
            if (newFilters.vehicleType.includes(value)) {
                newFilters.vehicleType = newFilters.vehicleType.filter(item => item !== value);
            } else {
                newFilters.vehicleType = [...newFilters.vehicleType, value];
            }
        } else if (type === 'priceRange') {
            newFilters.priceRange = newFilters.priceRange === value ? "" : value; // Toggle off if clicked again
        }

        setFilters(newFilters);
        applyFilters(searchQuery, newFilters);
    };

    const handleResetFilters = () => {
        const resetFilters = { duration: [], vehicleType: [], priceRange: "" };
        setFilters(resetFilters);
        applyFilters(searchQuery, resetFilters);
    };

    // Apply Logic
    const applyFilters = (query: typeof searchQuery, currentFilters: typeof filters) => {
        let results = sightseeingPackages;

        // 1. Search Query Filters
        if (query.state) {
            results = results.filter(pkg => pkg.state === query.state);
        }
        if (query.city) {
            results = results.filter(pkg => pkg.city === query.city);
        }
        if (query.members) {
            const requiredSeats = parseInt(query.members);
            if (!isNaN(requiredSeats)) {
                results = results.filter(pkg => pkg.maxPeople >= requiredSeats);
            }
        }

        // 2. Sidebar Filters
        if (currentFilters.duration.length > 0) {
            results = results.filter(pkg => {
                // heuristic mapping
                const isFullDay = pkg.duration.toLowerCase().includes('full day') || parseInt(pkg.duration) > 5;
                const isHalfDay = pkg.duration.toLowerCase().includes('half day') || parseInt(pkg.duration) <= 5;

                if (currentFilters.duration.includes('Full Day') && isFullDay) return true;
                if (currentFilters.duration.includes('Half Day') && !isFullDay) return true; // simplified assumption
                return false;
            });
        }

        if (currentFilters.vehicleType.length > 0) {
            results = results.filter(pkg => currentFilters.vehicleType.includes(pkg.vehicleType));
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
            <SightseeingHero onSearch={handleSearch} />

            {/* MAIN CONTENT */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">

                {/* SIDEBAR (25%) */}
                <div className="lg:w-1/4 hidden lg:block" data-aos="fade-right">
                    <SightseeingFilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                    />
                </div>

                {/* Mobile Filter Toggle could go here */}

                {/* GRID (75%) */}
                <div className="lg:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 Mont">
                            {searchQuery.city ? `Packages in ${searchQuery.city}` : 'Top Sightseeing Packages'}
                            <span className="text-sm font-normal text-slate-500 ml-2 Inter">({filteredPackages.length} found)</span>
                        </h2>
                    </div>

                    {filteredPackages.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPackages.map((pkg, index) => (
                                <div key={pkg.id} data-aos="fade-up" data-aos-delay={index * 50}>
                                    <SightseeingPackageCard pkg={pkg} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                            <h3 className="text-lg font-medium text-slate-900">No packages found</h3>
                            <p className="text-slate-500 mb-4">Try adjusting your search or filters.</p>
                            <button onClick={handleResetFilters} className="text-emerald-600 font-bold hover:underline">Clear All Filters</button>
                        </div>
                    )}
                </div>
            </div>

            <Footor />
        </div>
    );
};

export default SightseeingPage;
