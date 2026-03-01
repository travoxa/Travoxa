'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import {
    FaMapMarkerAlt, FaStar, FaUtensils, FaClock, FaCheckCircle,
    FaWhatsapp, FaPhoneAlt, FaUser, FaDirections, FaBicycle,
    FaWalking, FaLayerGroup, FaTags, FaAward, FaCrown, FaTag
} from 'react-icons/fa';
import { HiBadgeCheck, HiLocationMarker, HiPhone, HiGlobeAlt } from "react-icons/hi";
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import { FoodPackage } from '../FoodClient';
import SaveButton from '@/components/ui/SaveButton';
import RelatedPackages from '@/components/ui/RelatedPackages';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface FoodDetailsClientProps {
    pkg: FoodPackage;
}

export default function FoodDetailsClient({ pkg }: FoodDetailsClientProps) {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-quad',
        });
    }, []);

    const cuisineDisplay = Array.isArray(pkg.cuisine) ? pkg.cuisine.join(' • ') : pkg.cuisine;

    const ensureProtocol = (url: string) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        return `https://${url}`;
    };

    return (
        <main className="bg-slate-50 min-h-screen">
            <Header />

            {/* Hero Section */}
            <section className="relative h-[65vh] w-full overflow-hidden">
                <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap gap-3 mb-6"
                        >
                            {pkg.badges?.map((badge, idx) => (
                                <span key={idx} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-2
                                    ${badge === 'Verified by Travoxa' ? 'bg-emerald-500/90 text-white' :
                                        badge === 'Travoxa Recommended' ? 'bg-yellow-500/90 text-white' :
                                            badge === 'Premium' ? 'bg-slate-900/90 text-white' :
                                                'bg-white/90 text-slate-900'}`}>
                                    {badge === 'Verified by Travoxa' && <FaCheckCircle />}
                                    {badge === 'Travoxa Recommended' && <FaStar />}
                                    {badge === 'Premium' && <FaCrown />}
                                    {badge}
                                </span>
                            ))}
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-7xl font-black text-white mb-6 Mont tracking-tight leading-tight"
                        >
                            {pkg.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center gap-8"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-yellow-500 p-2 rounded-xl">
                                    <FaStar className="text-white text-lg" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-xl leading-none">{pkg.rating}</p>
                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{pkg.reviews} Reviews</p>
                                </div>
                            </div>

                            <div className="h-10 w-px bg-white/20 hidden md:block" />

                            <div className="flex items-center gap-3">
                                <div className="bg-emerald-500 p-2 rounded-xl">
                                    <FaUtensils className="text-white text-lg" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-xl leading-none uppercase">{pkg.category}</p>
                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{pkg.dishType}</p>
                                </div>
                            </div>

                            <div className="h-10 w-px bg-white/20 hidden md:block" />

                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500 p-2 rounded-xl">
                                    <FaMapMarkerAlt className="text-white text-lg" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-xl leading-none">{pkg.city}</p>
                                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{pkg.state}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Details */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Quick Overview Card */}
                        <div data-aos="fade-up" className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-8 justify-between">
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-3">
                                    <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">The Experience</span>
                                </div>
                                <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed Inter">
                                    {pkg.overview}
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4">
                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                        <FaAward className="text-yellow-500" />
                                        <span className="text-xs font-bold text-slate-700">Famous For: {pkg.famousDish}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                        <FaLayerGroup className="text-blue-500" />
                                        <span className="text-xs font-bold text-slate-700">{cuisineDisplay}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-px bg-slate-100 hidden md:block" />

                            <div className="md:w-64 flex flex-col justify-center items-center text-center space-y-4">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Affordability</p>
                                <div className="space-y-1">
                                    <p className="text-4xl font-black text-slate-900 Mont">₹{pkg.avgCostPerPerson}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Per Person (Avg)</p>
                                </div>
                                <div className="h-px w-12 bg-slate-200" />
                                <div className="space-y-1">
                                    <p className="text-2xl font-black text-slate-600 Mont">₹{pkg.avgCost}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">For 2 People</p>
                                </div>
                            </div>
                        </div>

                        {/* Facilities Section */}
                        <div data-aos="fade-up" className="space-y-6">
                            <h2 className="text-3xl font-black text-slate-900 Mont flex items-center gap-4">
                                <span className="w-12 h-1 bg-yellow-500 rounded-full" />
                                Facilities & Services
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className={`p-6 rounded-3xl border transition-all ${pkg.dineIn ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${pkg.dineIn ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            <FaUtensils size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Dine-In</p>
                                            <p className="text-[10px] font-bold text-slate-500">{pkg.dineIn ? 'Available Now' : 'Not Available'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-6 rounded-3xl border transition-all ${pkg.takeaway ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${pkg.takeaway ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            <FaWalking size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Takeaway</p>
                                            <p className="text-[10px] font-bold text-slate-500">{pkg.takeaway ? 'Fast Service' : 'Not Available'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-6 rounded-3xl border transition-all ${pkg.homeDelivery ? 'bg-yellow-50 border-yellow-100' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${pkg.homeDelivery ? 'bg-yellow-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                            <FaBicycle size={20} />
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Delivery</p>
                                            <p className="text-[10px] font-bold text-slate-500">{pkg.homeDelivery ? 'Express Home' : 'Not Available'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Partners Info */}
                        {pkg.partners && pkg.partners.length > 0 && (
                            <div data-aos="fade-up" className="space-y-6">
                                <h2 className="text-3xl font-black text-slate-900 Mont flex items-center gap-4">
                                    <span className="w-12 h-1 bg-yellow-500 rounded-full" />
                                    Official Partners
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {pkg.partners.map((partner: any, index: number) => (
                                        <div key={index} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all">
                                            <div className="flex items-center gap-4 mb-4">
                                                {partner.logo ? (
                                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                                                        <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                                        <span className="text-slate-400 text-xs font-black uppercase tracking-tighter">No Logo</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                                                        {partner.name}
                                                        {partner.isVerified && <HiBadgeCheck className="text-blue-500 text-xl" title="Verified Partner" />}
                                                    </h3>
                                                    {(partner.location || partner.state) && (
                                                        <p className="text-sm text-slate-500 flex items-start gap-1 mt-1">
                                                            <HiLocationMarker className="text-yellow-500 mt-0.5 shrink-0" />
                                                            <span className="font-bold">
                                                                {partner.location}{partner.location && partner.state ? ', ' : ''}{partner.state}
                                                            </span>
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {(partner.phone || partner.website) && (
                                                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                                                    {partner.phone && (
                                                        <a href={`tel:${partner.phone}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-yellow-600 transition-colors font-bold">
                                                            <HiPhone className="text-slate-400" />
                                                            <span>{partner.phone}</span>
                                                        </a>
                                                    )}
                                                    {partner.website && (
                                                        <a href={ensureProtocol(partner.website)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline transition-colors font-bold">
                                                            <HiGlobeAlt className="text-slate-400" />
                                                            <span>Visit Website</span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Full Menu Section */}
                        <div data-aos="fade-up" id="menu" className="bg-slate-900 rounded-[50px] overflow-hidden shadow-2xl relative">
                            {/* Menu Header */}
                            <div className="p-12 pb-0 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                                    <div className="space-y-4">
                                        <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em]">Signature Flavors</span>
                                        <h2 className="text-5xl md:text-6xl font-black text-white Mont tracking-tight">Full Menu</h2>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Cuisine Type</p>
                                            <p className="text-white font-bold text-sm">{cuisineDisplay}</p>
                                        </div>
                                        <div className="w-px h-8 bg-white/20" />
                                        <FaLayerGroup className="text-yellow-500 text-xl" />
                                    </div>
                                </div>
                            </div>

                            {/* Menu Body */}
                            <div className="p-8 md:p-12 pt-0 space-y-12">
                                {pkg.fullMenu && pkg.fullMenu.length > 0 ? (
                                    pkg.fullMenu.map((cat, idx) => (
                                        <div key={idx} className="space-y-8">
                                            <div className="flex items-center gap-6">
                                                <h3 className="text-2xl font-black text-yellow-500 Mont uppercase tracking-widest shrink-0">{cat.category}</h3>
                                                <div className="h-px w-full bg-white/10" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                                {cat.items.map((item, iIdx) => (
                                                    <div key={iIdx} className="group flex items-center justify-between py-2 border-b border-white/5 hover:border-yellow-500/30 transition-all">
                                                        <div className="space-y-1">
                                                            <p className="text-white font-bold group-hover:text-yellow-500 transition-colors">{item.name}</p>
                                                        </div>
                                                        <div className="text-right flex items-center gap-4">
                                                            <div className="w-12 h-px bg-white/20 hidden group-hover:block transition-all" />
                                                            <p className="text-yellow-500 font-black Mont">₹{item.price}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
                                        <p className="text-white/40 font-bold uppercase tracking-[0.2em]">No menu items added yet</p>
                                    </div>
                                )}
                            </div>

                            {/* Menu Background Accents */}
                            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Action Card */}
                        <div className="sticky top-32 space-y-8">
                            <div data-aos="fade-left" className="bg-white rounded-[40px] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                                            Hygiene {pkg.hygieneRating}/5
                                        </div>
                                        <SaveButton
                                            itemId={pkg.id || pkg._id}
                                            itemType="food"
                                            title={pkg.title}
                                            itemLink={`/travoxa-discovery/food-and-cafes/${pkg.id || pkg._id}`}
                                            isSmall={false}
                                            activeColor="bg-yellow-500"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pkg.title + ' ' + pkg.city)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-yellow-600 transition-all shadow-xl active:scale-95"
                                        >
                                            <FaDirections className="text-lg" /> Get Directions
                                        </a>
                                        <a
                                            href={`https://wa.me/${pkg.whatsappNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-100 transition-all border border-emerald-100 active:scale-95"
                                        >
                                            <FaWhatsapp className="text-emerald-500 text-lg" /> WhatsApp
                                        </a>
                                    </div>

                                    <div className="h-px w-full bg-slate-100" />

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <FaClock />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Timings</p>
                                                <p className="text-xs font-black text-slate-700">{pkg.openingTime} - {pkg.closingTime}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                                <FaStar className="text-yellow-500" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Best Visited</p>
                                                <p className="text-xs font-black text-slate-700">{pkg.bestTimeToVisit}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div data-aos="fade-left" data-aos-delay="100" className="bg-white rounded-[40px] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 space-y-6">
                                <h3 className="text-xl font-black text-slate-900 Mont uppercase tracking-wider">Connect</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500">
                                            <FaUser />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Host / Contact</p>
                                            <p className="text-sm font-black text-slate-700">{pkg.contactPerson || 'The Manager'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50">
                                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
                                            <FaPhoneAlt />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Phone</p>
                                            <p className="text-sm font-black text-slate-700">{pkg.phoneNumber}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location Card */}
                            <div data-aos="fade-left" data-aos-delay="200" className="bg-slate-900 rounded-[40px] p-8 shadow-2xl shadow-slate-900/40 space-y-6">
                                <h3 className="text-xl font-black text-white Mont uppercase tracking-wider">Location</h3>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <FaMapMarkerAlt className="text-yellow-500 text-xl shrink-0 mt-1" />
                                        <p className="text-white/70 text-sm font-medium leading-relaxed Inter">
                                            {pkg.address || pkg.location || `${pkg.city}, ${pkg.state}`}
                                        </p>
                                    </div>
                                    {pkg.attractionName && (
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Distance Highlight</p>
                                            <p className="text-white font-bold text-xs uppercase">
                                                <span className="text-yellow-500">{pkg.distFromAttraction}</span> from {pkg.attractionName}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-16">
                <RelatedPackages
                    tours={(pkg as any).relatedTours}
                    sightseeing={(pkg as any).relatedSightseeing}
                    activities={(pkg as any).relatedActivities}
                    rentals={(pkg as any).relatedRentals}
                    stays={(pkg as any).relatedStays}
                    food={(pkg as any).relatedFood}
                    attractions={(pkg as any).relatedAttractions}
                />
            </div>

            <Footor />
        </main>
    );
}
