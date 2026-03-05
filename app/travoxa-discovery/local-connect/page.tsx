"use client";

import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import { FaUserPlus, FaMapPin, FaStar } from 'react-icons/fa6';

const LocalConnectComingSoon = () => {
    return (
        <div className="bg-white min-h-screen font-sans selection:bg-emerald-50">
            <Header forceWhite={true} />

            <div className="relative pt-40 pb-20 text-center px-4 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://res.cloudinary.com/dta29uych/image/upload/v1771256402/lucid-origin_A_wide_high-quality_flat_vector_illustration_suitable_for_a_website_hero_backgro-0_2_t8kneu.jpg"
                        alt="Local Connect Background"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white"></div>
                </div>

                <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto">
                    <div className="inline-block bg-emerald-50 text-emerald-600 text-[10px] font-medium px-4 py-1.5 rounded-full uppercase tracking-widest mb-8 border border-emerald-100 Mont">
                        Phase 2 - Coming Soon
                    </div>

                    <h1 className="text-3xl lg:text-5xl font-light text-slate-900 leading-tight mb-8 Mont tracking-tight">
                        Explore Like a <br />
                        <span className="text-emerald-600 italic font-medium font-serif">Local, Not a Tourist</span>
                    </h1>

                    <p className="text-slate-600 text-lg lg:text-xl mb-12 Inter leading-relaxed font-light max-w-2xl">
                        Connecting you with certified local experts who open doors to the authentic soul of their city. From hidden street food to secret viewpoints, experience the real thing.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 w-full mb-16 max-w-3xl">
                        {[
                            { icon: <FaMapPin />, title: "Offbeat Spots", desc: "No more tourist traps." },
                            { icon: <FaUserPlus />, title: "Verified Hubs", desc: "Safety-first local experts." },
                            { icon: <FaStar />, title: "Real Stories", desc: "History from the locals." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/80 backdrop-blur-sm p-8 rounded-[2rem] border border-slate-50 shadow-sm flex flex-col items-center">
                                <div className="text-emerald-500 text-xl mb-4">{item.icon}</div>
                                <h4 className="font-medium text-slate-900 mb-2 Mont text-sm">{item.title}</h4>
                                <p className="text-slate-500 text-[10px] Inter font-light">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-900 text-white px-8 py-3 rounded-xl font-medium Mont text-xs tracking-widest shadow-lg cursor-not-allowed opacity-80 uppercase">
                        Stay Tuned for Launch
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default LocalConnectComingSoon;
