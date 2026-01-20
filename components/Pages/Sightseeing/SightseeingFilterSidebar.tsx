
"use client";

import { FaFilter, FaRedo } from "react-icons/fa";

interface SightseeingFilterSidebarProps {
    filters: {
        duration: string[];
        vehicleType: string[];
        priceRange: string;
    };
    onFilterChange: (type: string, value: string) => void;
    onReset: () => void;
}

export default function SightseeingFilterSidebar({ filters, onFilterChange, onReset }: SightseeingFilterSidebarProps) {

    // Helper to handle checkbox changes
    const handleCheckboxChange = (type: string, value: string) => {
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

            {/* Duration Filter */}
            <div className="mb-8">
                <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Duration</h4>
                <div className="space-y-3">
                    {['Half Day', 'Full Day'].map(duration => (
                        <label key={duration} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.duration.includes(duration) ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                {filters.duration.includes(duration) && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.duration.includes(duration)}
                                onChange={() => handleCheckboxChange('duration', duration)}
                            />
                            <span className={`text-xs ${filters.duration.includes(duration) ? 'text-slate-900 font-medium' : 'text-slate-500 font-light'} Inter group-hover:text-emerald-600 transition-colors`}>{duration}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Vehicle Type Filter */}
            <div className="mb-8">
                <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Vehicle Type</h4>
                <div className="space-y-3">
                    {['Sedan', 'SUV', 'Tempo Traveller', 'Mini Bus'].map(vehicle => (
                        <label key={vehicle} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.vehicleType.includes(vehicle) ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                {filters.vehicleType.includes(vehicle) && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.vehicleType.includes(vehicle)}
                                onChange={() => handleCheckboxChange('vehicleType', vehicle)}
                            />
                            <span className={`text-xs ${filters.vehicleType.includes(vehicle) ? 'text-slate-900 font-medium' : 'text-slate-500 font-light'} Inter group-hover:text-emerald-600 transition-colors`}>{vehicle}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div>
                <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Price Range</h4>
                <div className="space-y-3">
                    {['Under ₹2000', '₹2000 - ₹5000', 'Above ₹5000'].map(range => (
                        <label key={range} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.priceRange === range ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                {filters.priceRange === range && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                            </div>
                            <input
                                type="radio"
                                className="hidden"
                                checked={filters.priceRange === range}
                                onChange={() => handleCheckboxChange('priceRange', range)}
                            />
                            <span className={`text-xs ${filters.priceRange === range ? 'text-slate-900 font-medium' : 'text-slate-500 font-light'} Inter group-hover:text-emerald-600 transition-colors`}>{range}</span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
}
