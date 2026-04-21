
"use client";

import { FaFilter, FaRedo } from "react-icons/fa";

interface TourFilterSidebarProps {
    filters: {
        priceRange: string;
        duration: string;
    };
    onFilterChange: (type: string, value: string) => void;
    onReset: () => void;
}

export default function TourFilterSidebar({ filters, onFilterChange, onReset }: TourFilterSidebarProps) {

    const handleFilterClick = (type: string, value: string) => {
        onFilterChange(type, value);
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-medium text-slate-900 Mont tracking-wide">
                    FILTERS
                </h3>
                <button
                    onClick={onReset}
                    className="text-[10px] font-medium text-slate-400 hover:text-emerald-600 transition-colors uppercase tracking-wider"
                >
                    Clear All
                </button>
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
                <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Price Range</h4>
                <div className="space-y-3">
                    {[
                        "Any Price",
                        "Low to High",
                        "High to Low",
                        "Under ₹1000",
                        "₹1000 - ₹2000",
                        "Above ₹2000"
                    ].map(range => (
                        <label key={range} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.priceRange === range ? 'border-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                {filters.priceRange === range && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                            </div>
                            <input
                                type="radio"
                                name="priceRange"
                                className="hidden"
                                checked={filters.priceRange === range}
                                onChange={() => handleFilterClick('priceRange', range)}
                            />
                            <span className={`text-xs ${filters.priceRange === range ? 'text-slate-900 font-medium' : 'text-slate-500 font-light'} Inter group-hover:text-emerald-600 transition-colors`}>{range}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Duration Filter */}
            <div>
                <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Duration</h4>
                <div className="space-y-3">
                    {[
                        "Any Duration",
                        "Short to Long",
                        "Long to Short",
                        "Short (< 5 Days)",
                        "Medium (5-8 Days)",
                        "Long (> 8 Days)"
                    ].map(duration => (
                        <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                             <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.duration === duration ? 'border-emerald-500 shadow-[0_0_0_1px_rgba(16,185,129,0.2)]' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                {filters.duration === duration && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>}
                            </div>
                            <input
                                type="radio"
                                name="duration"
                                className="hidden"
                                checked={filters.duration === duration}
                                onChange={() => handleFilterClick('duration', duration)}
                            />
                            <span className={`text-xs ${filters.duration === duration ? 'text-slate-900 font-medium' : 'text-slate-500 font-light'} Inter group-hover:text-emerald-600 transition-colors`}>{duration}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
