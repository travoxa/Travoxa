
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { TourPackage } from "@/data/tourPackages";
import { HiLocationMarker, HiStar, HiClock } from "react-icons/hi";

interface PackageCardProps {
    pkg: TourPackage;
    isBlurItem?: boolean;
}

export default function PackageCard({ pkg, isBlurItem }: PackageCardProps) {
    const router = useRouter();

    // Handle both string and array formats for image (MongoDB returns array)
    const imageUrl = Array.isArray(pkg.image)
        ? (pkg.image[0] || '/placeholder.jpg')
        : (pkg.image || '/placeholder.jpg');

    return (
        <div
            onClick={() => !isBlurItem && router.push(`/tour/${pkg.id}`)}
            className={`bg-white rounded-3xl overflow-hidden border border-gray-100 flex flex-col h-full transition-all duration-300
                ${isBlurItem
                    ? ''
                    : 'group shadow-sm hover:shadow-2xl cursor-pointer'
                }
            `}
        >
            {/* Image Container */}
            <div className="relative h-[250px] w-full overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Price Tag */}
                <div className={`absolute top-4 right-4 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2
                    ${pkg.earlyBirdDiscount && pkg.earlyBirdDiscount > 0
                        ? 'bg-green-600/90 text-white'
                        : 'bg-white/90 text-gray-900'
                    }
                `}>
                    {pkg.earlyBirdDiscount && pkg.earlyBirdDiscount > 0 ? (
                        <>
                            <span className="text-sm font-bold">
                                ₹{Math.round(pkg.price * (1 - pkg.earlyBirdDiscount / 100))}
                            </span>
                            <span className="text-[10px] text-green-100 line-through decoration-green-200/50">₹{pkg.price}</span>
                        </>
                    ) : (
                        <span className="text-sm font-bold">₹{pkg.price}</span>
                    )}
                </div>

                {/* Rating */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1 text-white bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <HiStar className="text-yellow-400" />
                    <span className="text-sm font-medium">{pkg.rating}</span>
                    <span className="text-xs text-white/80">({pkg.reviews})</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                        {pkg.title}
                    </h3>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <HiLocationMarker className="text-green-500" />
                    <span className="line-clamp-1">{pkg.location}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
                    {pkg.overview}
                </p>

                {/* Meal Options */}
                {/* Meal Options */}
                {pkg.meals && pkg.meals.length > 0 && (
                    <div className="mb-4">
                        <span className="text-xs font-semibold text-gray-700 block mb-1">Meals:</span>
                        <div className="flex flex-wrap gap-2">
                            {pkg.meals.map((meal, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md border border-gray-200">
                                    {meal}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium bg-gray-50 px-3 py-1.5 rounded-lg">
                        <HiClock className="text-gray-400" />
                        {pkg.duration}
                    </div>

                    <button className="text-sm font-bold text-gray-900 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View Details
                        <span className="text-green-600 text-lg">→</span>
                    </button>
                </div>
            </div>
        </div >
    );
}
