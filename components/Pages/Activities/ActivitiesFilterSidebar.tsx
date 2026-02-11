import React from 'react';
import { FaFilter, FaRedoAlt, FaBolt } from 'react-icons/fa';

interface ActivitiesFilterSidebarProps {
    filters: {
        category: string[];
        level: string[];
        priceRange: string;
        suitableFor: string[];
    };
    onFilterChange: (type: string, value: string) => void;
    onReset: () => void;
}

const ActivitiesFilterSidebar: React.FC<ActivitiesFilterSidebarProps> = ({ filters, onFilterChange, onReset }) => {

    // Helper to check if item is selected
    const isSelected = (type: 'category' | 'level' | 'suitableFor', value: string) => filters[type].includes(value);

    const ACTIVITY_TYPES = [
        'Trekking', 'Paragliding', 'Scuba Diving', 'River Rafting', 'Camping',
        'Skiing', 'Bungee Jumping', 'Water Sports', 'Wildlife Safari'
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-slate-900 font-bold Mont">
                    <FaFilter className="text-orange-500" size={14} />
                    <span>Filters</span>
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-orange-600 transition-colors"
                >
                    <FaRedoAlt size={10} />
                    Reset
                </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Activity Type</h3>
                <div className="space-y-2.5">
                    {ACTIVITY_TYPES.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected('category', cat)
                                ? 'bg-orange-500 border-orange-500'
                                : 'border-slate-300 group-hover:border-orange-400 bg-white'
                                }`}>
                                {isSelected('category', cat) && <span className="text-white text-[10px]">✓</span>}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isSelected('category', cat)}
                                onChange={() => onFilterChange('category', cat)}
                            />
                            <span className={`text-[13px] Inter transition-colors ${isSelected('category', cat) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'
                                }`}>
                                {cat}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Level Filter */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Difficulty Level</h3>
                <div className="space-y-2.5">
                    {['Easy', 'Moderate', 'Difficult'].map((lvl) => (
                        <label key={lvl} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected('level', lvl)
                                ? 'bg-orange-500 border-orange-500'
                                : 'border-slate-300 group-hover:border-orange-400 bg-white'
                                }`}>
                                {isSelected('level', lvl) && <span className="text-white text-[10px]">✓</span>}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isSelected('level', lvl)}
                                onChange={() => onFilterChange('level', lvl)}
                            />
                            <span className={`text-[13px] Inter transition-colors ${isSelected('level', lvl) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'
                                }`}>
                                {lvl}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Suitable For Filter */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Suitable For</h3>
                <div className="space-y-2.5">
                    {['Solo', 'Couple', 'Family', 'Friends', 'Kids'].map((opt) => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected('suitableFor', opt)
                                ? 'bg-orange-500 border-orange-500'
                                : 'border-slate-300 group-hover:border-orange-400 bg-white'
                                }`}>
                                {isSelected('suitableFor', opt) && <span className="text-white text-[10px]">✓</span>}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isSelected('suitableFor', opt)}
                                onChange={() => onFilterChange('suitableFor', opt)}
                            />
                            <span className={`text-[13px] Inter transition-colors ${isSelected('suitableFor', opt) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'
                                }`}>
                                {opt}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Price Range</h3>
                <div className="space-y-2">
                    {["Under ₹2000", "₹2000 - ₹5000", "Above ₹5000"].map((range) => (
                        <label key={range} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.priceRange === range
                                ? 'border-orange-500'
                                : 'border-slate-300 group-hover:border-orange-400'
                                }`}>
                                {filters.priceRange === range && (
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                )}
                            </div>
                            <input
                                type="radio"
                                name="price"
                                className="hidden"
                                checked={filters.priceRange === range}
                                onChange={() => onFilterChange('priceRange', range)}
                            />
                            <span className={`text-[13px] Inter transition-colors ${filters.priceRange === range ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'
                                }`}>
                                {range}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ActivitiesFilterSidebar;
