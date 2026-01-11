"use client";

import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { useState, useCallback, useRef } from "react";

export type MapProps = {
    center?: google.maps.LatLngLiteral;
    zoom?: number;
    markers?: Array<{
        id: string;
        position: google.maps.LatLngLiteral;
        title?: string;
        description?: string;
    }>;
    onMapLoad?: (map: google.maps.Map) => void;
    className?: string;
};

const defaultCenter = {
    lat: 28.6139, // New Delhi
    lng: 77.209,
};

const defaultContainerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0.5rem",
};

export default function TripMap({
    center = defaultCenter,
    zoom = 13,
    markers = [],
    onMapLoad,
    className = "w-full h-full",
}: MapProps) {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

    const onLoad = useCallback(
        (map: google.maps.Map) => {
            mapRef.current = map;
            if (onMapLoad) onMapLoad(map);
        },
        [onMapLoad]
    );

    const onUnmount = useCallback(() => {
        mapRef.current = null;
    }, []);

    return (
        <div className={className}>
            <GoogleMap
                mapContainerStyle={defaultContainerStyle}
                center={center}
                zoom={zoom}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                }}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={marker.position}
                        title={marker.title}
                        onClick={() => setSelectedMarker(marker.id)}
                    />
                ))}

                {selectedMarker && (
                    <InfoWindow
                        position={
                            markers.find((m) => m.id === selectedMarker)?.position || center
                        }
                        onCloseClick={() => setSelectedMarker(null)}
                    >
                        <div className="p-2 min-w-[150px]">
                            <h3 className="font-semibold text-gray-900">
                                {markers.find((m) => m.id === selectedMarker)?.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {markers.find((m) => m.id === selectedMarker)?.description}
                            </p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
}
