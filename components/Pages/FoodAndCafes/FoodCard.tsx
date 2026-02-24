
import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaStar, FaUtensils, FaChevronRight } from 'react-icons/fa';
import { FoodPackage } from '@/app/travoxa-discovery/food-and-cafes/FoodClient';
import SaveButton from '@/components/ui/SaveButton';

interface FoodCardProps {
    pkg: FoodPackage;
}

const FoodCard: React.FC<FoodCardProps> = ({ pkg }) => {
    const cuisineDisplay = Array.isArray(pkg.cuisine) ? pkg.cuisine.join(', ') : pkg.cuisine;
    // Construct location if missing
    const displayLocation = pkg.location || `${pkg.city}, ${pkg.state}`;
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-yellow-500/5 transition-all duration-300 h-full flex flex-col">
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                    <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <FaStar className="text-yellow-400 text-[10px]" />
                        <span className="text-[10px] font-bold text-slate-900">{pkg.rating}</span>
                        <span className="text-[9px] text-slate-400 font-medium">({pkg.reviews})</span>
                    </div>
                </div>

                {/* Cuisine Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold text-yellow-600 uppercase tracking-wider shadow-sm">
                    {cuisineDisplay}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Location */}
                <div className="flex items-center gap-1 mb-2">
                    <FaMapMarkerAlt className="text-yellow-400 text-[10px] shrink-0" />
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide truncate">
                        {displayLocation}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-bold text-slate-900 leading-snug mb-3 group-hover:text-yellow-600 transition-colors Mont line-clamp-2">
                    {pkg.title}
                </h3>

                {/* Category Pill */}
                <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1.5 rounded-lg border border-yellow-100/50">
                        <FaUtensils className="text-yellow-500 text-[10px]" />
                        <span className="text-[11px] font-medium text-yellow-700 Inter">{pkg.category}</span>
                    </div>
                </div>

                {/* Overview */}
                <p className="text-xs text-slate-500 Inter leading-relaxed line-clamp-2 mb-5 flex-grow">
                    {pkg.overview}
                </p>

                {/* Divider */}
                <div className="h-px w-full bg-slate-100 mb-4"></div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Price Range</p>
                        <span className="text-sm font-bold text-slate-900 Mont tracking-widest">{pkg.priceRange}</span>
                    </div>

                    <div className="flex gap-2">
                        <SaveButton
                            itemId={pkg.id}
                            itemType="food"
                            title={pkg.title}
                            itemLink={`/travoxa-discovery/food-and-cafes/${pkg.id}`}
                            isSmall={true}
                            activeColor="bg-yellow-500"
                        />
                        <button className="h-9 w-9 bg-yellow-50 text-yellow-600 border border-yellow-100 rounded-full flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-all shadow-sm">
                            <FaChevronRight size={10} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodCard;
