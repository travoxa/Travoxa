
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { HiPaperAirplane, HiLocationMarker, HiUserGroup, HiCalendar, HiCurrencyDollar, HiCheckCircle } from "react-icons/hi";
import { route } from "@/lib/route";

export default function CustomTourForm() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        destination: "",
        duration: "",
        groupSize: 1,
        tripType: "Friends",
        budget: "Standard",
        startDate: "",
        additionalNotes: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!session?.user?.email) {
            setError("Please login to submit a request.");
            setLoading(false);
            // Optional: Redirect to login
            route("/login");
            return;
        }

        try {
            const res = await fetch("/api/tours/custom-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setSuccess(true);
            setFormData({
                destination: "",
                duration: "",
                groupSize: 1,
                tripType: "Friends",
                budget: "Standard",
                startDate: "",
                additionalNotes: "",
            });
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center shadow-sm max-w-4xl mx-auto">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <HiCheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                <p className="text-gray-600 mb-6">
                    Thank you for sharing your preferences. Our travel experts will craft a personalized itinerary and get back to you shortly.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="text-green-600 font-bold hover:underline"
                >
                    Send another request
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row">
            {/* Left Decoration Panel */}
            <div className="hidden md:block w-1/3 bg-black relative p-8 text-white flex flex-col justify-between">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                <div className="relative z-10">
                    <span className="bg-white/20 backdrop-blur-md text-xs font-bold py-1 px-3 rounded-full mb-4 inline-block">CUSTOMIZE YOUR TRIP</span>
                    <h3 className="text-3xl font-bold leading-tight mb-4">You Dream It,<br />We Build It.</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                        Tell us your preferences and let our AI and experts curate the perfect getaway just for you.
                    </p>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        200+ Travelers exploring today
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 p-8 md:p-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 md:hidden">Custom Trip Request</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                            <div className="relative">
                                <HiLocationMarker className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    name="destination"
                                    required
                                    placeholder="e.g. Paris, Bali, Kerala"
                                    value={formData.destination}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                            <div className="relative">
                                <HiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    type="text"
                                    name="duration"
                                    required
                                    placeholder="e.g. 5 Days"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Group Size</label>
                            <div className="relative">
                                <HiUserGroup className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    type="number"
                                    name="groupSize"
                                    required
                                    min="1"
                                    value={formData.groupSize}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                            <select
                                name="tripType"
                                value={formData.tripType}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white appearance-none"
                            >
                                <option value="Friends">Friends</option>
                                <option value="Family">Family</option>
                                <option value="Couple">Couple</option>
                                <option value="Solo">Solo</option>
                                <option value="Corporate">Corporate</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                            <div className="relative">
                                <HiCurrencyDollar className="absolute left-3 top-3.5 text-gray-400" />
                                <select
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white appearance-none"
                                >
                                    <option value="Budget">Budget</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Luxury">Luxury</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                        <textarea
                            name="additionalNotes"
                            rows={3}
                            placeholder="Specific activities, dietary requirements, or special requests..."
                            value={formData.additionalNotes}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white resize-none"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Submit Request <HiPaperAirplane className="rotate-90" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
