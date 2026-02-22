"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaStar, FaMapMarkerAlt, FaBed, FaBath, FaUserFriends, FaWhatsapp } from "react-icons/fa";
import SaveButton from "@/components/ui/SaveButton";

interface StayPackageCardProps {
    pkg: any; // Using any for flexibility with mongoose document
}

export default function StayPackageCard({ pkg }: StayPackageCardProps) {
    const router = useRouter();

    const handleViewDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        router.push(`/travoxa-discovery/stay/${pkg.id}`);
    };

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        const message = `Hi, I'm interested in booking ${pkg.title} in ${pkg.city}. Please provide more details.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div
            onClick={handleViewDetails}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer flex flex-col h-full shadow-sm hover:shadow-md"
        >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={pkg.coverImage || pkg.images[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945"}
                    alt={pkg.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                    {pkg.rating > 0 && (
                        <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                            <FaStar className="text-orange-400 text-[12px]" />
                            <span className="text-[12px] font-bold text-slate-900">{pkg.rating}</span>
                            <span className="text-[10px] text-slate-400 font-medium">({pkg.reviews})</span>
                        </div>
                    )}
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    {pkg.type}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium mb-3">
                    <FaMapMarkerAlt className="text-emerald-500" />
                    {pkg.location}, {pkg.city}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 mb-4 leading-tight group-hover:text-emerald-600 transition-colors Mont">
                    {pkg.title}
                </h3>

                {/* Stay Features */}
                <div className="flex items-center gap-4 mb-5 text-xs text-slate-600 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2" title="Bedrooms">
                        <FaBed className="text-slate-400" />
                        {pkg.bedrooms} Beds
                    </div>
                    <div className="w-[1px] h-4 bg-slate-300"></div>
                    <div className="flex items-center gap-2" title="Bathrooms">
                        <FaBath className="text-slate-400" />
                        {pkg.bathrooms} Baths
                    </div>
                    <div className="w-[1px] h-4 bg-slate-300"></div>
                    <div className="flex items-center gap-2" title="Guests">
                        <FaUserFriends className="text-slate-400" />
                        Max {pkg.maxGuests}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-slate-900">
                                ₹{pkg.price.toLocaleString()}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                                / {pkg.priceType === 'per_person' ? 'person' : 'night'}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <SaveButton itemId={pkg.id} itemType="stay" isSmall={true} />
                        <button
                            onClick={handleWhatsApp}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all border border-green-100"
                            title="Chat on WhatsApp"
                        >
                            <FaWhatsapp size={18} />
                        </button>
                        <button
                            onClick={handleViewDetails}
                            className="bg-black hover:bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
