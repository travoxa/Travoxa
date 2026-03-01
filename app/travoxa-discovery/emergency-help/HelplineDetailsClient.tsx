'use client';

import React from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import { FaPhone, FaMapMarkerAlt, FaClock, FaCheckCircle, FaGlobe, FaShieldAlt, FaHospital, FaInfoCircle, FaCalendarAlt } from 'react-icons/fa';
import Link from 'next/link';

interface HelplineDetailsClientProps {
    helpline: any;
}

const HelplineDetailsClient: React.FC<HelplineDetailsClientProps> = ({ helpline }) => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Header forceWhite={true} />

            <div className="pt-32 pb-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-8 Inter">
                        <Link href="/travoxa-discovery" className="hover:text-slate-600 transition-colors">Discovery</Link>
                        <span>/</span>
                        <Link href="/travoxa-discovery/emergency-help" className="hover:text-slate-600 transition-colors">Emergency & Help</Link>
                        <span>/</span>
                        <span className="text-slate-900 font-medium">{helpline.serviceName}</span>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            <div>
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${helpline.emergencyType === 'Hospital' ? 'bg-red-50 text-red-500' :
                                            helpline.emergencyType === 'Police' ? 'bg-blue-50 text-blue-500' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                        {helpline.emergencyType}
                                    </span>
                                    {helpline.isVerified && (
                                        <span className="bg-emerald-50 text-emerald-600 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2 uppercase tracking-widest">
                                            <FaCheckCircle /> Verified by Travoxa
                                        </span>
                                    )}
                                    <span className="bg-slate-100 text-slate-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                        {helpline.ownershipType}
                                    </span>
                                </div>

                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 Mont mb-6 leading-tight">
                                    {helpline.serviceName}
                                </h1>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-slate-500 Inter text-lg">
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-rose-500" />
                                        <span>{helpline.city}, {helpline.state}</span>
                                    </div>
                                    {helpline.is24x7 && (
                                        <div className="flex items-center gap-2">
                                            <FaClock className="text-emerald-500" />
                                            <span className="font-semibold text-emerald-600">Available 24x7</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 Mont mb-6 flex items-center gap-3">
                                    <FaInfoCircle className="text-rose-500" /> Service Information
                                </h3>

                                <div className="grid sm:grid-cols-2 gap-8 Inter">
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-400 font-medium">Full Address</p>
                                        <p className="text-slate-800 leading-relaxed font-medium">{helpline.fullAddress || 'N/A'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-400 font-medium">Response Type</p>
                                        <p className="text-slate-800 leading-relaxed font-medium">{helpline.responseType || 'Immediate Emergency Response'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-400 font-medium">Charges</p>
                                        <p className="text-slate-800 leading-relaxed font-medium">{helpline.charges || 'Free / Govt. Standard'}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-slate-400 font-medium">Language Support</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {helpline.languageSupport?.map((l: string) => (
                                                <span key={l} className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-bold text-slate-700">{l}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {helpline.notes && (
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 Mont mb-4">Important Notes</h3>
                                    <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl Inter text-amber-900 leading-relaxed">
                                        {helpline.notes}
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center gap-4 py-8 border-t border-slate-100 text-slate-400 Inter text-sm">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt />
                                    <span>Last Updated: {helpline.lastUpdated ? new Date(helpline.lastUpdated).toLocaleDateString() : 'Recently'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Sidebar Actions */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-32 space-y-6">
                                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100">
                                    <p className="text-slate-400 text-sm font-medium Inter mb-2">Emergency Contact</p>
                                    <div className="text-3xl font-black text-rose-500 Mont mb-8">{helpline.phone}</div>

                                    <div className="space-y-4">
                                        <a
                                            href={`tel:${helpline.phone}`}
                                            className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 Inter text-lg"
                                        >
                                            <FaPhone /> Call Now
                                        </a>

                                        {helpline.alternatePhone && (
                                            <a
                                                href={`tel:${helpline.alternatePhone}`}
                                                className="w-full bg-slate-50 text-slate-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-100 transition-all border border-slate-100 Inter"
                                            >
                                                Alternate: {helpline.alternatePhone}
                                            </a>
                                        )}

                                        {helpline.googleMapLink && (
                                            <a
                                                href={helpline.googleMapLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all Inter"
                                            >
                                                <FaMapMarkerAlt /> Google Maps
                                            </a>
                                        )}

                                        {helpline.website && (
                                            <a
                                                href={helpline.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full bg-white text-slate-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all border border-slate-100 Inter"
                                            >
                                                <FaGlobe /> Official Website
                                            </a>
                                        )}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                                        <p className="text-xs text-slate-400 Inter px-4">
                                            Disclaimer: Information is verified to the best of our knowledge. Always verify locally in critical situations.
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    href="/travoxa-discovery/emergency-help"
                                    className="block w-full text-center text-slate-500 font-bold hover:text-slate-800 transition-colors Inter"
                                >
                                    Back to Directory
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footor />
        </div>
    );
};

export default HelplineDetailsClient;
