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
                </div>
            </div>

            {/* PROMO BANNER */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="relative bg-slate-900 rounded-[3rem] overflow-hidden min-h-[650px] flex items-center justify-center text-center">

                    {/* Background Image */}
                    <Image
                        src="https://images.unsplash.com/photo-1526772662000-3f88f107f598?auto=format&fit=crop&q=80&w=1600"
                        alt="Group of friends"
                        fill
                        className="object-cover"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90"></div>

                    {/* Content */}
                    <div className="relative z-10 pt-10 max-w-3xl px-8">

                        <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                            Join the Community
                        </span>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
                            Your City. Your Stories.
                        </h2>

                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-500 leading-tight mb-8">
                            Your Income.
                        </h2>

                        <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                            Turn your city knowledge into an experience. Become a verified Travoxa Local and connect with global travelers.
                        </p>

                        {/* Benefits */}
                        <div className="space-y-4 mb-10">
                            {[
                                "Earn ₹30,000 - ₹80,000 monthly",
                                "Set your own schedule & pricing",
                                "Travoxa provides the travelers, you provide the stories",
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">
                                        ✓
                                    </div>
                                    <span className="text-white font-semibold text-sm">{item}</span>
                                </div>
                            ))}
                        </div>

                        <button className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                            Join as a Local
                        </button>
                        <div className="mt-5 flex pb-8 justify-center">
                            <div className="text-center">
                                <div className="text-4xl font-black text-white tracking-[0.3em] mb-2">
                                    500+
                                </div>
                                <div className="text-xs text-white tracking-[0.4em] font-bold uppercase">
                                    VERIFIED LOCAL ACROSS INDIA
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Stats Badge */}
                    {/* <div className="absolute bottom-10 right-10 bg-emerald-500 p-6 rounded-3xl text-center shadow-2xl text-white hidden md:block">
                        <div className="text-4xl font-black mb-1">500+</div>
                        <div className="text-xs uppercase font-bold tracking-wider opacity-80">
                            Locals in India
                        </div>
                    </div> */}


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
