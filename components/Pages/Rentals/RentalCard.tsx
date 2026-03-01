"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { RentalItem } from "@/data/rentalsData";
import { FaWhatsapp, FaStar, FaGasPump, FaUserGroup, FaHelmetSafety } from "react-icons/fa6";
import { MdLocationOn, MdPlace } from "react-icons/md";
import SaveButton from "@/components/ui/SaveButton";

interface RentalCardProps {
    item: RentalItem;
}

export default function RentalCard({ item }: RentalCardProps) {
    const router = useRouter();

    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        const message = `Hi, I'm interested in renting ${item.name} (${item.model}) in ${item.location}. Please provide details.`;
        // Use the whatsapp number if available, otherwise open generic WhatsApp share
        if (item.whatsapp) {
            window.open(`https://wa.me/91${item.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        }
    };

    const handleCardClick = () => {
        router.push(`/travoxa-discovery/rentals/${item.id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer flex flex-col h-full hover:shadow-xl"
        >
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden bg-slate-50">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <FaStar className="text-orange-400 text-[12px]" />
                        <span className="text-[12px] font-medium text-slate-900">{item.rating}</span>
                    </div>
                </div>

                {/* Model Year Badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-medium">
                    {item.model}
                </div>

                {/* Rental Service Badge */}
                {item.rentalServiceName && (
                    <div className="absolute top-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-medium">
                        {item.rentalServiceName}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col grow">
                {/* Location */}
                <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mb-2 uppercase tracking-wide">
                    <MdLocationOn className="text-emerald-500" />
                    {item.location}
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium text-slate-900 mb-4 leading-tight group-hover:text-emerald-600 transition-colors Mont">
                    {item.name}
                </h3>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg Inter font-medium">
                        <FaGasPump className="text-slate-400" /> {item.mileage} km/l
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg Inter font-medium">
                        <FaUserGroup className="text-slate-400" /> {item.seats} Seats
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg Inter font-medium">
                        <FaGasPump className="text-slate-400" /> {item.fuel}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg Inter font-medium">
                        <FaHelmetSafety className="text-slate-400" /> {item.helmet}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
                    <div>
                        <p className="text-[10px] text-slate-400 font-medium mb-0.5 uppercase tracking-wide">Daily Rate</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-slate-900">₹{item.price.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-slate-500 font-medium">/ day</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <SaveButton
                            itemId={item.id}
                            itemType="rental"
                            title={item.name}
                            itemLink={`/travoxa-discovery/rentals/${item.id}`}
                            isSmall={true}
                            activeColor="bg-emerald-500"
                        />
                        <button
                            onClick={handleWhatsApp}
                            className="px-4 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                        >
                            <FaWhatsapp size={16} /> Book Now
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

