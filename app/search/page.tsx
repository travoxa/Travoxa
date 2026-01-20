"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { searchUniversal, SearchResults } from '@/utils/searchUtils';
import SightseeingPackageCard from '@/components/Pages/Sightseeing/SightseeingPackageCard';
import RentalCard from '@/components/Pages/Rentals/RentalCard';
import PackageCard from '@/components/Pages/Tour/PackageCard';
import { FaSearch } from 'react-icons/fa';

function SearchContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialQuery = searchParams.get('q') || '';
    const initialLocation = searchParams.get('location') || '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResults>({ rentals: [], sightseeing: [], tours: [] });

    // Perform search when params change
    useEffect(() => {
        const q = searchParams.get('q') || '';
        const loc = searchParams.get('location') || '';
        const res = searchUniversal(q, loc);
        setResults(res);
        setQuery(q); // Sync local state just in case
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        // Note: We are only searching by query here for simplicity in the results page search bar
        // If we want to keep location, we should probably keep it in the URL unless user clears it.
        // For now, let's just push the query.
        if (initialLocation) params.set('location', initialLocation);

        router.push(`/search?${params.toString()}`);
    };

    const hasResults = results.sightseeing.length > 0 || results.tours.length > 0 || results.rentals.length > 0;

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-4">

                {/* Search Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 Mont">
                        Search Results
                    </h1>
                    <p className="text-slate-600 mb-6">
                        Showing results for <span className="font-bold text-emerald-600">"{initialQuery || 'Everything'}"</span>
                        {initialLocation && <span> in <span className="font-bold text-emerald-600">{initialLocation}</span></span>}
                    </p>

                    {/* Simple Search Bar for Refinement */}
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search again..."
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                        />
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </form>
                </div>

                {/* Results */}
                {!hasResults ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">No results found</h2>
                        <p className="text-slate-500">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                ) : (
                    <div className="space-y-16">

                        {/* Sightseeing Section */}
                        {results.sightseeing.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                                    Sightseeing
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {results.sightseeing.map(item => (
                                        <SightseeingPackageCard key={item.id} pkg={item} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Tours Section */}
                        {results.tours.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                    Tour Packages
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {results.tours.map(item => (
                                        <div key={item.id} className="h-[420px]">
                                            <PackageCard pkg={item} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Rentals Section */}
                        {results.rentals.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                                    Vehicle Rentals
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {results.rentals.map(item => (
                                        <div key={item.id} className="h-[420px]">
                                            <RentalCard item={item} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
