
"use client";

import { useEffect, useState } from "react";
import { FaMapMarkedAlt, FaClock, FaCalendarAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";

type Trip = {
    _id: string;
    name: string;
    originCity: string;
    destinationSummary: string;
    createdAt: string;
    profile: any;
};

type Props = {
    onSelectTrip: (profile: any) => void;
};

export default function SavedTripsList({ onSelectTrip }: Props) {
    const { data: session } = useSession();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session) return;

        const fetchTrips = async () => {
            try {
                const res = await fetch("/api/trips");
                const data = await res.json();
                if (data.trips) {
                    setTrips(data.trips);
                }
            } catch (error) {
                console.error("Failed to fetch trips:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [session]);

    if (loading) return (
        <div className="w-full mb-8 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="flex gap-4 overflow-hidden">
                <div className="w-64 h-32 bg-gray-100 rounded-xl"></div>
                <div className="w-64 h-32 bg-gray-100 rounded-xl"></div>
            </div>
        </div>
    );

    if (trips.length === 0) return (
        <div className="w-full mb-8 bg-white/40 border border-gray-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                <FaMapMarkedAlt className="text-gray-400" /> No Saved Trips Yet
            </h3>
            <p className="text-sm text-gray-500">
                Start a new plan in the assistant below and save it to see it here!
            </p>
        </div>
    );

    return (
        <div className="w-full mb-8 animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkedAlt className="text-[#4da528]" /> Your Saved Trips
            </h3>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {trips.map((trip) => (
                    <button
                        key={trip._id}
                        onClick={() => onSelectTrip(trip.profile)}
                        className="flex-shrink-0 w-64 p-4 bg-white/60 hover:bg-white backdrop-blur-sm border border-gray-200 hover:border-[#4da528]/50 rounded-xl shadow-sm hover:shadow-md transition-all text-left group snap-start"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-[#4da528] bg-[#4da528]/10 px-2 py-1 rounded-full uppercase tracking-wider">
                                {trip.profile.travel_style || "Trip"}
                            </span>
                        </div>

                        <h4 className="font-bold text-gray-900 truncate mb-1 group-hover:text-[#4da528] transition-colors">
                            {trip.name}
                        </h4>

                        <p className="text-sm text-gray-600 truncate mb-3">
                            {trip.destinationSummary}
                        </p>

                        <div className="flex items-center gap-3 text-xs text-gray-400 border-t border-gray-100 pt-3">
                            <span className="flex items-center gap-1">
                                <FaClock /> {new Date(trip.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
