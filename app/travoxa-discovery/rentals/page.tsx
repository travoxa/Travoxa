"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import { RentalItem } from '@/data/rentalsData';
import RentalHero from '@/components/Pages/Rentals/RentalHero';
import RentalFilterSidebar from '@/components/Pages/Rentals/RentalFilterSidebar';
import RentalCard from '@/components/Pages/Rentals/RentalCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

const RentalsPage = () => {
    // State
    const [allRentals, setAllRentals] = useState<RentalItem[]>([]);
    const [filteredRentals, setFilteredRentals] = useState<RentalItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState({ city: "", type: "", date: "" });
    const [filters, setFilters] = useState({
        vehicleType: [] as string[],
        priceRange: "",
        fuel: [] as string[]
    });

    // Fetch rentals from API
    useEffect(() => {
        const fetchRentals = async () => {
            try {
                const res = await fetch('/api/rentals');
                const data = await res.json();
                if (data.success) {
                    setAllRentals(data.data);
                    setFilteredRentals(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch rentals:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRentals();
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    // Handle Search from Hero
    const handleSearch = (query: { city: string; type: string; date: string }) => {
        setSearchQuery(query);
        applyFilters(query, filters);
    };

    // Handle Filters from Sidebar
    const handleFilterChange = (type: string, value: string) => {
        let newFilters = { ...filters };

        if (type === 'vehicleType') {
            if (newFilters.vehicleType.includes(value)) {
                newFilters.vehicleType = newFilters.vehicleType.filter(item => item !== value);
            } else {
                newFilters.vehicleType = [...newFilters.vehicleType, value];
            }
        } else if (type === 'fuel') {
            if (newFilters.fuel.includes(value)) {
                newFilters.fuel = newFilters.fuel.filter(item => item !== value);
            } else {
                newFilters.fuel = [...newFilters.fuel, value];
            }
        } else if (type === 'priceRange') {
            newFilters.priceRange = newFilters.priceRange === value ? "" : value;
        }

        setFilters(newFilters);
        applyFilters(searchQuery, newFilters);
    };

    const handleResetFilters = () => {
        const resetFilters = { vehicleType: [], priceRange: "", fuel: [] };
        setFilters(resetFilters);
        applyFilters(searchQuery, resetFilters);
    };

    // Apply Logic
    const applyFilters = (query: typeof searchQuery, currentFilters: typeof filters) => {
        let results = allRentals;

        // 1. Search Query
        if (query.city) {
            results = results.filter(item => item.location.toLowerCase().includes(query.city.toLowerCase()));
        }
        if (query.type) {
            results = results.filter(item => item.type.toLowerCase().includes(query.type.toLowerCase()) || item.type === query.type);
        }

        // 2. Filters
        if (currentFilters.vehicleType.length > 0) {
            results = results.filter(item => currentFilters.vehicleType.includes(item.type));
        }

        if (currentFilters.fuel.length > 0) {
            results = results.filter(item => currentFilters.fuel.includes(item.fuel));
        }

        if (currentFilters.priceRange) {
            results = results.filter(item => {
                if (currentFilters.priceRange === "Under ₹500") return item.price < 500;
                if (currentFilters.priceRange === "₹500 - ₹2000") return item.price >= 500 && item.price <= 2000;
                if (currentFilters.priceRange === "Above ₹2000") return item.price > 2000;
                return true;
            });
        }

        setFilteredRentals(results);
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            <Header forceWhite={true} />

            {/* HERO WITH SEARCH */}
            <RentalHero onSearch={handleSearch} />

            {/* MAIN CONTENT */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col lg:flex-row gap-8">

                {/* SIDEBAR (25%) */}
                <div className="lg:w-1/4 hidden lg:block" data-aos="fade-right">
                    <RentalFilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onReset={handleResetFilters}
                    />
                </div>

                {/* GRID (75%) */}
                <div className="lg:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-900 Mont">
                            {searchQuery.city ? `Rentals in ${searchQuery.city}` : 'Top Rated Rentals'}
                            <span className="text-sm font-normal text-slate-500 ml-2 Inter">({filteredRentals.length} found)</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse">
                                    <div className="h-40 bg-slate-200 rounded-xl mb-4"></div>
                                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredRentals.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRentals.map((item, index) => (
                                <div key={item.id} data-aos="fade-up" data-aos-delay={index * 50}>
                                    <RentalCard item={item} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                            <h3 className="text-lg font-medium text-slate-900">No rentals found</h3>
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

export default RentalsPage;
