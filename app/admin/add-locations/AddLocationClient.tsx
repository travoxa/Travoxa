"use client";

import { useState, useEffect } from "react";
import {
    addDoc,
    collection,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

type LocationForm = {
    name: string;
    type: string;
    country: string;
    state: string;
    district: string;
    city: string;
    locationLink: string;
    bestTime: string;
    entryFee: string;
    openingHours: string;
    duration: string;
    shortDescription: string;
    fullDescription: string;
    isFamilyFriendly: boolean;
    isPetFriendly: boolean;
    wheelchairAccessible: boolean;
    permitsRequired: string;
    nearestCity: string;
};

const initialForm: LocationForm = {
    name: "",
    type: "",
    country: "",
    state: "",
    district: "",
    city: "",
    locationLink: "",
    bestTime: "",
    entryFee: "",
    openingHours: "",
    duration: "",
    shortDescription: "",
    fullDescription: "",
    isFamilyFriendly: false,
    isPetFriendly: false,
    wheelchairAccessible: false,
    permitsRequired: "",
    nearestCity: "",
};

export default function AddLocationClient() {
    const [form, setForm] = useState<LocationForm>(initialForm);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const locationsRef = collection(db, "Locations");

    // Real-time listener (updates automatically when collection changes)
    useEffect(() => {
        const q = query(locationsRef, orderBy("createdAt", "desc"));
        const unsub = onSnapshot(
            q,
            (snapshot) => {
                const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
                setLocations(list);
                setLoading(false);
            },
            (err) => {
                console.error("Locations onSnapshot error:", err);
                setLoading(false);
            }
        );

        return () => unsub();
    }, []); // run once

    function updateField<K extends keyof LocationForm>(key: K, value: LocationForm[K]) {
        setForm((p) => ({ ...p, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // runtime validation
        if (!form.name.trim() || !form.locationLink.trim()) {
            alert("Please provide both Name and Google Maps Location Link.");
            return;
        }

        try {
            setSubmitting(true);
            // Prepare payload; add timestamp
            const payload = {
                ...form,
                createdAt: serverTimestamp(),
            };

            await addDoc(locationsRef, payload);
            // success UI
            setForm(initialForm);
            // note: list updates automatically via onSnapshot
            setSubmitting(false);
            alert("Location added.");
        } catch (err) {
            console.error("Add location error:", err);
            setSubmitting(false);
            alert("Failed to add location. Check console for details.");
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold mb-6">Add New Travel Location</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name (Required) */}
                    <div>
                        <label className="font-medium">Location Name *</label>
                        <input
                            required
                            value={form.name}
                            type="text"
                            className="w-full mt-1 p-2 border rounded"
                            onChange={(e) => updateField("name", e.target.value)}
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="font-medium">Location Type</label>
                        <select
                            value={form.type}
                            className="w-full mt-1 p-2 border rounded"
                            onChange={(e) => updateField("type", e.target.value)}
                        >
                            <option value="">Select</option>
                            <option value="country">Country</option>
                            <option value="state">State</option>
                            <option value="district">District</option>
                            <option value="city">City</option>
                            <option value="attraction">Attraction</option>
                            <option value="landmark">Landmark</option>
                            <option value="beach">Beach</option>
                            <option value="mountain">Mountain</option>
                        </select>
                    </div>

                    {/* Administrative Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium">Country</label>
                            <input
                                value={form.country}
                                onChange={(e) => updateField("country", e.target.value)}
                                placeholder="Country"
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="font-medium">State / Province</label>
                            <input
                                value={form.state}
                                onChange={(e) => updateField("state", e.target.value)}
                                placeholder="State / Province"
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="font-medium">District / Region</label>
                            <input
                                value={form.district}
                                onChange={(e) => updateField("district", e.target.value)}
                                placeholder="District / Region"
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div>
                            <label className="font-medium">City / Town</label>
                            <input
                                value={form.city}
                                onChange={(e) => updateField("city", e.target.value)}
                                placeholder="City / Town"
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>

                    {/* Location Link (Required) */}
                    <div>
                        <label className="font-medium">Google Maps Location Link *</label>
                        <input
                            required
                            value={form.locationLink}
                            type="url"
                            placeholder="https://maps.google.com/..."
                            className="w-full mt-1 p-2 border rounded"
                            onChange={(e) => updateField("locationLink", e.target.value)}
                        />
                    </div>

                    {/* Travel Info */}
                    <div>
                        <label className="font-medium">Best Time to Visit</label>
                        <input
                            value={form.bestTime}
                            onChange={(e) => updateField("bestTime", e.target.value)}
                            className="w-full mt-1 p-2 border rounded"
                            placeholder="e.g., Apr - Jun"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="font-medium">Entry Fee</label>
                            <input
                                value={form.entryFee}
                                onChange={(e) => updateField("entryFee", e.target.value)}
                                className="w-full mt-1 p-2 border rounded"
                                placeholder="e.g., 10 USD or 'Free'"
                            />
                        </div>
                        <div>
                            <label className="font-medium">Opening Hours</label>
                            <input
                                value={form.openingHours}
                                onChange={(e) => updateField("openingHours", e.target.value)}
                                className="w-full mt-1 p-2 border rounded"
                                placeholder="e.g., 8:00 - 18:00"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="font-medium">Recommended Duration</label>
                        <input
                            value={form.duration}
                            onChange={(e) => updateField("duration", e.target.value)}
                            className="w-full mt-1 p-2 border rounded"
                            placeholder="e.g., 2-3 hours"
                        />
                    </div>

                    {/* Descriptions */}
                    <div>
                        <label className="font-medium">Short Description</label>
                        <textarea
                            value={form.shortDescription}
                            onChange={(e) => updateField("shortDescription", e.target.value)}
                            className="w-full mt-1 p-2 border rounded"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="font-medium">Full Description</label>
                        <textarea
                            value={form.fullDescription}
                            onChange={(e) => updateField("fullDescription", e.target.value)}
                            className="w-full mt-1 p-2 border rounded"
                            rows={5}
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.isFamilyFriendly}
                                onChange={(e) => updateField("isFamilyFriendly", e.target.checked)}
                            />
                            Family Friendly
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.isPetFriendly}
                                onChange={(e) => updateField("isPetFriendly", e.target.checked)}
                            />
                            Pet Friendly
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.wheelchairAccessible}
                                onChange={(e) => updateField("wheelchairAccessible", e.target.checked)}
                            />
                            Wheelchair Accessible
                        </label>
                    </div>

                    {/* Permits */}
                    <div>
                        <label className="font-medium">Permits Required</label>
                        <input
                            value={form.permitsRequired}
                            onChange={(e) => updateField("permitsRequired", e.target.value)}
                            className="w-full mt-1 p-2 border rounded"
                            placeholder="e.g., Permit details or 'No'"
                        />
                    </div>

                    {/* Nearby */}
                    <div>
                        <label className="font-medium">Nearest City</label>
                        <input
                            value={form.nearestCity}
                            onChange={(e) => updateField("nearestCity", e.target.value)}
                            className="w-full mt-1 p-2 border rounded"
                            placeholder="Nearest city name"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className={`w-full py-3 rounded-lg font-semibold ${submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                    >
                        {submitting ? "Adding..." : "Add Location"}
                    </button>
                </form>

                {/* -------------------- LIST OF LOCATIONS -------------------- */}
                <h2 className="text-xl font-bold mt-10 mb-3">Existing Locations</h2>

                {loading ? (
                    <p className="text-gray-600">Loading locations...</p>
                ) : locations.length === 0 ? (
                    <p className="text-gray-600">No locations added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {locations.map((loc) => (
                            <div
                                key={loc.id}
                                className="p-3 border rounded bg-gray-50 flex flex-col md:flex-row justify-between gap-3"
                            >
                                <div>
                                    <p className="font-semibold text-lg">{loc.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {loc.city ? `${loc.city}, ` : ""}
                                        {loc.state ? `${loc.state}, ` : ""}
                                        {loc.country || ""}
                                    </p>
                                    <p className="text-sm mt-1">{loc.shortDescription}</p>
                                    <a
                                        className="text-blue-600 text-sm underline mt-2 inline-block"
                                        href={loc.locationLink}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Location
                                    </a>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-500">{loc.type || "—"}</p>
                                    <p className="text-xs text-gray-400 mt-2">
                                        {loc.entryFee ? `Fee: ${loc.entryFee}` : ""}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
