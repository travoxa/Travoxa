"use client";

import { useState } from "react";
import { MapProvider } from "@/components/Maps/MapProvider";
import TripMap from "@/components/Maps/TripMap";
import PlaceSearch from "@/components/Maps/PlaceSearch";

export default function MapModule() {
    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<
        Array<{
            id: string;
            position: google.maps.LatLngLiteral;
            title?: string;
            description?: string;
        }>
    >([]);
    const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 }); // Default: New Delhi

    const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
        if (place.geometry?.location) {
            const newPos = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };

            setCenter(newPos);

            // Add a marker for the selected place
            const newMarker = {
                id: place.place_id || Date.now().toString(),
                position: newPos,
                title: place.name || "Selected Location",
                description: place.formatted_address,
            };

            // Optionally clear old markers or keep them unique
            setMarkers((prev) => [...prev, newMarker]);

            // Zoom in
            mapInstance?.setZoom(15);
            mapInstance?.panTo(newPos);
        }
    };

    return (
        <MapProvider>
            <div className="flex flex-col md:flex-row gap-6 h-[600px]">
                {/* Search Sidebar */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <PlaceSearch
                        onPlaceSelect={handlePlaceSelect}
                        mapInstance={mapInstance}
                        className="h-fit"
                    />

                    <div className="bg-white p-4 rounded-lg shadow-md flex-1 overflow-y-auto">
                        <h3 className="font-semibold mb-2">Selected Places</h3>
                        {markers.length === 0 ? (
                            <p className="text-sm text-gray-500">No places selected yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {markers.map((m) => (
                                    <li
                                        key={m.id}
                                        className="text-sm border-b pb-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
                                        onClick={() => {
                                            mapInstance?.panTo(m.position);
                                            mapInstance?.setZoom(16);
                                        }}
                                    >
                                        <span className="font-medium block">{m.title}</span>
                                        <span className="text-xs text-gray-500 truncate block">
                                            {m.description}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Map Container */}
                <div className="w-full md:w-2/3 rounded-xl overflow-hidden shadow-lg border border-gray-200">
                    <TripMap
                        center={center}
                        zoom={13}
                        markers={markers}
                        onMapLoad={setMapInstance}
                    />
                </div>
            </div>
        </MapProvider>
    );
}
