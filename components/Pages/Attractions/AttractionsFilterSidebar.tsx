
import React from 'react';
import { FaFilter, FaRedoAlt } from 'react-icons/fa';

interface AttractionsFilterSidebarProps {
    filters: {
        category: string[];
        type: string[];
    };
    onFilterChange: (type: string, value: string) => void;
    onReset: () => void;
}

const AttractionsFilterSidebar: React.FC<AttractionsFilterSidebarProps> = ({ filters, onFilterChange, onReset }) => {

    // Helper to check if item is selected
    const isSelected = (type: 'category' | 'type', value: string) => filters[type].includes(value);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-slate-900 font-bold Mont">
                    <FaFilter className="text-pink-500" size={14} />
                    <span>Filters</span>
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-pink-600 transition-colors"
                >
                    <FaRedoAlt size={10} />
                    Reset
                </button>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Category</h3>
                <div className="space-y-2.5">
                    {['Historical', 'Religious', 'Modern', 'UNESCO', 'Nature'].map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected('category', cat)
                                    ? 'bg-pink-500 border-pink-500'
                                    : 'border-slate-300 group-hover:border-pink-400 bg-white'
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

            {/* Type Filter */}
            <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Type</h3>
                <div className="space-y-2.5">
                    {['Palace', 'Museum', 'Temple', 'Monument', 'Tower'].map((t) => (
                        <label key={t} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isSelected('type', t)
                                    ? 'bg-pink-500 border-pink-500'
                                    : 'border-slate-300 group-hover:border-pink-400 bg-white'
                                }`}>
                                {isSelected('type', t) && <span className="text-white text-[10px]">✓</span>}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={isSelected('type', t)}
                                onChange={() => onFilterChange('type', t)}
                            />
                            <span className={`text-[13px] Inter transition-colors ${isSelected('type', t) ? 'text-slate-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'
                                }`}>
                                {t}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AttractionsFilterSidebar;
