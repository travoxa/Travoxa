"use client";

interface StayFilterSidebarProps {
    filters: {
        type: string[];
        priceRange: string;
        amenities: string[];
    };
    onFilterChange: (type: string, value: string) => void;
    onReset: () => void;
}

export default function StayFilterSidebar({ filters, onFilterChange, onReset }: StayFilterSidebarProps) {

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

            {/* Type Filter */}
            <div className="mb-8">
                <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Property Type</h4>
                <div className="space-y-3">
                    {['Hotel', 'Resort', 'Homestay', 'Villa', 'Apartment', 'Hostel', 'Campsite'].map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.type.includes(type) ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                {filters.type.includes(type) && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.type.includes(type)}
                                onChange={() => handleCheckboxChange('type', type)}
                            />
                            <span className={`text-xs ${filters.type.includes(type) ? 'text-slate-900 font-medium' : 'text-slate-500 font-light'} Inter group-hover:text-emerald-600 transition-colors`}>{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
                <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Price Range</h4>
                <div className="space-y-3">
                    {['Under ₹2000', '₹2000 - ₹5000', '₹5000 - ₹10000', 'Above ₹10000'].map(range => (
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

            {/* Amenities Filter */}
            <div>
                <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Amenities</h4>
                <div className="space-y-3">
                    {['WiFi', 'Parking', 'Pool', 'Restaurant', 'AC', 'Kitchen'].map(amenity => (
                        <label key={amenity} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.amenities.includes(amenity) ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                {filters.amenities.includes(amenity) && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.amenities.includes(amenity)}
                                onChange={() => handleCheckboxChange('amenities', amenity)}
                            />
                            <span className={`text-xs ${filters.amenities.includes(amenity) ? 'text-slate-900 font-medium' : 'text-slate-500 font-light'} Inter group-hover:text-emerald-600 transition-colors`}>{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
}
