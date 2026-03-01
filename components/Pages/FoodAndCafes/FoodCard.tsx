import React from 'react';
import { FaMapMarkerAlt, FaStar, FaUtensils, FaUsers, FaShareAlt } from 'react-icons/fa';
import { FoodPackage } from '@/app/travoxa-discovery/food-and-cafes/FoodClient';
import SaveButton from '@/components/ui/SaveButton';

interface FoodCardProps {
    pkg: FoodPackage;
}

const FoodCard: React.FC<FoodCardProps> = ({ pkg }) => {
    const cuisineDisplay = Array.isArray(pkg.cuisine) ? pkg.cuisine.join(', ') : pkg.cuisine;
    const displayLocation = pkg.location || `${pkg.city}, ${pkg.state}`;

    return (
        <div className="group w-full min-w-[360px] max-w-[360px] bg-white rounded-[18px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">

            {/* IMAGE */}
            <div className="relative h-[180px] w-full overflow-hidden">

                <img
                    src="/monerujjaman-breakfast-9929085_1920.jpg"
                    alt={pkg.title}
             
                    className="object-cover"
                />
                {/* rating */}
                <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-0.5 flex items-center gap-2 shadow-sm">
                    <FaStar className="text-orange-400 text-[11px]" />
                    <span className="text-[11px] font-semibold">4.5</span>
                </div>

                {/* duration */}

            </div>


            {/* CONTENT */}
            <div className="p-4 flex flex-col flex-grow gap-3">

                {/* location */}
                <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-emerald-500 text-[12px]" />
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                        {displayLocation}
                    </span>
                </div>


                {/* title */}
                <h3 className="text-[18px] font-bold leading-snug">
                    {pkg.title}
                </h3>


                {/* highlights */}
                <div className="flex flex-col  gap-2">

                    <p className="text-[11px] text-slate-400 pb-2 uppercase font-semibold">
                        Highlights
                    </p>

                    <div className="flex flex-wrap pb-1 gap-3">

                        <span className="bg-emerald-100 text-emerald-700 text-[11px] px-2.5 py-0.5 rounded-full">
                            Boat Ride
                        </span>

                        <span className="bg-emerald-100 text-emerald-700 text-[11px] px-2.5 py-0.5 rounded-full">
                            Boat Safari
                        </span>

                        <span className="bg-emerald-100 text-emerald-700 text-[11px] px-2.5 py-0.5 rounded-full">
                            Delta Visit
                        </span>

                    </div>

                </div>


                {/* bottom row */}
                <div className="border-t border-slate-200 pb-0 pt-3 mt-auto">
                    <div className="flex items-center gap-2">
                        {/* LEFT: Save + Share */}
                        <div className="flex items-center gap-2">
                            <SaveButton
                                itemId={pkg.id}
                                itemType="tour"
                                isSmall={true}
                                activeColor="bg-emerald-600"
                            />
                            <button className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center">
                                <FaShareAlt size={13} />
                            </button>
                        </div>

                        {/* RIGHT: View Details fills remaining space */}
                        <button className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-full text-[12px] font-semibold whitespace-nowrap text-center">
                            View Details
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default FoodCard;