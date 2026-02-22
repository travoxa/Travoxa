// app/components/Hero.tsx
"use client";

import Image from "next/image";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUserFriends, FaChevronDown, FaRegCompass } from "react-icons/fa";
import { rentalsData } from "@/data/rentalsData";
import { sightseeingPackages } from "@/data/sightseeingData";
import { tourData } from "@/data/tourData";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [showQueryDropdown, setShowQueryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const queryRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (queryRef.current && !queryRef.current.contains(event.target as Node)) {
        setShowQueryDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Collect unique locations
  const allLocations = useMemo(() => {
    const locs = new Set<string>();
    rentalsData.forEach(i => locs.add(i.location));
    sightseeingPackages.forEach(i => { locs.add(i.city); locs.add(i.state); });
    tourData.forEach(i => locs.add(i.location));
    return Array.from(locs).sort();
  }, []);

  // Collect suggestions for query
  const querySuggestions = useMemo(() => {
    if (!query) return [];
    const lowerQ = query.toLowerCase();
    const suggestions = new Set<string>();

    // Add matching titles/names
    sightseeingPackages.forEach(p => {
      if (p.title.toLowerCase().includes(lowerQ)) suggestions.add(p.title);
    });
    tourData.forEach(p => {
      if (p.title.toLowerCase().includes(lowerQ)) suggestions.add(p.title);
    });
    rentalsData.forEach(r => {
      if (r.name.toLowerCase().includes(lowerQ)) suggestions.add(r.name);
    });

    return Array.from(suggestions).slice(0, 5); // Limit to 5
  }, [query]);

  const filteredLocations = useMemo(() => {
    if (!location) return allLocations.slice(0, 8); // Show first 8 default
    return allLocations.filter(l => l.toLowerCase().includes(location.toLowerCase())).slice(0, 8);
  }, [location, allLocations]);


  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    router.push(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowQueryDropdown(false);
      setShowLocationDropdown(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center px-[12px] py-[12px]" >
      <div className="w-full h-[47vh] lg:h-[97vh] bg-center bg-cover bg-no-repeat rounded-[12px] relative" style={{ backgroundImage: `url('/hero-bg.jpg')` }} >
        {/* Overlay for better text visibility if needed */}
        <div className="absolute inset-0 bg-black/10 rounded-[12px]"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-16 md:pt-0">
          {/* Title */}
          <p className="text-center text-[14vw] md:text-[12vw] lg:text-[14vw] font-bold text-white Mont tracking-wider text-shadow-blue-400 leading-none drop-shadow-lg" data-aos="fade-down">TRAVOXA</p>

          {/* Subtitle */}
          <p className="text-center text-sm md:text-lg lg:text-2xl text-white font-medium Mont tracking-wide mt-2 mb-6 md:mb-12 drop-shadow-md" data-aos="fade-up" data-aos-delay="100">
            Your AI-Powered Travel Companion.
          </p>

          {/* Refined Search Bar Component */}
          <div className="w-full max-w-[95%] md:max-w-[90%] lg:max-w-5xl mx-auto relative z-50" data-aos="fade-up" data-aos-delay="200">

            {/* Main Search Container - Horizontal on mobile */}
            <div className="bg-white rounded-full p-1 shadow-2xl flex flex-row items-center gap-1 relative max-w-3xl mx-auto border border-slate-200">

              {/* General Search Input (Leftmost) */}
              <div ref={queryRef} className="flex-1 relative group px-2 md:px-4 py-1 md:py-1.5 rounded-full hover:bg-slate-50 transition-colors flex items-center gap-1 md:gap-2 h-8 md:h-9">
                <FaSearch className="text-slate-400 text-[10px] md:text-xs flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowQueryDropdown(true); }}
                  onFocus={() => setShowQueryDropdown(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="w-full bg-transparent border-none outline-none text-slate-700 placeholder-slate-400 text-[10px] md:text-xs font-medium focus:ring-0 p-0"
                />

                {/* Query Dropdown */}
                {showQueryDropdown && querySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    {querySuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        onClick={() => { setQuery(suggestion); setShowQueryDropdown(false); }}
                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-xs text-slate-700 font-medium flex items-center gap-2"
                      >
                        <FaSearch className="text-slate-300 text-[10px]" />
                        {suggestion}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-[1px] h-4 md:h-5 bg-slate-200"></div>

              {/* Location Field */}
              <div ref={locationRef} className="flex-1 relative group px-2 md:px-3 py-1 md:py-1.5 hover:bg-slate-50 rounded-full transition-colors cursor-pointer h-8 md:h-9 flex items-center justify-between">
                <div className="flex items-center gap-1 md:gap-2 w-full">
                  <FaMapMarkerAlt className="text-slate-400 text-[10px] md:text-xs group-hover:text-emerald-500 transition-colors flex-shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setShowLocationDropdown(true); }}
                    onFocus={() => setShowLocationDropdown(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Location"
                    className="w-full bg-transparent border-none outline-none text-slate-600 placeholder-slate-600 font-medium text-[10px] md:text-xs focus:ring-0 p-0"
                  />
                </div>
                {/* Location Dropdown */}
                {showLocationDropdown && filteredLocations.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-48 overflow-y-auto">
                    {filteredLocations.map((loc, idx) => (
                      <div
                        key={idx}
                        onClick={() => { setLocation(loc); setShowLocationDropdown(false); }}
                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-xs text-slate-700 font-medium flex items-center gap-2"
                      >
                        <FaMapMarkerAlt className="text-slate-300 text-[10px]" />
                        {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="w-[1px] h-4 md:h-5 bg-slate-200 hidden md:block"></div>

              {/* Type/Activity Field - Hidden on mobile */}
              <div className="hidden md:flex flex-1 w-full lg:w-auto relative group px-3 py-1.5 hover:bg-slate-50 rounded-full transition-colors cursor-pointer border lg:border-none border-slate-100 h-9 items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaRegCompass className="text-slate-400 text-xs group-hover:text-emerald-500 transition-colors" />
                  <span className="text-slate-600 font-medium text-xs">Type</span>
                </div>
                <FaChevronDown className="text-slate-300 text-[8px]" />
              </div>

              <div className="w-[1px] h-5 bg-slate-200 hidden lg:block"></div>

              {/* Travelers Field - Hidden on mobile */}
              <div className="hidden md:flex flex-1 w-full lg:w-auto relative group px-3 py-1.5 hover:bg-slate-50 rounded-full transition-colors cursor-pointer border lg:border-none border-slate-100 h-9 items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaUserFriends className="text-slate-400 text-xs group-hover:text-emerald-500 transition-colors" />
                  <span className="text-slate-600 font-medium text-xs">Guests</span>
                </div>
                <FaChevronDown className="text-slate-300 text-[8px]" />
              </div>

              {/* Search Button */}
              <button onClick={handleSearch} className="aspect-square h-8 md:h-9 bg-slate-900 hover:bg-emerald-600 rounded-full flex items-center justify-center text-white transition-all shadow-md active:scale-95 group ml-1">
                <FaSearch className="text-[10px] md:text-xs group-hover:scale-110 transition-transform" />
              </button>

            </div>
          </div>

          {/* Bottom Text */}
          <p className="mt-12 text-center text-sm lg:text-base text-white/90 font-medium Inter drop-shadow-md max-w-2xl px-4 hidden lg:block">
            Plan smarter with Travoxa AI, find groups with Backpackers Club, or discover budget-friendly destinations.
          </p>
        </div>
      </div>
    </div>
  );
}
