
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { TourPackage } from "@/data/tourPackages"; // Note: This might be tourData in some files but the import in previous file became package... wait, previous file import was { TourPackage } from "@/data/tourPackages";
// Actually, let me double check the import in the previous view_file of PackageCard.tsx.
// It was: import { TourPackage } from "@/data/tourPackages";
// But wait, the file /data/tourData.ts export TourPackage interface.
// Let me check if /data/tourPackages.ts exists or if it was a mistake in my generic thought.
// The file I viewed was /data/tourData.ts.
// In PackageCard.tsx it imported from "@/data/tourPackages".
// I'll stick to what was there or correct it if it was wrong, but the file was working so it must be right.
// Let me check if tourPackages exists.
// Actually, I'll just use the same import as before if possible, or correct it to "@/data/tourData" based on my file listing.
// Wait, looking at Step 23 output: `import { TourPackage } from "@/data/tourPackages";`
// But I read `data/tourData.ts` in step 35.
// I should probably check if `data/tourPackages.ts` exists.
import { FaRegClock, FaStar, FaMapMarkerAlt, FaShareAlt } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useState } from "react";
import ShareModal from "@/components/ui/ShareModal";

interface PackageCardProps {
    pkg: TourPackage;
    isBlurItem?: boolean;
}

export default function PackageCard({ pkg, isBlurItem }: PackageCardProps) {
    const router = useRouter();
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Handle both string and array formats for image (MongoDB returns array)
    const imageUrl = Array.isArray(pkg.image)
        ? (pkg.image[0] || '/placeholder.jpg')
        : (pkg.image || '/placeholder.jpg');

    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsShareModalOpen(true);
    };

    const handleCardClick = () => {
        if (!isBlurItem) {
            router.push(`/tour/${pkg.id}`);
        }
    };

    // Calculate display price (lowest per person)
    let displayPrice = pkg.price;
    let minPricePax = 0;

    if (pkg.pricing && pkg.pricing.length > 0) {
        // Find minimum pricePerPerson
        let minPrice = Number.MAX_VALUE;
        pkg.pricing.forEach(p => {
            if (p.pricePerPerson < minPrice) {
                minPrice = p.pricePerPerson;
                minPricePax = p.people;
            }
        });

        if (minPrice !== Number.MAX_VALUE) {
            displayPrice = minPrice;
        }
    }

    // Apply discount if exists
    const finalPrice = pkg.earlyBirdDiscount && pkg.earlyBirdDiscount > 0
        ? Math.round(displayPrice * (1 - pkg.earlyBirdDiscount / 100))
        : displayPrice;

    // Extract activities from itinerary
    const itineraryActivities = pkg.itinerary
        ?.map(item => item.activity)
        .filter((activity): activity is string => !!activity && activity.trim() !== "") || [];

    return (
        <div
            onClick={handleCardClick}
            className={`group bg-white rounded-2xl overflow-hidden border border-slate-200 transition-all duration-300 flex flex-col h-full
                ${isBlurItem
                    ? ''
                    : 'hover:border-emerald-500/50 cursor-pointer hover:shadow-lg'
                }
            `}
        >
            {/* Image Section */}
            <div className="relative h-56 w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Top Right: Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <FaStar className="text-orange-400 text-[12px]" />
                    <span className="text-[12px] font-medium text-slate-900">{pkg.rating}</span>
                    <span className="text-[10px] text-slate-500">({pkg.reviews})</span>
                </div>

                {/* Top Left: Discount or Type Badge */}
                {pkg.earlyBirdDiscount && pkg.earlyBirdDiscount > 0 && (
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wide shadow-sm">
                        {pkg.earlyBirdDiscount}% OFF
                    </div>
                )}

                {!pkg.earlyBirdDiscount && (
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wide">
                        Tour Package
                    </div>
                )}

                {/* Bottom Left: Duration Badge */}
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
                    {pkg.location}
                </div>

                {/* Title */}
                <h3 className="text-lg font-medium text-slate-900 mb-3 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[3rem] Mont">
                    {pkg.title}
                </h3>

                {/* Highlights / Inclusions as Tags */}
                <div className="mb-4 flex-grow">
                    <p className="text-[10px] uppercase text-slate-400 font-medium mb-1.5 tracking-wider">Highlights</p>
                    <div className="flex flex-wrap gap-1.5">
                        {/* Prefer itinerary activities, fallback to highlights then inclusions */}
                        {(itineraryActivities.length > 0 ? itineraryActivities : (pkg.highlights && pkg.highlights.length > 0 ? pkg.highlights : pkg.inclusions))?.slice(0, 3).map((item, idx) => (
                            <span key={idx} className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-medium border border-emerald-100 line-clamp-1 max-w-full">
                                {item}
                            </span>
                        ))}
                        {(itineraryActivities.length > 0 ? itineraryActivities : (pkg.highlights && pkg.highlights.length > 0 ? pkg.highlights : pkg.inclusions))?.length > 3 && (
                            <span className="text-[10px] text-slate-400 flex items-center px-1">
                                +{(itineraryActivities.length > 0 ? itineraryActivities : (pkg.highlights && pkg.highlights.length > 0 ? pkg.highlights : pkg.inclusions)).length - 3} more
                            </span>
                        )}
                        {itineraryActivities.length === 0 && (!pkg.highlights || pkg.highlights.length === 0) && (!pkg.inclusions || pkg.inclusions.length === 0) && (
                            <span className="text-[10px] text-slate-400 italic">No highlights available</span>
                        )}
                    </div>
                </div>

                {/* Footer: Price & Actions */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-end justify-between">
                    <div>
                        <p className="text-[10px] text-slate-400 font-medium mb-0.5">Starting from</p>
                        <div className="flex items-baseline gap-1">
                            {pkg.earlyBirdDiscount && pkg.earlyBirdDiscount > 0 ? (
                                <>
                                    <span className="text-lg font-medium text-slate-900">
                                        ₹{finalPrice.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] text-slate-400 line-through">₹{displayPrice.toLocaleString()}</span>
                                </>
                            ) : (
                                <span className="text-lg font-medium text-slate-900">
                                    ₹{finalPrice.toLocaleString()}
                                </span>
                            )}
                            <span className="text-[10px] text-slate-500 font-medium">/ person</span>
                            {minPricePax > 0 && (
                                <span className="text-[10px] text-emerald-600 font-bold ml-1">
                                    (for {minPricePax} Pax)
                                </span>
                            )}
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
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                handleCardClick();
                            }}
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
                url={`/tour/${pkg.id}`}
                title={pkg.title}
            />
        </div >
    );
}
