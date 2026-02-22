'use client';

import React, { useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import Image from 'next/image';
import {
    FaMapMarkerAlt, FaStar, FaRegClock, FaBolt, FaCheck, FaTimes,
    FaShieldAlt, FaCamera, FaUsers, FaChild, FaNotesMedical,
    FaCalendarAlt, FaParking, FaInfoCircle
} from 'react-icons/fa';
import { ActivityPackage } from './ActivitiesClient';
import AOS from 'aos';
import 'aos/dist/aos.css';
import SaveButton from '@/components/ui/SaveButton';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

interface ActivityDetailsClientProps {
    activity: ActivityPackage;
}

const ActivityDetailsClient: React.FC<ActivityDetailsClientProps> = ({ activity }) => {
    const router = useRouter();

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    const locationText = activity.location?.name
        ? `${activity.location.name}, ${activity.city}, ${activity.state}`
        : `${activity.city}, ${activity.state}`;

    return (
        <div className="bg-white min-h-screen font-sans">
            <Header forceWhite={true} />

            {/* HERO SECTION */}
            <div className="relative h-[60vh] md:h-[70vh] w-full bg-slate-900">
                {activity.image ? (
                    <Image
                        src={activity.image}
                        alt={activity.title}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">No Image Available</div>
                )}



                <div className="absolute top-24 left-4 md:left-8 z-20 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/90 hover:text-white transition-all bg-black/30 backdrop-blur-xl px-5 py-2.5 rounded-full text-sm font-bold border border-white/10 hover:border-white/30"
                    >
                        <FaArrowLeft /> BACK
                    </button>
                    <SaveButton itemId={activity._id} itemType="activity" />
                </div>

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pt-32 pb-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl" data-aos="fade-up">
                            {/* Badges */}
                            <div className="flex flex-wrap gap-3 mb-4">
                                <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                    <FaBolt size={10} /> {activity.difficultyLevel || activity.level || 'Moderate'}
                                </span>
                                <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {activity.type || activity.category}
                                </span>
                                {activity.rating && (
                                    <span className="bg-white text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                        <FaStar className="text-orange-400" /> {activity.rating} ({activity.reviews || 0} Reviews)
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight Mont">
                                {activity.title}
                            </h1>

                            <div className="flex items-center gap-6 text-white text-sm md:text-base Inter">
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-orange-400" />
                                    <span>{locationText}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaRegClock className="text-orange-400" />
                                    <span>{activity.duration}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* LEFT COLUMN (Details) */}
                    <div className="lg:w-2/3 space-y-12">

                        {/* Key Info Grid */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 border border-slate-100" data-aos="fade-up">
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Duration</p>
                                <p className="text-slate-900 font-bold text-lg flex items-center gap-2">
                                    <FaRegClock className="text-orange-500" />
                                    {activity.duration}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Group Size</p>
                                <p className="text-slate-900 font-bold text-lg flex items-center gap-2">
                                    <FaUsers className="text-blue-500" />
                                    {activity.groupSize ? `${activity.groupSize.min}-${activity.groupSize.max}` : 'Standard'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Age Limit</p>
                                <p className="text-slate-900 font-bold text-lg flex items-center gap-2">
                                    <FaChild className="text-green-500" />
                                    {activity.ageLimit ? `${activity.ageLimit.min}+ Years` : 'All Ages'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Best Season</p>
                                <p className="text-slate-900 font-bold text-lg flex items-center gap-2">
                                    <FaCalendarAlt className="text-purple-500" />
                                    {activity.bestMonths ? `${activity.bestMonths.start} - ${activity.bestMonths.end}` : 'Year Round'}
                                </p>
                            </div>
                        </div>

                        {/* Overview */}
                        <div data-aos="fade-up">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 Mont">Overview</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line Inter text-lg">
                                {activity.overview}
                            </p>
                        </div>

                        {/* Highlights */}
                        <div data-aos="fade-up">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 Mont">Highlights</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {activity.highlights?.map((highlight, idx) => (
                                    <div key={idx} className="flex items-start gap-3 bg-orange-50 md:bg-transparent p-3 md:p-0 rounded-lg">
                                        <div className="bg-orange-100 p-2 rounded-full shrink-0">
                                            <FaCheck className="text-orange-600 text-xs" />
                                        </div>
                                        <span className="text-slate-700 font-medium pt-1">{highlight}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inclusions & Exclusions */}
                        <div className="grid md:grid-cols-2 gap-8" data-aos="fade-up">
                            {/* Inclusions */}
                            {activity.inclusions && activity.inclusions.length > 0 && (
                                <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100">
                                    <h3 className="text-lg font-bold text-green-800 mb-4">What's Included</h3>
                                    <ul className="space-y-3">
                                        {activity.inclusions.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <FaCheck className="text-green-600 mt-1 shrink-0" />
                                                <span className="text-slate-700 text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Exclusions */}
                            {activity.exclusions && activity.exclusions.length > 0 && (
                                <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
                                    <h3 className="text-lg font-bold text-red-800 mb-4">What's Excluded</h3>
                                    <ul className="space-y-3">
                                        {activity.exclusions.map((item, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <FaTimes className="text-red-500 mt-1 shrink-0" />
                                                <span className="text-slate-700 text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Safety & Policies */}
                        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200" data-aos="fade-up">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 Mont">Safety & Policies</h2>
                            <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                                <div className="flex items-start gap-3">
                                    <FaShieldAlt className="text-blue-500 text-xl mt-1" />
                                    <div>
                                        <p className="font-bold text-slate-900">Safety Level</p>
                                        <p className="text-sm text-slate-600">{activity.safetyLevel || 'Standard Safety Measures'}</p>
                                    </div>
                                </div>
                                {activity.photographyAllowed !== undefined && (
                                    <div className="flex items-start gap-3">
                                        <FaCamera className="text-slate-500 text-xl mt-1" />
                                        <div>
                                            <p className="font-bold text-slate-900">Photography</p>
                                            <p className="text-sm text-slate-600">{activity.photographyAllowed ? 'Allowed' : 'Not Allowed'}</p>
                                        </div>
                                    </div>
                                )}
                                {activity.parkingAvailable && (
                                    <div className="flex items-start gap-3">
                                        <FaParking className="text-slate-500 text-xl mt-1" />
                                        <div>
                                            <p className="font-bold text-slate-900">Parking</p>
                                            <p className="text-sm text-slate-600">Available at site</p>
                                        </div>
                                    </div>
                                )}
                                {activity.medicalRestrictions && activity.medicalRestrictions.exists && (
                                    <div className="flex items-start gap-3">
                                        <FaNotesMedical className="text-red-500 text-xl mt-1" />
                                        <div>
                                            <p className="font-bold text-slate-900 text-red-600">Medical Advisory</p>
                                            <p className="text-sm text-slate-600">{activity.medicalRestrictions.details || 'Check medical requirements'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Location Map */}
                        {activity.location?.mapLink && (
                            <div data-aos="fade-up">
                                <h2 className="text-2xl font-bold text-slate-900 mb-4 Mont">Location</h2>
                                <p className="text-slate-600 mb-4">{locationText}</p>
                                <div className="bg-slate-100 rounded-xl overflow-hidden h-64 flex items-center justify-center border border-slate-200">
                                    <a href={activity.location.mapLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors">
                                        <FaMapMarkerAlt size={32} />
                                        <span className="font-bold">Open in Google Maps</span>
                                    </a>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* RIGHT COLUMN (Sticky Booking Card) */}
                    <div className="lg:w-1/3 space-y-8">
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-6 sticky top-24">
                            <div className="mb-6">
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Starting From</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-slate-900">₹{activity.price.toLocaleString()}</span>
                                    <span className="text-slate-500 text-sm">/ person</span>
                                </div>
                            </div>

                            <button className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl mb-4 hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20">
                                Book Now
                            </button>

                            <button className="w-full bg-white text-slate-900 border border-slate-200 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all">
                                Send Inquiry
                            </button>

                            {/* Trust Signals */}
                            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                                <div className="flex items-center gap-3">
                                    <FaShieldAlt className="text-green-500 text-lg" />
                                    <span className="text-sm text-slate-600 font-medium">Secure Booking</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaCheck className="text-blue-500 text-lg" />
                                    <span className="text-sm text-slate-600 font-medium">Instant Confirmation</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaInfoCircle className="text-slate-400 text-lg" />
                                    <span className="text-sm text-slate-600 font-medium">Free Cancellation (24h)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footor />
        </div>
    );
};

export default ActivityDetailsClient;
