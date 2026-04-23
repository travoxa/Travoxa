
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUserFriends, FaChevronDown } from "react-icons/fa";
import { SightseeingPackage } from "@/data/sightseeingData";

interface SightseeingHeroProps {
    onSearch: (filters: { state: string; city: string; date: string }) => void;

    packages: SightseeingPackage[];
}

export default function SightseeingHero({ onSearch, packages }: SightseeingHeroProps) {
    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    // Form State
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");


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
        });
    };

    return (
        <div className="relative mx-[12px] mt-[12px] rounded-[12px] h-[65vh] min-h-[550px] overflow-hidden flex flex-col justify-between pt-24 pb-12 px-8 md:px-16 transition-all duration-500">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://res.cloudinary.com/dta29uych/image/upload/v1771250859/lucid-origin_A_wide_high-quality_flat_vector_illustration_suitable_for_a_website_hero_backgro-0_ikntyn.jpg"
                    alt="Sightseeing Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
                {/* Gradient Overlay for blending at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/90"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col justify-between relative z-10">
                
                {/* Top Section: Typography */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                    <div className="max-w-2xl">
                        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-slate-900 Mont leading-[1] tracking-tight mb-6 drop-shadow-sm" data-aos="fade-right">
                            Sightseeing Packages <br />
                            <span className="italic font-serif text-emerald-600 text-[1.1em]">Across India</span>
                        </h1>
                    </div>
                </div>

                {/* Bottom Section: Search Bar */}
                <div className="flex flex-col md:flex-row items-end gap-4 mt-8">
                    <div className="w-full max-w-4xl" data-aos="fade-up" data-aos-delay="800">
                        <label className="block text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-3 ml-2">Discover Sightseeing</label>
                        <div className="w-full bg-white/90 backdrop-blur-sm rounded-full p-2.5 flex flex-col md:flex-row gap-1 items-center border border-slate-200 hover:border-emerald-500/30 transition-colors shadow-lg">

                            {/* State Dropdown */}
                            <div className="flex-1 w-full relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors">
                                    <FaMapMarkerAlt size={10} />
                                </div>
                                <select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    className="w-full h-9 pl-10 pr-6 rounded-full bg-transparent hover:bg-slate-50 border-none text-slate-700 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors"
                                >
                                    <option value="">Select State</option>
                                    {states.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                                <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-[8px] pointer-events-none" />
                            </div>

                            <div className="h-5 w-[1px] bg-slate-300 hidden md:block"></div>

                            {/* City Dropdown */}
                            <div className="flex-1 w-full relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors">
                                    <FaMapMarkerAlt size={10} />
                                </div>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    disabled={!selectedState}
                                    className={`w-full h-9 pl-10 pr-6 rounded-full bg-transparent border-none text-slate-700 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors ${!selectedState ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                                >
                                    <option value="">Select City</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-[8px] pointer-events-none" />
                            </div>

                            <div className="h-5 w-[1px] bg-slate-300 hidden md:block"></div>

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                className="w-full md:w-auto h-9 px-6 bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-medium rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wide ml-1 shadow-md"
                            >
                                <FaSearch size={8} />
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aesthetic Detail Box at bottom right */}
            <div className="absolute bottom-8 right-12 text-right hidden xl:block opacity-30 pointer-events-none" data-aos="fade-in" data-aos-delay="1200">
                 <p className="text-[9px] font-bold text-slate-900 uppercase tracking-[0.4em] mb-1">Discovery Protocol</p>
                 <p className="text-[8px] text-slate-500 Inter">CURATED EXPERIENCES / SIGHTSEEING</p>
            </div>
        </div>
    );
}
