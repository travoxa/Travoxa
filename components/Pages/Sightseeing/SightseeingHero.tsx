
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUserFriends, FaChevronDown } from "react-icons/fa";
import { SightseeingPackage } from "@/data/sightseeingData";

interface SightseeingHeroProps {
    onSearch: (filters: { state: string; city: string; date: string; members: string }) => void;
    packages: SightseeingPackage[];
}

export default function SightseeingHero({ onSearch, packages }: SightseeingHeroProps) {
    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    // Form State
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [members, setMembers] = useState("");

    // Initialize States from data
    useEffect(() => {
        if (packages && packages.length > 0) {
            const uniqueStates = Array.from(new Set(packages.map(pkg => pkg.state)));
            setStates(uniqueStates.sort());
        }
    }, [packages]);

    // Update Cities when State changes
    useEffect(() => {
        if (selectedState && packages) {
            const relevantCities = packages
                .filter(pkg => pkg.state === selectedState)
                .map(pkg => pkg.city);
            setCities(Array.from(new Set(relevantCities)).sort());
            setSelectedCity(""); // Reset city when state changes
        } else {
            setCities([]);
        }
    }, [selectedState, packages]);

    const handleSearch = () => {
        onSearch({
            state: selectedState,
            city: selectedCity,
            date: "", // Removed date from UI
            members
        });
    };

    return (
        <div className="relative mx-[12px] mt-[12px] rounded-[12px] py-16 md:py-24">

            {/* Content Overlay */}
            <div className="flex flex-col items-center justify-center px-4">
                <h1 className="mt-24 text-3xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 Mont tracking-tight text-center">
                    Sightseeing Packages <br /> <span className="text-emerald-500 font-serif italic">Across India</span>
                </h1>

                {/* Search Bar */}
                <div className="w-full max-w-4xl bg-white rounded-full p-2.5 flex flex-col md:flex-row gap-1 items-center border border-slate-200 hover:border-emerald-500/30 transition-colors">

                    {/* State Dropdown */}
                    <div className="flex-1 w-full relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors">
                            <FaMapMarkerAlt size={10} />
                        </div>
                        <select
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full h-9 pl-10 pr-6 rounded-full bg-slate-50 hover:bg-slate-100 border-none text-slate-600 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors"
                        >
                            <option value="">Select State</option>
                            {states.map(state => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                        <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 text-[8px] pointer-events-none" />
                    </div>

                    <div className="h-5 w-[1px] bg-slate-200 hidden md:block"></div>

                    {/* City Dropdown */}
                    <div className="flex-1 w-full relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors">
                            <FaMapMarkerAlt size={10} />
                        </div>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            disabled={!selectedState}
                            className={`w-full h-9 pl-10 pr-6 rounded-full bg-slate-50 border-none text-slate-600 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors ${!selectedState ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-100'}`}
                        >
                            <option value="">Select City</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 text-[8px] pointer-events-none" />
                    </div>

                    <div className="h-5 w-[1px] bg-slate-200 hidden md:block"></div>

                    {/* Members (Optional) */}
                    <div className="w-full md:w-auto relative">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors">
                            <FaUserFriends size={10} />
                        </div>
                        <select
                            value={members}
                            onChange={(e) => setMembers(e.target.value)}
                            className="w-full md:w-40 h-9 pl-10 pr-6 rounded-full bg-slate-50 hover:bg-slate-100 border-none text-slate-600 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors"
                        >
                            <option value="">Members</option>
                            <option value="1">1 Person</option>
                            <option value="2">2 People</option>
                            <option value="4">4 People</option>
                            <option value="6">6 People</option>
                            <option value="10+">10+ Group</option>
                        </select>
                        <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 text-[8px] pointer-events-none" />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="w-full md:w-auto h-9 px-6 bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-medium rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wide ml-1"
                    >
                        <FaSearch size={8} />
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}
