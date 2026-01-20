
import React from 'react';
import { FaFilter, FaRedoAlt } from 'react-icons/fa';

interface FoodFilterSidebarProps {
    filters: {
        category: string[];
        cuisine: string[];
        priceRange: string[];
    };
    onFilterChange: (type: string, value: string) => void;
    onReset: () => void;
}

const FoodFilterSidebar: React.FC<FoodFilterSidebarProps> = ({ filters, onFilterChange, onReset }) => {

    // Helper to check if item is selected
    const isSelected = (type: 'category' | 'cuisine' | 'priceRange', value: string) => filters[type].includes(value);

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
            <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Price</h3>
                <div className="space-y-2.5">
                    {['₹', '₹₹', '₹₹₹', '₹₹₹₹'].map((p) => (
                        <label key={p} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected('priceRange', p)
                                    ? 'bg-yellow-500 border-yellow-500'
                                    : 'border-slate-300 group-hover:border-yellow-400 bg-white'
                                }`}>
                                {isSelected('priceRange', p) && <span className="text-white text-[10px]">✓</span>}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isSelected('priceRange', p)}
                                onChange={() => onFilterChange('priceRange', p)}
                            />
                            <span className={`text-[13px] Inter transition-colors ${isSelected('priceRange', p) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'
                                }`}>
                                {p}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default FoodFilterSidebar;
