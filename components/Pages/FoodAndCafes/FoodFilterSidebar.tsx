
import React from 'react';
import { FaFilter, FaRedoAlt } from 'react-icons/fa';

interface FoodFilterSidebarProps {
    filters: {
        category: string[];
        cuisine: string[];
        priceRange: string[]; // This will now store values like '1', '2', '3', '4'
    };
    onFilterChange: (type: string, value: string) => void;
    onReset: () => void;
}

const FoodFilterSidebar: React.FC<FoodFilterSidebarProps> = ({ filters, onFilterChange, onReset }) => {

    const isSelected = (type: 'category' | 'cuisine' | 'priceRange', value: string) =>
        filters[type].includes(value);

    // Price Brackets Mapping
    const priceBrackets = [
        { id: '1', symbol: '₹', label: 'Under ₹500' },
        { id: '2', symbol: '₹₹', label: '₹500 - ₹1,500' },
        { id: '3', symbol: '₹₹₹', label: '₹1,500 - ₹3,000' },
        { id: '4', symbol: '₹₹₹₹', label: '₹3,000+' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-slate-900 font-bold Mont">
                    <FaFilter className="text-yellow-500" size={14} />
                    <span>Filters</span>
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-yellow-600 transition-colors"
                >
                    <FaRedoAlt size={10} />
                    Reset
                </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Category</h3>
                <div className="space-y-2.5">
                    {['Street Food', 'Cafes', 'Fine Dining', 'Bakeries', 'Regional'].map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected('category', cat)
                                ? 'bg-yellow-500 border-yellow-500'
                                : 'border-slate-300 group-hover:border-yellow-400 bg-white'
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

            {/* Cuisine Filter */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Cuisine</h3>
                <div className="space-y-2.5">
                    {['North Indian', 'South Indian', 'Continental', 'Asian', 'Local'].map((c) => (
                        <label key={c} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected('cuisine', c)
                                ? 'bg-yellow-500 border-yellow-500'
                                : 'border-slate-300 group-hover:border-yellow-400 bg-white'
                                }`}>
                                {isSelected('cuisine', c) && <span className="text-white text-[10px]">✓</span>}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isSelected('cuisine', c)}
                                onChange={() => onFilterChange('cuisine', c)}
                            />
                            <span className={`text-[13px] Inter transition-colors ${isSelected('cuisine', c) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'
                                }`}>
                                {c}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Price Range</h3>
                <div className="space-y-3.5">
                    {priceBrackets.map((range) => (
                        <label key={range.id} className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-3">
                                {/* Custom Checkbox UI */}
                                <div className={`w-3.5 h-3.5 rounded border transition-all flex items-center justify-center ${isSelected('priceRange', range.id)
                                        ? 'bg-[#0F172A] border-[#0F172A]'
                                        : 'border-slate-200 group-hover:border-slate-400 bg-white'
                                    }`}>
                                    {isSelected('priceRange', range.id) && (
                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    )}
                                </div>

                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isSelected('priceRange', range.id)}
                                    onChange={() => onFilterChange('priceRange', range.id)}
                                />

                                <span className={`text-[12px] Inter transition-colors ${isSelected('priceRange', range.id) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'
                                    }`}>
                                    {range.label}
                                </span>
                            </div>

                          
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default FoodFilterSidebar;
