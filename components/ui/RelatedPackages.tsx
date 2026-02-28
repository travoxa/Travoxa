'use client';

import React from 'react';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';

interface RelatedPackagesProps {
    tours?: any[];
    sightseeing?: any[];
    activities?: any[];
    rentals?: any[];
    stays?: any[];
    food?: any[];
    attractions?: any[];
}

const PackageSlider = ({ title, items, linkPrefix, viewAllLink, colorTheme }: { title: string, items: any[], linkPrefix: string, viewAllLink: string, colorTheme: string }) => {
    if (!items || items.length === 0) return null;

    // Mapping colorTheme to Tailwind classes
    const colorClasses: Record<string, { text: string, bg: string }> = {
        blue: { text: 'text-blue-600', bg: 'bg-blue-600' },
        emerald: { text: 'text-emerald-600', bg: 'bg-emerald-600' },
        orange: { text: 'text-orange-600', bg: 'bg-orange-600' },
        purple: { text: 'text-purple-600', bg: 'bg-purple-600' },
        indigo: { text: 'text-indigo-600', bg: 'bg-indigo-600' },
        pink: { text: 'text-pink-600', bg: 'bg-pink-600' },
        amber: { text: 'text-amber-500', bg: 'bg-amber-500' }
    };

    const theme = colorClasses[colorTheme] || colorClasses.blue;

    return (
        <div data-aos="fade-up" className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <Link href={viewAllLink} className={`${theme.text} font-bold uppercase text-xs tracking-widest hover:underline`}>View All</Link>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {items.map((item, idx) => {
                    const id = item._id ? item._id.toString() : item.id;
                    const itemTitle = item.title || item.name;
                    const location = item.city || item.location || item.state || '';
                    const image = item.image || (item.images && item.images[0]) || item.coverImage || '/placeholder.jpg';
                    const rating = item.rating || item.googleRating || '4.5';
                    const badgeText = item.type || item.category || (item.cuisine && item.cuisine[0]) || '';

                    return (
                        <Link href={`${linkPrefix}/${id}`} key={id || idx} className="min-w-[280px] group block">
                            <div className="relative h-48 rounded-2xl overflow-hidden mb-4 border border-gray-100">
                                <img src={image} alt={itemTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                {badgeText && (
                                    <div className="absolute bottom-4 left-4">
                                        <span className={`${theme.bg} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm`}>
                                            {badgeText}
                                        </span>
                                    </div>
                                )}
                                <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                                    <FaStar className="text-yellow-400" /> {rating}
                                </div>
                            </div>
                            <h4 className={`font-bold text-gray-900 text-lg mb-1 group-hover:${theme.text} transition-colors line-clamp-1`}>{itemTitle}</h4>
                            <div className="flex items-center justify-between text-xs font-semibold text-gray-400 tracking-wider">
                                <span className="line-clamp-1">{location}</span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default function RelatedPackages({ tours, sightseeing, activities, rentals, stays, food, attractions }: RelatedPackagesProps) {
    const hasAny = (tours?.length || 0) > 0 ||
        (sightseeing?.length || 0) > 0 ||
        (activities?.length || 0) > 0 ||
        (rentals?.length || 0) > 0 ||
        (stays?.length || 0) > 0 ||
        (food?.length || 0) > 0 ||
        (attractions?.length || 0) > 0;

    if (!hasAny) return null;

    return (
        <section className="border-t border-gray-200 pt-16 mt-16 pb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-10">You Might Also Like</h2>
            <div className="space-y-4">
                <PackageSlider title="Related Tours" items={tours || []} linkPrefix="/tour" viewAllLink="/tour" colorTheme="blue" />
                <PackageSlider title="Nearby Sightseeing" items={sightseeing || []} linkPrefix="/travoxa-discovery/sightseeing" viewAllLink="/travoxa-discovery/sightseeing" colorTheme="emerald" />
                <PackageSlider title="Exciting Activities" items={activities || []} linkPrefix="/travoxa-discovery/activities" viewAllLink="/travoxa-discovery/activities" colorTheme="orange" />
                <PackageSlider title="Nearby Rentals" items={rentals || []} linkPrefix="/travoxa-discovery/rentals" viewAllLink="/travoxa-discovery/rentals" colorTheme="purple" />
                <PackageSlider title="Places to Stay" items={stays || []} linkPrefix="/travoxa-discovery/stay" viewAllLink="/travoxa-discovery/stay" colorTheme="indigo" />
                <PackageSlider title="Food & Cafes" items={food || []} linkPrefix="/travoxa-discovery/food-and-cafes" viewAllLink="/travoxa-discovery/food-and-cafes" colorTheme="amber" />
                <PackageSlider title="Nearby Attractions" items={attractions || []} linkPrefix="/travoxa-discovery/attractions" viewAllLink="/travoxa-discovery/attractions" colorTheme="pink" />
            </div>
        </section>
    );
}
