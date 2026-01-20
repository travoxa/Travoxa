"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import { rentalsData, RentalItem } from '@/data/rentalsData';
import RentalHero from '@/components/Pages/Rentals/RentalHero';
import RentalFilterSidebar from '@/components/Pages/Rentals/RentalFilterSidebar';
import RentalCard from '@/components/Pages/Rentals/RentalCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

const RentalsPage = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    // State
    const [filteredRentals, setFilteredRentals] = useState<RentalItem[]>(rentalsData);
    const [searchQuery, setSearchQuery] = useState({ city: "", type: "", date: "" });
    const [filters, setFilters] = useState({
        vehicleType: [] as string[],
        priceRange: "",
        fuel: [] as string[]
    });

    // Handle Search from Hero
    const handleSearch = (query: { city: string; type: string; date: string }) => {
        setSearchQuery(query);
        // If a vehicle type is selected in search, we can treat it as part of the filter or just search query. 
        // For consistency with sightseeing, let's update the filter state if it matches? 
        // Actually, let's keep search separate but pre-apply it.
        // Or better, let's mimic the behavior: search query drives the initial list, filters refine it.
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
        let results = rentalsData;

        // 1. Search Query
        if (query.city) {
            results = results.filter(item => item.location.toLowerCase().includes(query.city.toLowerCase()));
        }
        if (query.type) {
            // If searched by type (e.g. Scooter)
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

                    {filteredRentals.length > 0 ? (
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
