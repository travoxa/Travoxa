
import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaStar, FaLandmark, FaChevronRight } from 'react-icons/fa';
import { AttractionPackage } from '@/data/attractionsData';

interface AttractionsCardProps {
    pkg: AttractionPackage;
}

const AttractionsCard: React.FC<AttractionsCardProps> = ({ pkg }) => {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300 h-full flex flex-col">
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <FaStar className="text-pink-400 text-[10px]" />
                    <span className="text-[10px] font-bold text-slate-900">{pkg.rating}</span>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider">
                    {pkg.category}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Location */}
                <div className="flex items-center gap-1 mb-2">
                    <FaMapMarkerAlt className="text-pink-400 text-[10px] shrink-0" />
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide truncate">
                        {pkg.city}, {pkg.state}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-bold text-slate-900 leading-snug mb-3 group-hover:text-pink-600 transition-colors Mont line-clamp-2">
                    {pkg.title}
                </h3>

                {/* Type Pill */}
                <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex items-center gap-1.5 bg-pink-50 px-2.5 py-1.5 rounded-lg border border-pink-100/50">
                        <FaLandmark className="text-pink-400 text-[10px]" />
                        <span className="text-[11px] font-medium text-pink-700 Inter">{pkg.type}</span>
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
                        {pkg.price > 0 ? (
                            <>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Entry From</p>
                                <span className="text-lg font-bold text-slate-900 Mont">₹{pkg.price}</span>
                            </>
                        ) : (
                            <span className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Free Entry</span>
                        )}
                    </div>

                    <button className="h-9 w-9 bg-pink-50 text-pink-600 border border-pink-100 rounded-full flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all shadow-sm">
                        <FaChevronRight size={10} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttractionsCard;
