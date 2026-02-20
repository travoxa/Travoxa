"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import StayHero from '@/components/Pages/Stay/StayHero';
import StayFilterSidebar from '@/components/Pages/Stay/StayFilterSidebar';
import StayPackageCard from '@/components/Pages/Stay/StayPackageCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

const StayPage = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    // State
    const [stays, setStays] = useState<any[]>([]);
    const [filteredStays, setFilteredStays] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState({ state: "", city: "", guests: "" });
    const [filters, setFilters] = useState({
        type: [] as string[],
        priceRange: "",
        amenities: [] as string[]
    });

    // Fetch stays from API
    useEffect(() => {
        const fetchStays = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/stay');
                const data = await res.json();
                if (data.success) {
                    setStays(data.data);
                    setFilteredStays(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch stays:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStays();
    }, []);

    // Handle Search from Hero
    const handleSearch = (query: { state: string; city: string; guests: string }) => {
        setSearchQuery(query);
        applyFilters(query, filters);
    };

    // Handle Filters from Sidebar
    const handleFilterChange = (type: string, value: string) => {
        let newFilters = { ...filters };

        if (type === 'type') {
            if (newFilters.type.includes(value)) {
                newFilters.type = newFilters.type.filter(item => item !== value);
            } else {
                newFilters.type = [...newFilters.type, value];
            }
        } else if (type === 'priceRange') {
            newFilters.priceRange = newFilters.priceRange === value ? "" : value;
        } else if (type === 'amenities') {
            if (newFilters.amenities.includes(value)) {
                newFilters.amenities = newFilters.amenities.filter(item => item !== value);
            } else {
                newFilters.amenities = [...newFilters.amenities, value];
            }
        }

        setFilters(newFilters);
        applyFilters(searchQuery, newFilters);
    };

    const handleResetFilters = () => {
        const resetFilters = { type: [], priceRange: "", amenities: [] };
        setFilters(resetFilters);
        applyFilters(searchQuery, resetFilters);
    };

    // Apply Logic
    const applyFilters = (query: typeof searchQuery, currentFilters: typeof filters) => {
        let results = stays;

        // 1. Search Query Filters
        if (query.state) {
            results = results.filter(pkg => pkg.state === query.state);
        }
        if (query.city) {
            results = results.filter(pkg => pkg.city === query.city);
        }
        if (query.guests) {
            const guestCount = parseInt(query.guests);
            if (!isNaN(guestCount)) {
                results = results.filter(pkg => pkg.maxGuests >= guestCount);
            }
        }

        // 2. Sidebar Filters
        if (currentFilters.type.length > 0) {
            results = results.filter(pkg => currentFilters.type.includes(pkg.type));
        }

        if (currentFilters.priceRange) {
            results = results.filter(pkg => {
                if (currentFilters.priceRange === "Under ₹2000") return pkg.price < 2000;
                if (currentFilters.priceRange === "₹2000 - ₹5000") return pkg.price >= 2000 && pkg.price <= 5000;
                if (currentFilters.priceRange === "₹5000 - ₹10000") return pkg.price > 5000 && pkg.price <= 10000;
                if (currentFilters.priceRange === "Above ₹10000") return pkg.price > 10000;
                return true;
            });
        }

        if (currentFilters.amenities.length > 0) {
            results = results.filter(pkg =>
                currentFilters.amenities.every((amenity: string) => pkg.amenities.includes(amenity))
            );
        }

        setFilteredStays(results);
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <Header forceWhite={true} />

            {/* HERO WITH SEARCH */}
            <StayHero onSearch={handleSearch} locations={stays.map(s => ({ state: s.state, city: s.city }))} />

            {/* MAIN CONTENT */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">

                {/* SIDEBAR (25%) */}
                <div className="lg:w-1/4 hidden lg:block" data-aos="fade-right">
                    <StayFilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                    />
                </div>

                {/* GRID (75%) */}
                <div className="lg:w-3/4">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-slate-900 Mont">
                            {searchQuery.city ? `Stays in ${searchQuery.city}` : 'Discover Unique Stays'}
                        </h2>
                        <p className="text-sm text-slate-500 Inter">{filteredStays.length} properties found</p>
                    </div>

                    {filteredStays.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredStays.map((pkg, index) => (
                                <div key={pkg.id} data-aos="fade-up" data-aos-delay={index * 50}>
                                    <StayPackageCard pkg={pkg} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                            <h3 className="text-lg font-medium text-slate-900">No stays found</h3>
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

export default StayPage;
