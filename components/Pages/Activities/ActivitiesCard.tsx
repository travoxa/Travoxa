
import React from 'react';
import Image from 'next/image';
import { FaMapMarkerAlt, FaStar, FaRegClock, FaRupeeSign, FaBolt } from 'react-icons/fa';
import { ActivityPackage } from '@/data/activitiesData';

interface ActivitiesCardProps {
    pkg: ActivityPackage;
}

const ActivitiesCard: React.FC<ActivitiesCardProps> = ({ pkg }) => {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 h-full flex flex-col">
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
                    <FaStar className="text-orange-400 text-[10px]" />
                    <span className="text-[10px] font-bold text-slate-900">{pkg.rating}</span>
                    <span className="text-[9px] text-slate-400 font-medium">({pkg.reviews})</span>
                </div>

                {/* Level Badge */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm text-[10px] font-bold uppercase text-orange-600 tracking-wider">
                    <FaBolt size={8} /> {pkg.level}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Location */}
                <div className="flex items-center gap-1 mb-2">
                    <FaMapMarkerAlt className="text-orange-400 text-[10px] shrink-0" />
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide truncate">
                        {pkg.city}, {pkg.state}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-bold text-slate-900 leading-snug mb-3 group-hover:text-orange-600 transition-colors Mont line-clamp-2">
                    {pkg.title}
                </h3>

                {/* Info Pills */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                        <FaRegClock className="text-slate-400 text-[10px]" />
                        <span className="text-[11px] font-medium text-slate-600 Inter">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Cat:</span>
                        <span className="text-[11px] font-medium text-slate-600 Inter">{pkg.category}</span>
                    </div>
                </div>



                {/* Highlights */}
                <div className="space-y-1.5 mb-5 flex-grow">
                    {pkg.highlights.slice(0, 2).map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-orange-400 mt-2 shrink-0"></div>
                            <p className="text-xs text-slate-500 Inter leading-relaxed line-clamp-1">{highlight}</p>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-slate-100 mb-4"></div>

                {/* Bottom Section */}
                <div className="flex items-center justify-between mt-auto">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Starting From</p>
                        <div className="flex items-center gap-0.5 text-slate-900 font-bold text-lg Mont">
                            <FaRupeeSign size={14} />
                            {pkg.price.toLocaleString()}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="h-9 px-5 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all Mont">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivitiesCard;
