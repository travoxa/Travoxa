import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaMapMarkerAlt, FaStar, FaRegClock, FaRupeeSign, FaBolt } from 'react-icons/fa';
import { ActivityPackage } from '@/app/travoxa-discovery/activities/ActivitiesClient';
import SaveButton from '@/components/ui/SaveButton';

interface ActivitiesCardProps {
    pkg: ActivityPackage;
}

const ActivitiesCard: React.FC<ActivitiesCardProps> = ({ pkg }) => {
    // Construct location logic
    const locationText = pkg.location?.name && pkg.location.name.length < 20
        ? `${pkg.location.name}, ${pkg.state}`
        : `${pkg.city}, ${pkg.state}`;

    const difficulty = pkg.difficultyLevel || pkg.level || 'Moderate';

    return (
        <Link href={`/travoxa-discovery/activities/${pkg._id}`} className="block h-full">
            <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 h-full flex flex-col">
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                    {pkg.image ? (
                        <Image
                            src={pkg.image}
                            alt={pkg.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                    )}

                    {/* Rating & Save Badge */}
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                        {pkg.rating && (
                            <div className="bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <FaStar className="text-orange-400 text-[10px]" />
                                <span className="text-[10px] font-bold text-slate-900">{pkg.rating}</span>
                                <span className="text-[9px] text-slate-400 font-medium">({pkg.reviews || 0})</span>
                            </div>
                        )}
                    </div>

                    {/* Level Badge */}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full flex items-center gap-1 shadow-sm text-[10px] font-bold uppercase tracking-wider ${difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        <FaBolt size={8} /> {difficulty}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Location */}
                    <div className="flex items-center gap-1 mb-2">
                        <FaMapMarkerAlt className="text-orange-400 text-[10px] shrink-0" />
                        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide truncate">
                            {locationText}
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
                            <span className="text-slate-400 text-[10px] uppercase font-bold">Type:</span>
                            <span className="text-[11px] font-medium text-slate-600 Inter">{pkg.type || pkg.category}</span>
                        </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-1.5 mb-5 flex-grow">
                        {pkg.highlights && pkg.highlights.slice(0, 2).map((highlight, idx) => (
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
                            <SaveButton
                                itemId={pkg.id}
                                itemType="activity"
                                title={pkg.title}
                                itemLink={`/travoxa-discovery/activities/${pkg._id}`}
                                isSmall={true}
                                activeColor="bg-orange-600"
                            />
                            <span className="h-9 px-5 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg text-[11px] font-bold uppercase tracking-wider hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all Mont flex items-center">
                                View Details
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ActivitiesCard;
