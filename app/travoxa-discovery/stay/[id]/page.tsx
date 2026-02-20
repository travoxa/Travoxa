"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/ui/Header";
import Footor from "@/components/ui/Footor";
import { FaMapMarkerAlt, FaStar, FaBed, FaBath, FaUserFriends, FaWhatsapp, FaCheck, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

export default function StayDetailsPage() {
    const { id } = useParams();
    const [stay, setStay] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState("");

    useEffect(() => {
        const fetchStay = async () => {
            try {
                const res = await fetch(`/api/stay/${id}`);
                const data = await res.json();
                if (data.success) {
                    setStay(data.data);
                    setActiveImage(data.data.coverImage);
                }
            } catch (error) {
                console.error("Failed to fetch stay details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchStay();
        }
    }, [id]);

    const handleWhatsApp = () => {
        if (!stay) return;
        const message = `Hi, I'm interested in booking ${stay.title} in ${stay.city}. Please provide more details.`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!stay) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p>Stay not found.</p>
            </div>
        );
    }

    const allImages = [stay.coverImage, ...stay.images];

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <Header forceWhite={true} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 Mont mb-2">{stay.title}</h1>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <FaMapMarkerAlt className="text-emerald-500" />
                            {stay.location}, {stay.city}, {stay.state}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {stay.rating > 0 && (
                            <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                                <FaStar className="text-orange-400" />
                                <span className="font-bold text-slate-900">{stay.rating}</span>
                                <span className="text-slate-400 text-xs">({stay.reviews} reviews)</span>
                            </div>
                        )}
                        <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            {stay.type}
                        </span>
                    </div>
                </div>

                {/* Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px] md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-lg">
                    {/* Main Image */}
                    <div className="relative h-full bg-slate-200">
                        <Image
                            src={activeImage}
                            alt="Main View"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Grid Images */}
                    <div className="grid grid-cols-2 gap-4 h-full">
                        {allImages.slice(1, 5).map((img: string, idx: number) => (
                            <div key={idx} className="relative bg-slate-200 h-full cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setActiveImage(img)}>
                                <Image
                                    src={img}
                                    alt={`Gallery ${idx}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                        {/* Placeholder if not enough images */}
                        {allImages.length < 5 && Array(5 - allImages.length).fill(0).map((_, idx) => (
                            <div key={`placeholder-${idx}`} className="relative bg-slate-200 h-full flex items-center justify-center text-slate-400">
                                <span className="text-xs">More photos coming soon</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* LEFT COLUMN: Details */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Overview */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-4 Mont">About this stay</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{stay.overview}</p>
                        </section>

                        {/* Key Features Grid */}
                        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 mb-6 Mont">Property Features</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-slate-50 rounded-xl">
                                    <FaUserFriends size={24} className="text-emerald-500" />
                                    <span className="text-sm font-medium text-slate-900">Max {stay.maxGuests} Guests</span>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-slate-50 rounded-xl">
                                    <FaBed size={24} className="text-emerald-500" />
                                    <span className="text-sm font-medium text-slate-900">{stay.bedrooms} Bedrooms</span>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-slate-50 rounded-xl">
                                    <FaBath size={24} className="text-emerald-500" />
                                    <span className="text-sm font-medium text-slate-900">{stay.bathrooms} Bathrooms</span>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center gap-2 p-4 bg-slate-50 rounded-xl">
                                    <span className="text-emerald-500 font-bold text-lg">{stay.checkInTime}</span>
                                    <span className="text-xs text-slate-500">Check-in</span>
                                </div>
                            </div>
                        </section>

                        {/* Amenities */}
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-6 Mont">What this place offers</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {stay.amenities.map((amenity: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 text-slate-700">
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                                            <FaCheck size={12} />
                                        </div>
                                        <span className="font-medium">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* RIGHT COLUMN: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 sticky top-24">
                            <div className="mb-6">
                                <span className="text-3xl font-bold text-slate-900">₹{stay.price.toLocaleString()}</span>
                                <span className="text-slate-500 font-medium"> / {stay.priceType === 'per_night' ? 'night' : 'person'}</span>
                            </div>

                            <button
                                onClick={handleWhatsApp}
                                className="w-full bg-black hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-4"
                            >
                                <FaWhatsapp size={20} />
                                Book via WhatsApp
                            </button>

                            <p className="text-center text-xs text-slate-400 mb-6">You won't be charged yet</p>

                            {/* Host Info */}
                            <div className="border-t border-slate-100 pt-6">
                                <h3 className="font-bold text-slate-900 mb-4">Contact Host</h3>
                                <div className="space-y-3">
                                    {stay.contactPhone && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <FaPhoneAlt className="text-slate-400" />
                                            <a href={`tel:${stay.contactPhone}`} className="hover:text-emerald-600 transition-colors">{stay.contactPhone}</a>
                                        </div>
                                    )}
                                    {stay.contactEmail && (
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <FaEnvelope className="text-slate-400" />
                                            <a href={`mailto:${stay.contactEmail}`} className="hover:text-emerald-600 transition-colors">{stay.contactEmail}</a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <Footor />
        </div>
    );
}
