"use client";

interface RentalFilterSidebarProps {
    filters: {
        vehicleType: string[];
        priceRange: string;
        fuel: string[];
    };
    onFilterChange: (type: string, value: string) => void;
    onReset: () => void;
}

export default function RentalFilterSidebar({ filters, onFilterChange, onReset }: RentalFilterSidebarProps) {

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

            {/* Vehicle Type Filter */}
            <div className="mb-8">
                <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Vehicle Type</h4>
                <div className="space-y-3">
                    {['Scooter', 'Bike', 'Car', 'SUV'].map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.vehicleType.includes(type) ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                {filters.vehicleType.includes(type) && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.vehicleType.includes(type)}
                                onChange={() => handleCheckboxChange('vehicleType', type)}
                            />
                            <span className={`text-xs ${filters.vehicleType.includes(type) ? 'text-slate-900 font-medium' : 'text-slate-500 font-light'} Inter group-hover:text-emerald-600 transition-colors`}>{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-8">
                <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Price Range (Per Day)</h4>
                <div className="space-y-3">
                    {['Under ₹500', '₹500 - ₹2000', 'Above ₹2000'].map(range => (
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

            {/* Fuel Filter */}
            <div>
                <h4 className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">Fuel Type</h4>
                <div className="space-y-3">
                    {['Petrol', 'Diesel', 'Electric'].map(fuel => (
                        <label key={fuel} className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${filters.fuel.includes(fuel) ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                {filters.fuel.includes(fuel) && (
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={filters.fuel.includes(fuel)}
                                onChange={() => handleCheckboxChange('fuel', fuel)}
                            />
                            <span className={`text-xs ${filters.fuel.includes(fuel) ? 'text-slate-900 font-medium' : 'text-slate-500 font-light'} Inter group-hover:text-emerald-600 transition-colors`}>{fuel}</span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
}
