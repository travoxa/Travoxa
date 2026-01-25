
"use client";

import { useState } from "react";
import { FiSearch, FiChevronDown, FiFilter, FiX } from "react-icons/fi";
import { tourData } from "@/data/tourData";

interface FilterState {
    searchQuery: string;
    priceRange: string;
    duration: string;
}

interface TourFilterSearchProps {
    onFilterChange: (filters: FilterState) => void;
}

export default function TourFilterSearch({ onFilterChange }: TourFilterSearchProps) {
    const [filters, setFilters] = useState<FilterState>({
        searchQuery: "",
        priceRange: "Any Price",
        duration: "Any Duration",
    });

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);

        if (name === "searchQuery") {
            if (value.length > 0) {
                const uniqueSuggestions = Array.from(new Set(
                    tourData
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
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setFilters({ ...filters, searchQuery: suggestion });
        setShowSuggestions(false);
        onFilterChange({ ...filters, searchQuery: suggestion });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSearch = () => {
        onFilterChange(filters);
        setShowMobileFilter(false);
    };

    return (
        <>
            {/* Mobile Filter Toggle Button */}
            <div className="md:hidden w-full flex justify-center py-4 px-4">
                <div className="flex items-center gap-2 w-full max-w-md">
                    {/* Search Input - Mobile */}
                    <div className="flex-1 relative">
                        <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 px-4 py-2.5 shadow-md">
                            <FiSearch className="text-gray-400 text-sm" />
                            <input
                                type="text"
                                name="searchQuery"
                                placeholder="Search tours..."
                                value={filters.searchQuery}
                                onChange={handleInputChange}
                                onFocus={() => filters.searchQuery && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                                autoComplete="off"
                            />
                        </div>
                        {/* Mobile Suggestions */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSuggestionClick(suggestion);
                                        }}
                                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                                    >
                                        {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Capsule Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilter(true)}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-full shadow-md hover:bg-gray-800 transition-colors"
                    >
                        <FiFilter size={14} />
                        <span className="text-xs font-medium">Filters</span>
                    </button>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {showMobileFilter && (
                <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowMobileFilter(false)}
                    />

                    {/* Filter Box */}
                    <div className="relative bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
                        {/* Header with Close */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                            <button
                                onClick={() => setShowMobileFilter(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {/* Filter Options */}
                        <div className="p-6 space-y-6">
                            {/* Price Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                <div className="relative">
                                    <select
                                        name="priceRange"
                                        value={filters.priceRange}
                                        onChange={handleSelectChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:border-black"
                                    >
                                        <option value="Any Price">Any Price</option>
                                        <option value="Low to High">Price: Low to High</option>
                                        <option value="High to Low">Price: High to Low</option>
                                        <option value="Under $1000">Under $1000</option>
                                        <option value="$1000 - $2000">$1000 - $2000</option>
                                        <option value="Above $2000">Above $2000</option>
                                    </select>
                                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Duration Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                                <div className="relative">
                                    <select
                                        name="duration"
                                        value={filters.duration}
                                        onChange={handleSelectChange}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm font-medium text-gray-900 appearance-none focus:outline-none focus:border-black"
                                    >
                                        <option value="Any Duration">Any Duration</option>
                                        <option value="Short to Long">Duration: Short to Long</option>
                                        <option value="Long to Short">Duration: Long to Short</option>
                                        <option value="Short (< 5 Days)">Short (&lt; 5 Days)</option>
                                        <option value="Medium (5-8 Days)">Medium (5-8 Days)</option>
                                        <option value="Long (> 8 Days)">Long (&gt; 8 Days)</option>
                                    </select>
                                    <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Apply Button */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
                            <button
                                onClick={handleSearch}
                                className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Desktop Filter Bar - Unchanged */}
            <div className="hidden md:flex w-full justify-center py-8">
                <div className="bg-white/90 backdrop-blur-md rounded-full border border-gray-200 p-2 inline-flex flex-row items-center gap-2 shadow-lg transition-all hover:shadow-xl w-auto max-w-4xl">

                    {/* Search Input */}
                    <div className="relative flex items-center gap-2 px-4 w-auto z-50">
                        <FiSearch className="text-gray-400" />
                        <input
                            type="text"
                            name="searchQuery"
                            placeholder="Where do you want to go?"
                            value={filters.searchQuery}
                            onChange={handleInputChange}
                            onFocus={() => filters.searchQuery && setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 min-w-[200px]"
                            autoComplete="off"
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 mt-2 w-[300px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-2">
                                    <p className="text-xs font-semibold text-gray-400 px-3 py-2 uppercase tracking-wider">Suggestions</p>
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleSuggestionClick(suggestion);
                                            }}
                                            className="px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer text-sm text-gray-700 font-medium flex items-center gap-2 transition-colors"
                                        >
                                            <FiSearch className="text-gray-300 w-3 h-3" />
                                            {suggestion}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-6 w-px bg-gray-200 mx-2"></div>

                    {/* Filters */}
                    <div className="flex flex-nowrap items-center gap-2 px-2 w-auto justify-center">

                        <div className="relative group">
                            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-gray-50 hover:bg-white hover:border-black/20 transition-colors cursor-pointer">
                                <span className="text-xs text-gray-500 font-medium">Price</span>
                                <select
                                    name="priceRange"
                                    value={filters.priceRange}
                                    onChange={handleSelectChange}
                                    className="bg-transparent border-none outline-none text-xs font-semibold text-gray-900 appearance-none cursor-pointer pr-4 focus:ring-0"
                                >
                                    <option value="Any Price">Any Price</option>
                                    <option value="Low to High">Price: Low to High</option>
                                    <option value="High to Low">Price: High to Low</option>
                                    <option value="Under $1000">Under $1000</option>
                                    <option value="$1000 - $2000">$1000 - $2000</option>
                                    <option value="Above $2000">Above $2000</option>
                                </select>
                                <FiChevronDown className="absolute right-3 text-gray-400 text-xs pointer-events-none" />
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-gray-50 hover:bg-white hover:border-black/20 transition-colors cursor-pointer">
                                <span className="text-xs text-gray-500 font-medium">Duration</span>
                                <select
                                    name="duration"
                                    value={filters.duration}
                                    onChange={handleSelectChange}
                                    className="bg-transparent border-none outline-none text-xs font-semibold text-gray-900 appearance-none cursor-pointer pr-4 focus:ring-0"
                                >
                                    <option value="Any Duration">Any Duration</option>
                                    <option value="Short to Long">Duration: Short to Long</option>
                                    <option value="Long to Short">Duration: Long to Short</option>
                                    <option value="Short (< 5 Days)">Short (&lt; 5 Days)</option>
                                    <option value="Medium (5-8 Days)">Medium (5-8 Days)</option>
                                    <option value="Long (> 8 Days)">Long (&gt; 8 Days)</option>
                                </select>
                                <FiChevronDown className="absolute right-3 text-gray-400 text-xs pointer-events-none" />
                            </div>
                        </div>

                        <button
                            onClick={handleSearch}
                            className="bg-black text-white p-3 rounded-full hover:bg-green-600 transition-colors shadow-md active:scale-95 ml-2"
                        >
                            <FiSearch size={16} />
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}
