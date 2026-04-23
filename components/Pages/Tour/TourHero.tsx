
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";

interface TourHeroProps {
    onSearch: (filters: { searchQuery: string }) => void;
    packages: any[];
}

export default function TourHero({ onSearch, packages }: TourHeroProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.length > 0) {
            const uniqueSuggestions = Array.from(new Set(
                packages
                    .filter((pkg: any) =>
                        pkg.title.toLowerCase().includes(value.toLowerCase()) ||
                        pkg.location.toLowerCase().includes(value.toLowerCase())
                    )
                    .map((pkg: any) => pkg.title)
            )).slice(0, 5) as string[];
            setSuggestions(uniqueSuggestions);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
        onSearch({ searchQuery: suggestion });
    };

    const handleSearch = () => {
        onSearch({ searchQuery });
        setShowSuggestions(false);
    };

    return (
        <div className="relative mx-[12px] mt-[12px] rounded-[12px] h-[65vh] min-h-[550px] overflow-hidden flex flex-col justify-between pt-24 pb-12 px-8 md:px-16 transition-all duration-500">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://res.cloudinary.com/dta29uych/image/upload/v1776543551/ideogram-v3.0_cinematic_wide-angle_composition_representing_India_travel_Taj_Mahal_at_sunrise_-0_u8dy7h.png"
                    alt="Tour Background"
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
                        <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold tracking-widest uppercase mb-4 border border-white/30 text-slate-800">
                            Discover the World
                        </span>
                        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-slate-900 Mont leading-[1] tracking-tight mb-6 drop-shadow-sm" data-aos="fade-right">
                            Curated Tours for the <br />
                            <span className="italic font-serif text-emerald-600 text-[1.1em]">Modern Explorer</span>
                        </h1>
                    </div>
                </div>

                {/* Bottom Section: Search Bar */}
                <div className="flex flex-col md:flex-row items-end gap-4 mt-8">
                    <div className="w-full max-w-4xl" data-aos="fade-up" data-aos-delay="800">
                        <label className="block text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-3 ml-2">Discover Tours</label>
                        <div className="w-full bg-white/90 backdrop-blur-sm rounded-full p-2.5 flex flex-col md:flex-row gap-1 items-center border border-slate-200 hover:border-emerald-500/30 transition-colors shadow-lg">

                            {/* Search Input */}
                            <div className="flex-1 w-full relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors">
                                    <FaSearch size={10} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Where do you want to go?"
                                    value={searchQuery}
                                    onChange={handleInputChange}
                                    onFocus={() => searchQuery && setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    className="w-full h-9 pl-10 pr-6 rounded-full bg-transparent hover:bg-slate-50 border-none text-slate-700 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors"
                                />
                                
                                {/* Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 mt-4 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-2">
                                            <p className="text-[10px] font-semibold text-gray-400 px-3 py-2 uppercase tracking-wider">Suggestions</p>
                                            {suggestions.map((suggestion, index) => (
                                                <div
                                                    key={index}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        handleSuggestionClick(suggestion);
                                                    }}
                                                    className="px-3 py-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs text-slate-700 font-medium flex items-center gap-2 transition-colors"
                                                >
                                                    <FaSearch size={8} className="text-slate-300" />
                                                    {suggestion}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                className="w-full md:w-auto h-9 px-8 bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-medium rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wide ml-1 shadow-md"
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
                 <p className="text-[8px] text-slate-500 Inter">CURATED EXPERIENCES / TOURS</p>
            </div>
        </div>
    );
}
