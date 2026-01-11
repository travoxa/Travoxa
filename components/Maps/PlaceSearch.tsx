"use client";

import { useState } from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

type PlaceSearchProps = {
    onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
    mapInstance: google.maps.Map | null;
    className?: string;
};

export default function PlaceSearch({
    onPlaceSelect,
    mapInstance,
    className = "",
}: PlaceSearchProps) {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = (overrideQuery?: string) => {
        const searchQuery = overrideQuery || query;
        if (!searchQuery.trim() || !mapInstance) return;

        // Update state if using override so input reflects it
        if (overrideQuery) setQuery(overrideQuery);

        setIsSearching(true);
        const service = new google.maps.places.PlacesService(mapInstance);

        const request: google.maps.places.TextSearchRequest = {
            query: searchQuery,
            bounds: mapInstance.getBounds() || undefined,
        };

        service.textSearch(request, (results, status) => {
            setIsSearching(false);
            if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results &&
                results.length > 0
            ) {
                onPlaceSelect(results[0]);
            }
        });
    };

    const handleNearbySearch = (type: string) => {
        if (!mapInstance) return;

        setIsSearching(true);
        const service = new google.maps.places.PlacesService(mapInstance);

        const request: google.maps.places.PlaceSearchRequest = {
            location: mapInstance.getCenter(),
            radius: 5000, // 5km
            type: type,
        };

        service.nearbySearch(request, (results, status) => {
            setIsSearching(false);
            if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results &&
                results.length > 0
            ) {
                onPlaceSelect(results[0]);
            }
        });
    };

    return (
        <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search places (e.g., Petrol Pump)"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                    onClick={() => handleSearch()}
                    disabled={isSearching}
                    className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {isSearching ? "..." : <FaSearch />}
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => handleSearch("Petrol Pump")}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-300 flex items-center gap-1"
                >
                    <FaMapMarkerAlt className="text-red-500" /> Petrol Stations
                </button>
                <button
                    onClick={() => handleSearch("Restaurant")}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-300 flex items-center gap-1"
                >
                    <FaMapMarkerAlt className="text-orange-500" /> Restaurants
                </button>
                <button
                    onClick={() => handleSearch("Hotel")}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full border border-gray-300 flex items-center gap-1"
                >
                    <FaMapMarkerAlt className="text-blue-500" /> Hotels
                </button>
            </div>
        </div>
    );
}
