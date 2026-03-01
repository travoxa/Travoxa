import React from 'react';
import { FaMapMarkerAlt, FaStar, FaUtensils, FaUsers, FaShareAlt } from 'react-icons/fa';
import Image from 'next/image';
import { FoodPackage } from '@/app/travoxa-discovery/food-and-cafes/FoodClient';
import SaveButton from '@/components/ui/SaveButton';
import { FaWhatsapp, FaDirections, FaClock, FaCheckCircle, FaStar, FaAward, FaCrown, FaTag, FaMapMarkerAlt } from 'react-icons/fa';

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

        <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-500 h-full flex flex-col relative">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />

                {/* Badges Overlay */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {pkg.badges?.slice(0, 2).map((badge: string, idx: number) => (
                        <div key={idx} className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm flex items-center gap-1.5
                            ${badge === 'Verified by Travoxa' ? 'bg-emerald-500/90 text-white' :
                                badge === 'Travoxa Recommended' ? 'bg-yellow-500/90 text-white' :
                                    badge === 'Premium' ? 'bg-slate-900/90 text-white' :
                                        badge === 'Budget Friendly' ? 'bg-sky-500/90 text-white' :
                                            'bg-white/90 text-slate-900'}`}>
                            {badge === 'Verified by Travoxa' && <FaCheckCircle />}
                            {badge === 'Travoxa Recommended' && <FaStar />}
                            {badge === 'Premium' && <FaCrown />}
                            {badge === 'Most Famous' && <FaAward />}
                            {badge === 'Budget Friendly' && <FaTag />}
                            {badge}
                        </div>
                    ))}
                </div>

                <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10">
                    <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm border border-slate-100">
                        <FaStar className="text-yellow-400 text-[11px]" />
                        <span className="text-[11px] font-bold text-slate-900">{pkg.rating}</span>
                        <span className="text-[10px] text-slate-400 font-medium">({pkg.reviews})</span>
                    </div>
                </div>

                {/* Price Label Overlay */}
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-lg border border-slate-100">
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mb-0.5 text-right">Per Person</p>
                    <p className="text-[15px] font-black text-slate-900 Mont">₹{pkg.avgCostPerPerson || 0}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Type & Location */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${pkg.dishType === 'Veg' ? 'bg-green-500' : pkg.dishType === 'Non-Veg' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{pkg.category} • {pkg.dishType}</span>
                    </div>
                    {pkg.hygieneRating && (
                        <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                            <span className="text-[9px] font-black text-emerald-600">HYGIENE {pkg.hygieneRating}/5</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-1 group-hover:text-yellow-600 transition-colors Mont line-clamp-1">
                    {pkg.title}
                </h3>

                {/* Location & Distance */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-yellow-400 text-[10px]" />
                        <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[120px]">
                            {pkg.area || pkg.city}
                        </span>
                    </div>
                    {pkg.distFromAttraction && (
                        <span className="text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                            {pkg.distFromAttraction}
                        </span>
                    )}
                </div>

                {/* Famous Dish Highlight */}
                <div className="bg-slate-50 rounded-2xl p-3 mb-6 border border-slate-100 group-hover:bg-yellow-50/50 group-hover:border-yellow-100 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Famous Discovery</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 italic">" {pkg.famousDish || 'Multiple Specialities'} "</p>
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
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pkg.title + ' ' + pkg.city)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <FaDirections className="text-blue-500" /> Directions
                    </a>
                    <a
                        href={`https://wa.me/${pkg.whatsappNumber || '91xxxxxxxxxx'}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <FaWhatsapp className="text-emerald-500" /> WhatsApp
                    </a>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-100">
                    <a
                        href={`/travoxa-discovery/food-and-cafes/${pkg.id || pkg._id}`}
                        className="flex-1 h-11 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black uppercase tracking-widest hover:bg-yellow-600 transition-all shadow-lg active:scale-95"
                    >
                        View Details
                    </a>
                    <SaveButton
                        itemId={pkg.id || pkg._id}
                        itemType="food"
                        title={pkg.title}
                        itemLink={`/travoxa-discovery/food-and-cafes/${pkg.id || pkg._id}`}
                        isSmall={false}
                        activeColor="bg-yellow-500"
                    />
                </div>

            </div>

        </div>
    );
};

export default FoodCard;