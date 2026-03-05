"use client";

import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { FaHandsHoldingChild, FaMountainSun, FaHotel } from 'react-icons/fa6';

const VolunteerYatraComingSoon = () => {
    return (
        <div className="bg-white min-h-screen font-sans selection:bg-orange-50">
            <Header forceWhite={true} />

            <div className="relative pt-40 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-block bg-orange-50 text-orange-600 text-[10px] font-medium px-4 py-1.5 rounded-full uppercase tracking-widest mb-8 border border-orange-100 Mont">
                        Phase 2 - Coming Soon
                    </div>

                    <h1 className="text-3xl lg:text-5xl font-light text-slate-900 leading-tight mb-8 Mont tracking-tight">
                        TRAVOXA <br />
                        <span className="text-orange-500 italic font-medium">YATRA</span>
                    </h1>

                    <p className="text-slate-600 text-lg lg:text-xl max-w-2xl mx-auto mb-16 Inter leading-relaxed font-light">
                        Travel that makes an impact. Exchange your unique skills for free food and stay while helping local communities grow across organic farms, schools, and NGOs.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
                        {[
                            { icon: <FaMountainSun />, title: "Stay for Free", desc: "Eco-stays and mountain hostels." },
                            { icon: <FaHandsHoldingChild />, title: "Teach & Help", desc: "Empower local children & projects." },
                            { icon: <FaHotel />, title: "Community First", desc: "Build meaningful bonds." }
                        ].map((item, i) => (
                            <div key={i} className="bg-orange-50/20 p-8 rounded-[2rem] border border-orange-50 flex flex-col items-center">
                                <div className="text-orange-500 text-2xl mb-4">{item.icon}</div>
                                <h4 className="font-medium text-slate-900 mb-2 Mont text-sm">{item.title}</h4>
                                <p className="text-slate-500 text-[10px] Inter font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium Mont text-xs tracking-widest shadow-lg opacity-80 cursor-not-allowed uppercase">
                        Coming Soon to Phase 2
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default VolunteerYatraComingSoon;
