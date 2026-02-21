
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { SightseeingPackage } from "@/data/sightseeingData";
import { FaCar, FaUserFriends, FaRegClock, FaStar, FaShareAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useState } from "react";
import ShareModal from "@/components/ui/ShareModal";

interface SightseeingPackageCardProps {
    pkg: SightseeingPackage;
    activeTab?: 'sharing' | 'private';
}

export default function SightseeingPackageCard({ pkg, activeTab = 'sharing' }: SightseeingPackageCardProps) {
    const router = useRouter();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const handleBookNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/travoxa-discovery/sightseeing/${pkg.id}`);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsShareModalOpen(true);
    };

    return (
        <div
            onClick={() => router.push(`/travoxa-discovery/sightseeing/${pkg.id}`)}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <FaStar className="text-orange-400 text-[12px]" />
                    <span className="text-[12px] font-medium text-slate-900">{pkg.rating}</span>
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wide">
                    {pkg.isPrivate && pkg.isSharing ? 'Private & Shared' : pkg.isPrivate ? 'Private Tour' : 'Shared Tour'}
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1">
                    <FaRegClock size={10} />
                    {pkg.duration}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Location */}
                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mb-2 uppercase tracking-wide">
                    <MdLocationOn className="text-emerald-500" />
                    {pkg.city}, {pkg.state}
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium text-slate-900 mb-3 leading-tight group-hover:text-emerald-600 transition-colors Mont">
                    {pkg.title}
                </h3>

                {/* Key Features */}
                <div className="flex items-center gap-4 mb-4 text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-lg">
                    <div className="flex items-center gap-1.5" title="Vehicle Type">
                        <FaCar className="text-slate-400" />
                        {pkg.vehicleType}
                    </div>
                    <div className="w-[1px] h-4 bg-slate-300"></div>
                    <div className="flex items-center gap-1.5" title="Max Guests">
                        <FaUserFriends className="text-slate-400" />
                        Max {pkg.maxPeople}
                    </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                    <p className="text-[10px] uppercase text-slate-400 font-medium mb-1.5 tracking-wider">Highlights</p>
                    <div className="flex flex-wrap gap-1.5">
                        {pkg.highlights.slice(0, 3).map((highlight, idx) => (
                            <span key={idx} className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-medium border border-emerald-100">
                                {highlight}
                            </span>
                        ))}
                        {pkg.highlights.length > 3 && (
                            <span className="text-[10px] text-slate-400 flex items-center px-1">+{pkg.highlights.length - 3} more</span>
                        )}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
                    <div>
                        <p className="text-[10px] text-slate-400 font-medium mb-0.5">Starting from</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-lg font-medium text-slate-900">
                                ₹{activeTab === 'private'
                                    ? (pkg.pricePrivate || pkg.price).toLocaleString()
                                    : (pkg.priceSharing || pkg.price).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                                / {activeTab === 'private' ? 'vehicle' : 'person'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleShare}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                            title="Share this package"
                        >
                            <FaShareAlt size={14} />
                        </button>
                        <button
                            onClick={handleBookNow}
                            className="bg-slate-900 hover:bg-emerald-600 text-white text-xs font-medium px-4 py-2.5 rounded-full transition-colors shadow-none"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                url={`/travoxa-discovery/sightseeing/${pkg.id}`}
                title={pkg.title}
            />
        </div>
    );
}
