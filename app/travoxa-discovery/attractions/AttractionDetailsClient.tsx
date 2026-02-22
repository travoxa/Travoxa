'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/ui/Header';
import NormalHeader from '@/components/ui/NormalHeader';
import Footor from '@/components/ui/Footor';
import Image from 'next/image';
import {
    FaMapMarkerAlt, FaStar, FaRegClock, FaCheck,
    FaShieldAlt, FaCalendarAlt, FaInfoCircle, FaArrowLeft, FaTicketAlt, FaClock,
    FaWalking, FaBus, FaTaxi, FaTrain, FaPlane, FaShip, FaHospital, FaPhoneAlt, FaLightbulb,
    FaUsers, FaLock, FaChevronRight
} from 'react-icons/fa';
import { AttractionPackage } from './AttractionsClient';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AttractionDetailsClientProps {
    attraction: AttractionPackage;
}

const AttractionDetailsClient: React.FC<AttractionDetailsClientProps> = ({ attraction }) => {
    const router = useRouter();

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    const convertToMinutes = (timeStr: string) => {
        if (!timeStr) return 0;
        const parts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!parts) return 0;
        let [_, hours, minutes, modifier] = parts;
        let h = parseInt(hours);
        let m = parseInt(minutes);
        if (modifier.toUpperCase() === 'PM' && h < 12) h += 12;
        if (modifier.toUpperCase() === 'AM' && h === 12) h = 0;
        return h * 60 + m;
    };

    const getOpeningStatus = () => {
        if (!attraction.openingHoursExtended) return null;
        const now = new Date();
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const currentDay = days[now.getDay()];
        const schedule = (attraction.openingHoursExtended as any)[currentDay];

        if (!schedule || schedule.isClosed) return { status: 'Closed Today', color: 'text-red-500', icon: '🔴' };

        const currentTime = now.getHours() * 60 + now.getMinutes();
        for (const slot of schedule.slots) {
            const start = convertToMinutes(slot.start);
            const end = convertToMinutes(slot.end);
            if (currentTime >= start && currentTime <= end) {
                return { status: 'Open Now', color: 'text-emerald-500', icon: '🟢' };
            }
        }

        return { status: 'Closed Now', color: 'text-orange-500', icon: '🟠' };
    };

    const status = getOpeningStatus();
    const locationText = `${attraction.city}, ${attraction.state}`;

    const getTransportIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'metro': return <FaTrain />;
            case 'bus': return <FaBus />;
            case 'cab': case 'taxi': return <FaTaxi />;
            case 'train': return <FaTrain />;
            case 'airport': case 'flight': return <FaPlane />;
            case 'ferry': return <FaShip />;
            case 'walk': return <FaWalking />;
            default: return <FaMapMarkerAlt />;
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <NormalHeader logoHeight="h-[22px] lg:h-[28px]" />

            {/* HERO SECTION */}
            <div className="relative h-[65vh]  w-full bg-slate-900">
                {attraction.image ? (
                    <Image
                        src={attraction.image}
                        alt={attraction.title}
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">IMAGE NOT AVAILABLE</div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>


                <div className="absolute inset-x-0 bottom-0 pb-16">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="max-w-4xl" data-aos="fade-up">
                            {/* Badges Row */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                {attraction.badges?.map((badge, idx) => (
                                    <span key={idx} className="bg-emerald-500 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                        {badge}
                                    </span>
                                ))}
                                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                    {attraction.category}
                                </span>
                                <span className="bg-pink-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                    {attraction.type}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
                                {attraction.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-6 text-white/90 text-base md:text-lg">
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-pink-400" />
                                    <span>{locationText}</span>
                                </div>
                                {attraction.bestTime && (
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-blue-400" />
                                        <span>Best: {attraction.bestTime}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <FaRegClock className="text-emerald-400" />
                                    <span>{attraction.visitDuration} Required</span>
                                </div>
                                {attraction.googleRating && (
                                    <div className="flex items-center gap-2">
                                        <FaStar className="text-amber-400" />
                                        <span className="font-bold">{attraction.googleRating} Rating</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN: 8 Units */}
                    <div className="lg:col-span-8 space-y-16">

                        {/* Top Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-aos="fade-up">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center group transition-colors">
                                <div className="text-2xl text-emerald-600 mb-2">
                                    <FaRegClock />
                                </div>
                                <span className={`text-xs font-medium uppercase tracking-wide ${status?.color || 'text-gray-600'}`}>{status?.status || 'Open'}</span>
                                <span className="text-[10px] text-gray-400 font-bold mt-1">Status Now</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center group transition-colors">
                                <div className="text-2xl text-blue-600 mb-2">
                                    <FaTicketAlt />
                                </div>
                                <span className="text-xs font-medium uppercase tracking-wide text-gray-900">{attraction.entryFee > 0 ? `₹${attraction.entryFee}` : 'FREE'}</span>
                                <span className="text-[10px] text-gray-400 font-bold mt-1">Adult Entry</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center group transition-colors">
                                <div className="text-2xl text-orange-600 mb-2">
                                    <FaUsers />
                                </div>
                                <span className="text-xs font-medium uppercase tracking-wide text-gray-900">{attraction.travelInformation?.crowdLevel || 'Moderate'}</span>
                                <span className="text-[10px] text-gray-400 font-bold mt-1">Crowd Level</span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center text-center group transition-colors">
                                <div className="text-2xl text-pink-600 mb-2">
                                    <FaShieldAlt />
                                </div>
                                <span className="text-xs font-medium uppercase tracking-wide text-gray-900">{attraction.travelInformation?.safetyScore || '8.5'}/10</span>
                                <span className="text-[10px] text-gray-400 font-bold mt-1">Safety Score</span>
                            </div>
                        </div>

                        {/* Highlights Section */}
                        {attraction.highlights && attraction.highlights.length > 0 && (
                            <section data-aos="fade-up">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><FaCheck size={16} /></div>
                                    Highlights
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {attraction.highlights.map((highlight, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                                                <FaCheck size={10} />
                                            </div>
                                            <span className="text-gray-700 font-medium">{highlight}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Overview & Description */}
                        <section data-aos="fade-up">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {attraction.overview}
                            </p>

                            {/* Category Tags */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                {attraction.categoryTags?.map((tag, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-xs font-semibold border border-gray-200 uppercase tracking-widest">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Smart Info Sections (Flex Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Opening Hours Detailed */}
                            <div data-aos="fade-up" className="bg-white rounded-2xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FaClock size={16} /></div>
                                    Full Schedule
                                </h3>
                                <div className="space-y-4">
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                                        const schedule = (attraction.openingHoursExtended as any)?.[day.toLowerCase()];
                                        const hasSlots = schedule?.slots && schedule.slots.length > 0;

                                        return (
                                            <div key={day} className="flex items-center justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                                                <span className={`font-semibold ${new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day ? 'text-blue-600' : 'text-gray-500'}`}>{day}</span>
                                                <div className="text-right">
                                                    {schedule?.isClosed ? (
                                                        <span className="text-red-500 font-bold uppercase text-[10px]">Closed</span>
                                                    ) : hasSlots ? (
                                                        <div className="flex flex-col">
                                                            {schedule.slots.map((slot: any, sIdx: number) => (
                                                                <span key={sIdx} className="text-gray-900 font-semibold">{slot.start} – {slot.end}</span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 font-semibold">{attraction.openingHours || 'Not Specified'}</span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                    <p className="text-xs text-blue-800 font-medium italic flex items-center gap-2">
                                        <FaInfoCircle /> {attraction.openingHours}
                                    </p>
                                </div>
                            </div>

                            {/* Entry Pricing Detailed */}
                            <div data-aos="fade-up" className="bg-white rounded-2xl p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="p-2 bg-pink-50 rounded-lg text-pink-600"><FaTicketAlt size={16} /></div>
                                    Ticket Pricing
                                </h3>
                                <div className="space-y-3">
                                    {(attraction.entryPricing && attraction.entryPricing.length > 0) ? (
                                        attraction.entryPricing.map((p, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-gray-600 font-semibold text-sm">{p.category}</span>
                                                <span className="text-lg font-bold text-gray-900">₹{p.price}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                            <span className="text-gray-600 font-semibold text-sm">General Entry</span>
                                            <span className="text-lg font-bold text-emerald-600">{attraction.entryFee > 0 ? `₹${attraction.entryFee}` : 'FREE'}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Charges */}
                                {attraction.additionalCharges && attraction.additionalCharges.length > 0 && (
                                    <div className="mt-8 space-y-3">
                                        <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest pl-1">Extra Charges</p>
                                        {attraction.additionalCharges?.map((c, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm">
                                                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>
                                                <span className="text-gray-500 font-medium flex-1">{c.item}</span>
                                                <span className="text-gray-900 font-bold">{c.priceRange}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* How To Reach - Route Design */}
                        <div data-aos="fade-up" className="bg-white rounded-2xl p-8 border border-gray-100 relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-8 relative z-10">
                                <h2 className="text-2xl font-bold text-gray-900">How to Reach</h2>
                            </div>

                            <div className="relative space-y-8 pl-10 border-l-2 border-gray-100 ml-6">
                                {attraction.howToReach?.map((step, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="absolute -left-[54px] top-0 w-10 h-10 rounded-xl bg-white border-2 border-blue-500 flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 transition-transform">
                                            {getTransportIcon(step.type)}
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:bg-white transition-all duration-300">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                                                <h4 className="text-lg font-bold text-gray-900">{step.type}: {step.station}</h4>
                                                <div className="flex gap-4">
                                                    <span className="text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-full">{step.distance}</span>
                                                    <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full">{step.time}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                                                Approx Fare: <span className="text-gray-900 font-bold">{step.fare || step.fareRange || 'N/A'}</span>
                                                {step.availability && <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold ml-2">{step.availability}</span>}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {(!attraction.howToReach || attraction.howToReach.length === 0) && (
                                    <div className="text-gray-400 italic font-medium p-4">Detailed transport routes coming soon...</div>
                                )}
                            </div>
                        </div>

                        {/* Travoxa Smart Tips */}
                        {attraction.smartTips && attraction.smartTips.length > 0 && (
                            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-12" data-aos="fade-up">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <div className="bg-amber-100 p-2 rounded-lg">
                                        <FaLightbulb className="text-amber-600" />
                                    </div>
                                    Smart Tips
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {attraction.smartTips.map((tip, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                            <p className="text-gray-700 text-base font-semibold leading-snug">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Nearby Sections */}
                        <div className="space-y-16">
                            {/* Nearby Attractions */}
                            {attraction.nearbyAttractions && attraction.nearbyAttractions.length > 0 && (
                                <div data-aos="fade-up">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Nearby Gems</h2>
                                        <Link href="/travoxa-discovery/attractions" className="text-pink-600 font-bold uppercase text-xs tracking-widest hover:underline">View All</Link>
                                    </div>
                                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                                        {attraction.nearbyAttractions?.map((near, idx) => (
                                            <Link href={`/travoxa-discovery/attractions/${near._id}`} key={idx} className="min-w-[280px] group">
                                                <div className="relative h-48 rounded-2xl overflow-hidden mb-4 border border-gray-100">
                                                    <img src={near.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    <div className="absolute bottom-4 left-6">
                                                        <span className="bg-pink-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{near.type}</span>
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-pink-600 transition-colors">{near.title}</h4>
                                                <div className="flex items-center justify-between text-xs font-semibold text-gray-400 tracking-wider">
                                                    <span>{near.city}</span>
                                                    <span className="flex items-center gap-1"><FaStar className="text-yellow-400" /> {near.rating || '4.5'}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Nearby Food */}
                            {attraction.nearbyFood && attraction.nearbyFood.length > 0 && (
                                <div data-aos="fade-up">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Nearby Eats</h2>
                                        <Link href="/travoxa-discovery/food-and-cafes" className="text-orange-600 font-bold uppercase text-xs tracking-widest hover:underline">Explore More</Link>
                                    </div>
                                    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                                        {attraction.nearbyFood?.map((food, idx) => (
                                            <div key={idx} className="min-w-[260px] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                                <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                                                    <img src={food.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    <div className="absolute top-3 left-3">
                                                        <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold">
                                                            ★ {food.rating || '4.6'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-lg mb-2">{food.name}</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {food.cuisine?.slice(0, 2).map((c: string, cidx: number) => (
                                                        <span key={cidx} className="bg-gray-50 text-gray-500 px-3 py-1 rounded-lg text-[10px] font-bold border border-gray-100">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Emergency Info Grid */}
                        <div data-aos="fade-up" className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-xl font-bold mb-10 flex items-center gap-3">
                                    <div className="bg-red-600 p-2 rounded-xl"><FaShieldAlt /></div>
                                    <p className=' text-2xl text-black'>Emergency & Safety Info</p>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-4 p-6 bg-gray-100 rounded-2xl border border-white/10">
                                        <div className="flex items-center gap-3 text-red-400 font-bold uppercase text-[10px] tracking-widest"><FaHospital /> Nearest Hospital</div>
                                        <h4 className="font-bold text-lg text-black">{attraction.emergencyInfo?.hospital?.name || 'Agra Medical City'}</h4>
                                        <p className="text-gray-400 text-sm italic text-black">{attraction.emergencyInfo?.hospital?.distance || '1.8 km away'}</p>
                                    </div>
                                    <div className="space-y-4 p-6 bg-gray-100 rounded-2xl border border-white/10">
                                        <div className="flex items-center gap-3 text-blue-400 font-bold uppercase text-[10px] tracking-widest"><FaShieldAlt /> Police Station</div>
                                        <h4 className="font-bold text-lg text-black">{attraction.emergencyInfo?.police?.name || 'Local Tourism Police Post'}</h4>
                                        <p className="text-gray-400 text-sm italic text-black">{attraction.emergencyInfo?.police?.distance || '0.5 km away'}</p>
                                    </div>
                                    <div className="space-y-4 p-6 bg-gray-100 rounded-2xl border border-white/10">
                                        <div className="flex items-center gap-3 text-orange-400 font-bold uppercase text-[10px] tracking-widest"><FaPhoneAlt /> Local Hotline</div>
                                        <h4 className="text-3xl font-bold text-black">{attraction.emergencyInfo?.emergencyNumber || '112 / 100'}</h4>
                                        <p className="text-gray-400 text-sm text-black">Available 24/7 for Tourists</p>
                                    </div>
                                </div>
                                {attraction.emergencyInfo?.customInfo && attraction.emergencyInfo.customInfo.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {attraction.emergencyInfo.customInfo.map((info, idx) => (
                                            <div key={idx} className="flex items-center gap-3 text-gray-400 text-sm bg-white/5 px-4 py-3 rounded-xl">
                                                <FaCheck className="text-emerald-500 shrink-0" /> {info}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: 4 Units (Sticky Sidebar) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-8">
                            {/* Booking Card */}
                            <div className="bg-white rounded-3xl shadow-lg shadow-gray-200 border border-gray-200 overflow-hidden" data-aos="fade-left">
                                <div className="p-8 pb-0">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Entry Price</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-bold text-gray-900 tracking-tight">
                                                    {attraction.entryFee > 0 ? `₹${attraction.entryFee}` : 'FREE'}
                                                </span>
                                                {attraction.entryFee > 0 && <span className="text-gray-400 text-sm font-bold uppercase">/ person</span>}
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase shadow-sm ${status?.color === 'text-emerald-500' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-700'}`}>
                                            {status?.status || 'OPEN'}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 pt-4 space-y-4">
                                    <button className="w-full bg-black text-white font-bold py-4 rounded-xl text-lg hover:bg-gray-800 transition-all active:scale-[0.98] flex items-center justify-center gap-3">
                                        BOOK ENTRY TICKETS <FaChevronRight size={14} />
                                    </button>
                                    <button className="w-full bg-white text-gray-900 border border-gray-200 font-bold py-3 rounded-xl text-lg hover:bg-gray-50 transition-all active:scale-[0.98]">
                                        PLAN VISIT
                                    </button>
                                </div>

                                <div className="px-8 pb-8 space-y-4">
                                    <div className="flex items-center gap-4 text-gray-500 font-bold p-3 bg-gray-50 rounded-xl group transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                                            <FaLock className="text-emerald-500 text-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-900">Secure Payment</span>
                                            <span className="text-[9px] uppercase">100% Safe Transaction</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-gray-500 font-bold p-3 bg-gray-50 rounded-xl group transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                                            <FaInfoCircle className="text-blue-500 text-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs text-gray-900">Instant Access</span>
                                            <span className="text-[9px] uppercase">Receive Ticket via Mobile</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Promotional Sidebar Card */}
                            <div className="bg-white rounded-3xl p-8 text-white relative overflow-hidden group shadow-lg border border-gray-200">
                                <h3 className="text-xl font-bold mb-4 relative z-10 tracking-tight text-black">VIP Experience?</h3>
                                <p className=" text-black mb-8 font-medium leading-relaxed relative z-10">
                                    Skip the long queues and enjoy exclusive garden access with our VIP Heritage Pass.
                                </p>
                                <button className="bg-black text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-700 transition-all w-full relative z-10 shadow-md tracking-wider">
                                    UPGRADE PASS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footor />
        </div >
    );
};

export default AttractionDetailsClient;
