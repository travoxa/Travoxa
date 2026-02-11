
"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { SightseeingPackage } from "@/data/sightseeingData";
import NormalHeader from "@/components/ui/NormalHeader";
import Footor from "@/components/ui/Footor";
import { FaClock, FaCar, FaUserFriends, FaMapMarkerAlt, FaCheckCircle, FaTimesCircle, FaWhatsapp, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import ReviewSection from "@/components/sightseeing/ReviewSection";

export default function SightseeingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [pkg, setPkg] = useState<SightseeingPackage | null>(null);
    const [loading, setLoading] = useState(true);

    // Booking Modal State
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingDate, setBookingDate] = useState("");
    const [name, setName] = useState("");
    const [bookingType, setBookingType] = useState<'private' | 'sharing'>('sharing');

    // Fetch package from API
    useEffect(() => {
        const fetchPackage = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/sightseeing');
                const data = await res.json();
                if (data.success) {
                    const foundPackage = data.data.find((p: SightseeingPackage) => p.id === id);
                    if (foundPackage) {
                        setPkg(foundPackage);
                        // Set default booking type
                        if (foundPackage.isPrivate && !foundPackage.isSharing) {
                            setBookingType('private');
                        } else {
                            setBookingType('sharing');
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch sightseeing package:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <NormalHeader />
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mt-20"></div>
            </div>
        );
    }

    if (!pkg) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <NormalHeader />
                <h1 className="text-2xl font-bold text-slate-900 mt-20">Package Not Found</h1>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-emerald-600 font-bold hover:underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const handleWhatsApp = () => {
        const message = `Hi, I want to book ${pkg.title} in ${pkg.city}. My travel date is [Enter Date]. Members: [Enter Count].`;
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Thank you ${name}! Your request for ${pkg.title} (${bookingType === 'private' ? 'Private' : 'Shared'}) on ${bookingDate} has been received. Our team will contact you shortly.`);
        setIsBookingOpen(false);
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            <NormalHeader />

            {/* HERO BANNER */}
            <div className="relative h-[60vh] lg:h-[70vh] w-full">
                <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                <div className="absolute top-24 left-4 md:left-8 z-20">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium"
                    >
                        <FaArrowLeft /> Back to Search
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-sm mb-2">
                                    <FaMapMarkerAlt /> {pkg.city}, {pkg.state}
                                </div>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 Mont leading-tight">
                                    {pkg.title}
                                </h1>
                                <div className="flex flex-wrap gap-4 text-sm md:text-base font-medium text-white/90">
                                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg border border-white/20">
                                        <FaClock className="text-emerald-400" /> {pkg.duration}
                                    </span>
                                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg border border-white/20">
                                        <FaCar className="text-emerald-400" /> {pkg.vehicleType}
                                    </span>
                                    <span className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg border border-white/20">
                                        <FaUserFriends className="text-emerald-400" /> Max {pkg.maxPeople} Guests
                                    </span>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>

            {/* DETAILS SECTION */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-3 gap-12">

                {/* LEFT CONTENT */}
                <div className="lg:col-span-2 space-y-12">

                    {/* Overview */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 Mont">Overview</h2>
                        <p className="text-slate-600 leading-relaxed text-lg Inter">
                            {pkg.overview}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {pkg.highlights.map((tag, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">#{tag}</span>
                            ))}
                        </div>
                    </section>

                    {/* Places Covered */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 Mont">Places Covered</h2>
                        <div className="flex flex-wrap gap-3">
                            {pkg.placesCovered.map((place, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <FaMapMarkerAlt className="text-emerald-500" />
                                    <span className="font-medium text-slate-700">{place}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Itinerary */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 Mont">Itinerary</h2>
                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-8">
                            {pkg.itinerary.map((item, index) => (
                                <div key={index} className="relative pl-8">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm"></div>
                                    <div className="mb-1 flex items-center gap-3">
                                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{item.time || `Step ${index + 1}`}</span>
                                        <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Inclusions Card */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-full">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">What's Included</h3>
                            <ul className="space-y-3">
                                {pkg.inclusions.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                        <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Exclusions Card */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 h-full">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">What's Excluded</h3>
                            <ul className="space-y-3">
                                {pkg.exclusions.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-500">
                                        <FaTimesCircle className="text-red-400 mt-0.5 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <ReviewSection packageId={id} />
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="space-y-8">

                    {/* PRICE & BOOKING CARD (Sticky) */}
                    <div className="sticky top-24 z-10">
                        <div className="bg-white border border-slate-200 shadow-xl rounded-2xl p-6">

                            {/* Previous Booking Logic moved here with updated styling */}
                            {pkg.isPrivate && pkg.isSharing && (
                                <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
                                    <button
                                        onClick={() => setBookingType('sharing')}
                                        className={`flex-1 text-sm font-bold py-2.5 rounded-md transition-all ${bookingType === 'sharing' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        SHARED
                                    </button>
                                    <button
                                        onClick={() => setBookingType('private')}
                                        className={`flex-1 text-sm font-bold py-2.5 rounded-md transition-all ${bookingType === 'private' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        PRIVATE
                                    </button>
                                </div>
                            )}

                            <div>
                                <p className="text-sm text-slate-500 font-medium mb-1">
                                    {bookingType === 'private' ? 'Total Package Price' : 'Price per Person'}
                                </p>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold text-slate-900">
                                        ₹{(bookingType === 'private' ? (pkg.pricePrivate || pkg.price) : (pkg.priceSharing || pkg.price)).toLocaleString()}
                                    </span>
                                    <span className="text-sm font-medium text-slate-500">
                                        / {bookingType === 'private' ? 'vehicle' : 'person'}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setIsBookingOpen(true)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
                                    >
                                        Book {bookingType === 'private' ? 'Private Tour' : 'Shared Tour'}
                                    </button>
                                    <button
                                        onClick={handleWhatsApp}
                                        className="w-full bg-white border-2 border-emerald-50 text-emerald-600 font-bold py-3.5 rounded-xl transition-colors hover:bg-emerald-50 flex items-center justify-center gap-2"
                                    >
                                        <FaWhatsapp size={20} /> Contact / Customize
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Private/Sharing Specifics */}
                    {(pkg.isSharing || pkg.isPrivate) && (
                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <h3 className="text-lg font-bold text-emerald-900 mb-4">Package Details</h3>
                            <div className="space-y-4">
                                {pkg.isSharing && pkg.pickupPoints && pkg.pickupPoints.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-emerald-800 mb-2">Pickup Points</h4>
                                        <ul className="space-y-1">
                                            {pkg.pickupPoints.map((point, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                                                    <FaMapMarkerAlt className="mt-1 shrink-0" size={12} />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {pkg.isPrivate && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-emerald-800">
                                            {pkg.fuelIncluded ? <FaCheckCircle className="text-emerald-500" /> : <FaTimesCircle className="text-red-400" />}
                                            <span>Fuel Charge {pkg.fuelIncluded ? 'Included' : 'Extra'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-emerald-800">
                                            {pkg.driverIncluded ? <FaCheckCircle className="text-emerald-500" /> : <FaTimesCircle className="text-red-400" />}
                                            <span>Driver Allowance {pkg.driverIncluded ? 'Included' : 'Extra'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-emerald-800">
                                            {pkg.customizablePickup ? <FaCheckCircle className="text-emerald-500" /> : <FaTimesCircle className="text-red-400" />}
                                            <span>{pkg.customizablePickup ? 'Customizable Pickup & Drop' : 'Fixed Pickup & Drop'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}



                    <div className="bg-emerald-600 rounded-2xl p-8 text-white text-center">
                        <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                        <p className="text-emerald-100 mb-6 font-light">
                            Our travel experts are here to assist you with custom requirements or large groups.
                        </p>
                        <button
                            onClick={handleWhatsApp}
                            className="bg-white text-emerald-800 font-bold px-6 py-3 rounded-full hover:bg-emerald-50 transition-colors w-full"
                        >
                            Chat with Expert
                        </button>
                    </div>

                </div>
            </div>

            <Footor />

            {/* BOOKING MODAL */}
            {isBookingOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900">Book {pkg.title}</h3>
                            <button onClick={() => setIsBookingOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <FaTimesCircle size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Travel Date</label>
                                <input
                                    type="date"
                                    required
                                    value={bookingDate}
                                    onChange={(e) => setBookingDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Contact Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="+91 9876543210"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-colors mt-2"
                            >
                                Submit Enquiry
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
}
