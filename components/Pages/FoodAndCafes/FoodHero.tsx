
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch, FaMapMarkerAlt, FaUtensils, FaChevronDown } from "react-icons/fa";
import { foodPackages } from "@/data/foodData";

interface FoodHeroProps {
    onSearch: (filters: {
        state: string;
        city: string;
        category: string;
        dishType: string;
        famousDish: string;
        priceRange: string;
    }) => void;
}

export default function FoodHero({ onSearch }: FoodHeroProps) {
    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]); // This will map to 'category' or 'cuisine' based on need

    // Form State
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDishType, setSelectedDishType] = useState("");
    const [famousDish, setFamousDish] = useState("");
    const [selectedPriceRange, setSelectedPriceRange] = useState("");

    // Initialize States from data
    useEffect(() => {
        const uniqueStates = Array.from(new Set(foodPackages.map(pkg => pkg.state)));
        setStates(uniqueStates.sort());

        const uniqueCategories = Array.from(new Set(foodPackages.map(pkg => pkg.category)));
        setCategories(uniqueCategories.sort());
    }, []);

    // Update Cities when State changes
    useEffect(() => {
        if (selectedState) {
            const relevantCities = foodPackages
                .filter(pkg => pkg.state === selectedState)
                .map(pkg => pkg.city);
            setCities(Array.from(new Set(relevantCities)).sort());
            setSelectedCity(""); // Reset city when state changes
        } else {
            setCities([]);
        }
    }, [selectedState]);

    const handleSearch = () => {
        onSearch({
            state: selectedState,
            city: selectedCity,
            category: selectedCategory,
            dishType: selectedDishType,
            famousDish: famousDish,
            priceRange: selectedPriceRange
        });
    };

    return (
        <div className="relative mx-[12px] mt-[12px] rounded-[12px] h-[65vh] min-h-[550px] overflow-hidden flex flex-col justify-between pt-24 pb-12 px-8 md:px-16 transition-all duration-500">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://res.cloudinary.com/dta29uych/image/upload/v1771257014/lucid-origin_A_wide_high-quality_flat_vector_illustration_suitable_for_a_website_hero_backgro-0_5_h7hnix.jpg"
                    alt="Food and Cafes Background"
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
                            Taste of India <br />
                            <span className="italic font-serif text-yellow-600 text-[1.1em]">Cafes & Delights</span>
                        </h1>
                    </div>
                </div>

                {/* Bottom Section: Search Bar */}
                <div className="flex flex-col md:flex-row items-end gap-4 mt-8">
                    <div className="w-full max-w-5xl pr-8 md:pr-0" data-aos="fade-up" data-aos-delay="800">
                        <label className="block text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-3 ml-2">Discover Food & Cafes</label>
                        <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-4 flex flex-col gap-4 border border-slate-200 shadow-2xl relative z-20">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {/* State Dropdown */}
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-yellow-500 transition-colors">
                                        <FaMapMarkerAlt size={10} />
                                    </div>
                                    <select
                                        value={selectedState}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        className="w-full h-11 pl-10 pr-6 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-yellow-200 text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500/20 appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">Select State</option>
                                        {states.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* City Dropdown */}
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-yellow-500 transition-colors">
                                        <FaMapMarkerAlt size={10} />
                                    </div>
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        disabled={!selectedState}
                                        className={`w-full h-11 pl-10 pr-6 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500/20 appearance-none cursor-pointer transition-all ${!selectedState ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:border-yellow-200'}`}
                                    >
                                        <option value="">Select City</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Food Type */}
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-yellow-500 transition-colors">
                                        <FaUtensils size={10} />
                                    </div>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full h-11 pl-10 pr-6 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-yellow-200 text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500/20 appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">Food Type</option>
                                        {['Restaurant', 'Cafe', 'Dhaba', 'Street Food'].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dish Type */}
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-yellow-500 transition-colors">
                                        <FaUtensils size={10} />
                                    </div>
                                    <select
                                        value={selectedDishType}
                                        onChange={(e) => setSelectedDishType(e.target.value)}
                                        className="w-full h-11 pl-10 pr-6 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-yellow-200 text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500/20 appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">Dish Type</option>
                                        <option value="Veg">Veg Only</option>
                                        <option value="Non-Veg">Non-Veg</option>
                                        <option value="Both">Both</option>
                                    </select>
                                </div>

                                {/* Budget Filter */}
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-yellow-500 transition-colors">
                                        <span className="font-bold text-[10px]">₹</span>
                                    </div>
                                    <select
                                        value={selectedPriceRange}
                                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                                        className="w-full h-11 pl-10 pr-6 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-yellow-200 text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500/20 appearance-none cursor-pointer transition-all"
                                    >
                                        <option value="">Budget</option>
                                        <option value="$">Budget ($)</option>
                                        <option value="$$">Moderate ($$)</option>
                                        <option value="$$$">Premium ($$$)</option>
                                        <option value="$$$$">Luxury ($$$$)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="flex-1 relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-yellow-500 transition-colors">
                                        <FaSearch size={10} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by famous dish (e.g. Lassi, Thali...)"
                                        value={famousDish}
                                        onChange={(e) => setFamousDish(e.target.value)}
                                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-yellow-200 text-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all placeholder:text-slate-400 shadow-inner"
                                    />
                                </div>

                                {/* Search Button */}
                                <button
                                    onClick={handleSearch}
                                    className="h-12 px-8 bg-slate-900 hover:bg-yellow-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-widest shadow-lg hover:shadow-yellow-500/20"
                                >
                                    <FaSearch size={10} />
                                    Find Food
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Aesthetic Detail Box at bottom right */}
            <div className="absolute bottom-8 right-12 text-right hidden xl:block opacity-30 pointer-events-none" data-aos="fade-in" data-aos-delay="1200">
                 <p className="text-[9px] font-bold text-slate-900 uppercase tracking-[0.4em] mb-1">Discovery Protocol</p>
                 <p className="text-[8px] text-slate-500 Inter">CURATED EXPERIENCES / FOOD & CAFES</p>
            </div>
        </div>
    );
}
