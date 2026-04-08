
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { HiPaperAirplane, HiLocationMarker, HiUserGroup, HiCalendar, HiCurrencyDollar, HiCheckCircle, HiUser, HiMail, HiPhone } from "react-icons/hi";
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
        adults: 1,
        children: 0,
        infants: 0,
        tripType: "Friends",
        budget: "Standard",
        startDate: "",
        departurePlace: "",
        pickupLocation: "",
        dropLocation: "",
        accommodationPreference: "Standard",
        mealPlan: [] as string[],
        interests: [] as string[],
        additionalNotes: "",
        userDetails: {
            name: "",
            email: "",
            phone: "",
        },
    });

    // Pre-fill user details from session
    useState(() => {
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                userDetails: {
                    ...prev.userDetails,
                    name: session.user?.name || prev.userDetails.name,
                    email: session.user?.email || prev.userDetails.email,
                }
            }));
        }
    });

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            userDetails: {
                ...formData.userDetails,
                [e.target.name]: e.target.value
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "adults" || name === "children" || name === "infants") {
            const val = parseInt(value) || 0;
            const updatedData = { ...formData, [name]: val };
            updatedData.groupSize = updatedData.adults + updatedData.children + updatedData.infants;
            setFormData(updatedData);
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleMealPlanChange = (meal: string) => {
        const current = [...formData.mealPlan];
        if (current.includes(meal)) {
            setFormData({ ...formData, mealPlan: current.filter(m => m !== meal) });
        } else {
            setFormData({ ...formData, mealPlan: [...current, meal] });
        }
    };

    const handleInterestChange = (interest: string) => {
        const current = [...formData.interests];
        if (current.includes(interest)) {
            setFormData({ ...formData, interests: current.filter(i => i !== interest) });
        } else {
            setFormData({ ...formData, interests: [...current, interest] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!session?.user?.email) {
            setError("Please login to submit a request.");
            setLoading(false);
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
                adults: 1,
                children: 0,
                infants: 0,
                tripType: "Friends",
                budget: "Standard",
                startDate: "",
                departurePlace: "",
                pickupLocation: "",
                dropLocation: "",
                accommodationPreference: "Standard",
                mealPlan: [],
                interests: [],
                additionalNotes: "",
                userDetails: {
                    name: session?.user?.name || "",
                    email: session?.user?.email || "",
                    phone: "",
                },
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
            <div id="customize-form" className="bg-green-50 border border-green-200 rounded-3xl p-10 text-center shadow-sm max-w-4xl mx-auto">
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
        <div id="customize-form" className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row">
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

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Contact Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <HiUser className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        placeholder="John Doe"
                                        value={formData.userDetails.name}
                                        onChange={handleUserChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <HiMail className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        placeholder="john@example.com"
                                        value={formData.userDetails.email}
                                        onChange={handleUserChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <div className="relative">
                                <HiPhone className="absolute left-3 top-3.5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    placeholder="+91 98765 43210"
                                    value={formData.userDetails.phone}
                                    onChange={handleUserChange}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Trip Basics */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Trip Details</h4>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Departure City</label>
                                <div className="relative">
                                    <HiLocationMarker className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="departurePlace"
                                        required
                                        placeholder="e.g. New Delhi, Mumbai"
                                        value={formData.departurePlace}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (Optional)</label>
                                <div className="relative">
                                    <HiCalendar className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Traveler Breakdown */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Who is traveling?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                                <input
                                    type="number"
                                    name="adults"
                                    min="1"
                                    value={formData.adults}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Children (5-12y)</label>
                                <input
                                    type="number"
                                    name="children"
                                    min="0"
                                    value={formData.children}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Infants (&lt;5y)</label>
                                <input
                                    type="number"
                                    name="infants"
                                    min="0"
                                    value={formData.infants}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white font-bold"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trip Type</label>
                                <select
                                    name="tripType"
                                    value={formData.tripType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white appearance-none font-bold"
                                >
                                    <option value="Family">Family</option>
                                    <option value="Friends">Friends</option>
                                    <option value="Couple">Couple</option>
                                    <option value="Solo">Solo</option>
                                    <option value="Corporate">Corporate</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Budget Preference</label>
                                <select
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white appearance-none font-bold"
                                >
                                    <option value="Budget">Budget Friendly</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Luxury">Luxury</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Preferences */}
                    <div className="space-y-6">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Preferences</h4>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">What are your interests? (Select all that apply)</label>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {["Nature", "Adventure", "Culture", "History", "Food", "Relaxation", "Religious", "Photography", "Honeymoon"].map((interest) => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => handleInterestChange(interest)}
                                        className={`px-4 py-2 rounded-full border transition-all ${
                                            formData.interests.includes(interest)
                                            ? "bg-black text-white border-black"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                        }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation</label>
                                <select
                                    name="accommodationPreference"
                                    value={formData.accommodationPreference}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white appearance-none font-bold"
                                >
                                    <option value="Standard">Standard Hotel</option>
                                    <option value="Premium">Premium Hotel</option>
                                    <option value="Luxury">Luxury Resort</option>
                                    <option value="Homestay">Homestay / Local Villa</option>
                                    <option value="Camps">Camps / Glamping</option>
                                    <option value="Budget">Budget Guest House</option>
                                    <option value="Not Required">Not Required</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Plan</label>
                                <div className="flex flex-wrap gap-x-6 gap-y-2">
                                    {["Breakfast", "Lunch", "Dinner"].map((meal) => (
                                        <label key={meal} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.mealPlan.includes(meal)}
                                                onChange={() => handleMealPlanChange(meal)}
                                                className="w-5 h-5 text-black rounded border-gray-300 focus:ring-0"
                                            />
                                            <span className="text-sm text-gray-700 font-medium">{meal}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                            <textarea
                                name="additionalNotes"
                                rows={4}
                                placeholder="Tell us more about your ideal trip? e.g. Specific landmarks, dietary needs, transport preference (Private/Shared), etc."
                                value={formData.additionalNotes}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-colors bg-gray-50 focus:bg-white resize-none"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                            {error}
                        </div>
                    )}

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-bold py-5 rounded-2xl hover:bg-gray-800 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                        >
                            {loading ? (
                                <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Design My Perfect Trip <HiPaperAirplane className="rotate-90 text-xl" />
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Our travel experts will respond with a custom itinerary within 24 hours.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
