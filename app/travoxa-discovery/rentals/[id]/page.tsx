"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/ui/Header";
import Footor from "@/components/ui/Footor";
import {
    FaWhatsapp,
    FaStar,
    FaGasPump,
    FaUserGroup,
    FaHelmetSafety,
    FaCheck,
    FaCalendar,
    FaClock,
    FaRoute,
    FaIdCard,
    FaShieldHalved
} from "react-icons/fa6";
import { MdLocationOn, MdPlace, MdPhone, MdMap } from "react-icons/md";
import { HiBadgeCheck, HiLocationMarker, HiPhone, HiGlobeAlt } from "react-icons/hi";
import SaveButton from "@/components/ui/SaveButton";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";
import RelatedPackages from "@/components/ui/RelatedPackages";

export default function RentalDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [rental, setRental] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        const fetchRental = async () => {
            try {
                const res = await fetch(`/api/rentals/${id}`);
                const data = await res.json();
                if (data.success) {
                    setRental(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch rental details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRental();
        }
    }, [id]);

    const handleWhatsApp = (isBookingRequest = false) => {
        if (!rental) return;

        let message = `Hi, I'm interested in renting ${rental.name} (${rental.model}) in ${rental.location}. Please provide details.`;

        if (isBookingRequest && selectedDate) {
            message = `Hi, I would like to request a booking for ${rental.name} (${rental.model}) on ${selectedDate}. Is it available?`;
        }

        if (rental.whatsapp) {
            window.open(`https://wa.me/91${rental.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
        }
    };

    const ensureProtocol = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!rental) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Rental not found</h2>
                    <p className="text-slate-500">The rental you are looking for does not exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <Header forceWhite={true} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

                {/* Back Button & Save Button */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-full text-sm font-bold border border-slate-200 shadow-sm"
                    >
                        <FaArrowLeft /> BACK
                    </button>
                    <SaveButton
                        itemId={rental._id || id}
                        itemType="rental"
                        title={rental.name}
                        itemLink={`/travoxa-discovery/rentals/${rental._id || id}`}
                    />
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold uppercase tracking-wider mb-2">
                            {rental.type}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 Mont mb-2">{rental.name}</h1>
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <MdLocationOn className="text-emerald-500" />
                            {rental.location}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {rental.rating > 0 && (
                            <div className="flex items-center gap-1.5 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                                <FaStar className="text-orange-400" />
                                <span className="font-bold text-slate-900">{rental.rating}</span>
                                <span className="text-slate-400 text-xs">({rental.reviews || 0} reviews)</span>
                            </div>
                        )}
                        {rental.verified && (
                            <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                                <FaCheck size={12} /> Verified
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* LEFT COLUMN: Gallery & Details */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Main Image */}
                        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                            <Image
                                src={rental.image}
                                alt={rental.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium">
                                Model Year: {rental.model}
                            </div>
                        </div>

                        {/* Features Grid */}
                        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-8 Mont">Vehicle Specifications</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                <div className="flex flex-col items-center justify-center text-center gap-3 p-6 bg-slate-50 rounded-2xl transition-all hover:bg-emerald-50 group">
                                    <FaGasPump size={28} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase mb-1">Mileage</p>
                                        <p className="text-sm font-bold text-slate-900">{rental.mileage} km/l</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center gap-3 p-6 bg-slate-50 rounded-2xl transition-all hover:bg-emerald-50 group">
                                    <FaUserGroup size={28} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase mb-1">Capacity</p>
                                        <p className="text-sm font-bold text-slate-900">{rental.seats} Seats</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center gap-3 p-6 bg-slate-50 rounded-2xl transition-all hover:bg-emerald-50 group">
                                    <FaGasPump size={28} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase mb-1">Fuel Type</p>
                                        <p className="text-sm font-bold text-slate-900">{rental.fuel}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center text-center gap-3 p-6 bg-slate-50 rounded-2xl transition-all hover:bg-emerald-50 group">
                                    <FaHelmetSafety size={28} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium uppercase mb-1">Safety</p>
                                        <p className="text-sm font-bold text-slate-900">{rental.helmet}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Rental Service Info */}
                        {rental.rentalServiceName && (
                            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Service Provider</p>
                                    <h3 className="text-2xl font-bold text-slate-900 Mont">{rental.rentalServiceName}</h3>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                        <MdPlace className="text-emerald-500" />
                                        <span className="font-medium">{rental.city}</span>
                                    </div>
                                    {rental.googleMapLink && (
                                        <a
                                            href={rental.googleMapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors"
                                        >
                                            <MdMap />
                                            <span className="font-bold text-xs uppercase tracking-wide">View on Maps</span>
                                        </a>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Rental Rules & Policies */}
                        <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-8 Mont">Rental Rules & Policies</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                            <FaUserGroup size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Minimum Age</p>
                                            <p className="text-sm font-bold text-slate-900">{rental.minAge || '18'}+ Years</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                            <FaIdCard size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Documents Required</p>
                                            <p className="text-sm font-bold text-slate-900">{rental.documentsRequired?.join(', ') || 'Driving License, Aadhar Card'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                            <FaGasPump size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Fuel Policy</p>
                                            <p className="text-sm font-bold text-slate-900">{rental.fuelPolicy || 'Self-refill / Full to Full'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                            <FaClock size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Late Return Charges</p>
                                            <p className="text-sm font-bold text-slate-900">{rental.lateReturnCharges || 'Additional hourly rate applies'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                            <FaShieldHalved size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Vehicle Condition</p>
                                            <p className="text-sm font-bold text-slate-900">{rental.vehicleCondition || 'Excellent / Well Maintained'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                            <FaRoute size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Mileage Policy</p>
                                            <p className="text-sm font-bold text-slate-900">{rental.perDayKmLimit || '200'} km/day limit. Next ₹{rental.extraKmCharge || '5'}/km</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Partners Info */}
                        {rental.partners && rental.partners.length > 0 && (
                            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold text-slate-900 Mont">Verified Rental Partners</h2>
                                    <p className="text-slate-500 mt-1 text-sm Inter">Meet our authorized rental service providers</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {rental.partners.map((partner: any, index: number) => (
                                        <div key={index} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-emerald-200 transition-colors">
                                            <div className="flex items-center gap-4 mb-4">
                                                {partner.logo ? (
                                                    <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                                                        <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                                        <span className="text-slate-400 text-xs font-medium uppercase tracking-tighter">No Logo</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                                        {partner.name}
                                                        {partner.isVerified && <HiBadgeCheck className="text-blue-500 text-xl" title="Verified Partner" />}
                                                    </h3>
                                                    {(partner.location || partner.state) && (
                                                        <p className="text-sm text-slate-500 flex items-start gap-1 mt-1">
                                                            <HiLocationMarker className="text-emerald-500 mt-0.5 shrink-0" />
                                                            <span>
                                                                {partner.location}{partner.location && partner.state ? ', ' : ''}{partner.state}
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {(partner.phone || partner.website) && (
                                                <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
                                                    {partner.phone && (
                                                        <a href={`tel:${partner.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors">
                                                            <HiPhone className="text-slate-400" />
                                                            <span>{partner.phone}</span>
                                                        </a>
                                                    )}
                                                    {partner.website && (
                                                        <a href={ensureProtocol(partner.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline transition-colors">
                                                            <HiGlobeAlt className="text-slate-400" />
                                                            <span>Visit Website</span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}


                    </div>

                    {/* RIGHT COLUMN: Booking Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-24">
                            <div className="mb-8">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Daily Rate</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-slate-900">₹{rental.price.toLocaleString('en-IN')}</span>
                                    <span className="text-slate-500 font-medium text-lg">/ day</span>
                                </div>
                            </div>


                            <div className="space-y-4 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Hourly Rate</span>
                                    <span className="font-bold text-slate-900">₹{rental.hourlyPrice || '100'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Weekly Rate</span>
                                    <span className="font-bold text-slate-900">₹{rental.weeklyPrice || (rental.price * 6.5).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200">
                                    <span className="text-slate-500">Security Deposit</span>
                                    <span className="font-bold text-emerald-600">₹{rental.securityDeposit || '1,000'}</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs text-slate-400 font-bold uppercase tracking-widest mb-2 px-1">Select Booking Date</label>
                                <div className="relative">
                                    <FaCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <button
                                    onClick={() => handleWhatsApp(true)}
                                    disabled={!selectedDate}
                                    className="w-full bg-black hover:bg-black/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-black/20 flex flex-col items-center justify-center gap-1 disabled:cursor-not-allowed group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FaCalendar size={18} className="group-hover:scale-110 transition-transform" />
                                        <span>Request Booking</span>
                                    </div>
                                    <span className="text-[10px] font-medium opacity-60 uppercase tracking-wider">No payment now • Pay after confirmation</span>
                                </button>

                                <button
                                    onClick={() => handleWhatsApp(false)}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 group"
                                >
                                    <FaWhatsapp size={24} className="group-hover:scale-110 transition-transform" />
                                    Contact on WhatsApp
                                </button>
                            </div>

                            <p className="text-center text-[10px] text-slate-400 mb-8 italic uppercase tracking-wider font-bold">Expect a reply within 15-30 mins</p>

                            {/* Contact Info */}
                            <div className="border-t border-slate-100 pt-8">
                                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    Contact Support
                                </h3>
                                <div className="space-y-4">
                                    {rental.whatsapp && (
                                        <div className="flex items-center gap-4 text-slate-600 group">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-all">
                                                <MdPhone size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Phone</p>
                                                <a href={`tel:${rental.whatsapp}`} className="font-bold text-slate-900 hover:text-emerald-600 transition-colors">+91 {rental.whatsapp}</a>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Moved Feature Points */}
                                <div className="space-y-3 mt-8 pt-8 border-t border-slate-50">
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                            <FaCheck size={8} />
                                        </div>
                                        <span className="text-xs font-medium">Free cancellation up to 24h</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                            <FaCheck size={8} />
                                        </div>
                                        <span className="text-xs font-medium">Instant confirmation</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500">
                                        <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                            <FaCheck size={8} />
                                        </div>
                                        <span className="text-xs font-medium">Verified vehicle & owner</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <RelatedPackages
                    tours={rental?.relatedTours}
                    sightseeing={rental?.relatedSightseeing}
                    activities={rental?.relatedActivities}
                    rentals={rental?.relatedRentals}
                    stays={rental?.relatedStays}
                    food={rental?.relatedFood}
                    attractions={rental?.relatedAttractions}
                />
            </div>

            <Footor />
        </div>
    );
}
