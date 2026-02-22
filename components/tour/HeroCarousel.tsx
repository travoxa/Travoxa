'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { HiLocationMarker, HiStar, HiClock, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import SaveButton from "@/components/ui/SaveButton";
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface HeroCarouselProps {
    images: string[];
    title: string;
    rating: number;
    reviews: number;
    location: string;
    duration: string;
    itemId: string;
    itemType: 'tour' | 'attraction' | 'activity' | 'sightseeing' | 'stay' | 'rental' | 'food';
}

export default function HeroCarousel({ images, title, rating, reviews, location, duration, itemId, itemType }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    // Auto-rotate every 5 seconds
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <div className="relative h-[70vh] w-full">
            {/* Back Button & Save Button */}
            <div className="absolute top-24 left-4 md:left-12 z-40 flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-white/90 hover:text-white transition-all bg-black/30 backdrop-blur-xl px-5 py-2.5 rounded-full text-sm font-bold border border-white/10 hover:border-white/30"
                >
                    <FaArrowLeft /> BACK
                </button>
                <SaveButton itemId={itemId} itemType={itemType} />
            </div>

            {/* Image Display */}
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <Image
                        src={img}
                        alt={`${title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                    />
                </div>
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 z-20" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-30 max-w-7xl mx-auto">
                <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-green-600 px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                        {rating >= 4.8 ? 'Best Seller' : 'Featured'}
                    </span>
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                        <HiStar className="text-yellow-400" />
                        <span className="font-bold">{rating || 0}</span>
                        <span className="opacity-80">({reviews || 0} reviews)</span>
                    </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{title}</h1>
                <div className="flex items-center gap-4 text-lg text-white/90">
                    <div className="flex items-center gap-1">
                        <HiLocationMarker className="text-green-400" />
                        {location}
                    </div>
                    <span>|</span>
                    <div className="flex items-center gap-1">
                        <HiClock className="text-green-400" />
                        {duration}
                    </div>
                </div>
            </div>

            {/* Navigation Buttons - Only show if multiple images */}
            {images.length > 1 && (
                <div className="absolute bottom-6 right-6 md:right-12 flex gap-2 z-30">
                    <button
                        onClick={goToPrevious}
                        className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                        aria-label="Previous image"
                    >
                        <HiChevronLeft className="text-gray-800 text-xl" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                        aria-label="Next image"
                    >
                        <HiChevronRight className="text-gray-800 text-xl" />
                    </button>
                </div>
            )}

            {/* Image Indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all ${index === currentIndex
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to image ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
