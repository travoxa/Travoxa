"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FiMapPin, FiUser, FiClock, FiChevronDown, FiSliders, FiSearch } from "react-icons/fi";
import { tourData } from "@/data/tourData";

export default function HomeFilterSearch() {
  const router = useRouter();
  const [location, setLocation] = useState("Any Location");
  const [priceRange, setPriceRange] = useState("Any Price");
  const [guests, setGuests] = useState("1 Guest");

  // Extract unique locations
  const uniqueLocations = useMemo(() => {
    // Get all locations
    const locs = tourData.map(t => t.location);
    // Unique and sort
    return Array.from(new Set(locs)).sort();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location !== "Any Location") params.set("searchQuery", location);
    if (priceRange !== "Any Price") params.set("priceRange", priceRange);
    params.set("guests", guests);

    router.push(`/tour?${params.toString()}`);
  };

  return (
    <div className="w-full flex justify-center py-8">
      <div className="bg-white/80 backdrop-blur-md rounded-full border border-gray-200 p-2 inline-flex flex-col md:flex-row items-center gap-2 shadow-sm">

        {/* Buttons */}
        <button className="px-6 py-2 rounded-full bg-black text-white text-sm font-medium">Tour Packages</button>

        <div className="hidden md:block h-6 w-px bg-gray-300 mx-2"></div>

        {/* Search */}
        <div className="flex flex-col md:flex-row items-center gap-2 px-4">

          {/* Location Selector */}
          <div className="relative group w-full md:w-auto">
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white cursor-pointer hover:border-black/20 transition-colors">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Location</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-semibold text-gray-900 appearance-none cursor-pointer pr-4 focus:ring-0 w-full md:w-32 max-w-[150px] truncate"
              >
                <option value="Any Location">Any Location</option>
                {uniqueLocations.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>

          {/* Budget Selector */}
          <div className="relative group w-full md:w-auto">
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white cursor-pointer hover:border-black/20 transition-colors">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Budget</span>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-semibold text-gray-900 appearance-none cursor-pointer pr-4 focus:ring-0 w-full md:w-24"
              >
                <option value="Any Price">Any Price</option>
                <option value="Under ₹1000">Under ₹1000</option>
                <option value="₹1000 - ₹2000">₹1000 - ₹2000</option>
                <option value="Above ₹2000">Above ₹2000</option>
              </select>
              <FiChevronDown className="absolute right-3 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>

          {/* Guest Selector */}
          <div className="relative group w-full md:w-auto">
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white cursor-pointer hover:border-black/20 transition-colors">
              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Guest</span>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="bg-transparent border-none outline-none text-xs font-semibold text-gray-900 appearance-none cursor-pointer pr-4 focus:ring-0 w-full md:w-24"
              >
                <option value="1 Guest">1 Guest</option>
                <option value="2 Guests">2 Guests</option>
                <option value="3-5 Guests">3-5 Guests</option>
                <option value="5+ Guests">5+ Guests</option>
              </select>
              <FiChevronDown className="absolute right-3 text-gray-400 text-xs pointer-events-none" />
            </div>
          </div>

          <button
            onClick={handleSearch}
            className="bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors ml-2 shadow-md"
          >
            <FiSearch size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}

// divider component
function Divider() {
  return <div className="h-10 w-px bg-gray-300" />;
}
