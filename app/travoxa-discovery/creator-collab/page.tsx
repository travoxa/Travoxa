"use client";

import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { FaYoutube, FaInstagram, FaFacebook, FaHandshake } from 'react-icons/fa6';

const CreatorCollabComingSoon = () => {
    return (
        <div className="bg-white min-h-screen font-sans selection:bg-blue-50">
            <Header forceWhite={true} />

            <div className="relative pt-40 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="inline-block bg-blue-50 text-blue-600 text-[10px] font-medium px-4 py-1.5 rounded-full uppercase tracking-widest mb-8 border border-blue-100 Mont">
                        Phase 2 - Coming Soon
                    </div>

                    <h1 className="text-3xl lg:text-5xl font-light text-slate-900 leading-tight mb-8 Mont tracking-tight">
                        TRAVOXA <br />
                        <span className="text-blue-500 italic font-medium">COLLAB</span>
                    </h1>

                    <p className="text-slate-600 text-lg lg:text-xl max-w-2xl mx-auto mb-16 Inter leading-relaxed font-light">
                        Bridging the world's most creative storytellers with India's best travel brands. Exceptional content meets premium business opportunities.
                    </p>

                    <div className="flex justify-center gap-6 mb-20">
                        {[<FaYoutube />, <FaInstagram />, <FaFacebook />].map((icon, i) => (
                            <div key={i} className="text-2xl text-slate-200 hover:text-blue-500 transition-colors">
                                {icon}
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50/50 p-12 rounded-[3rem] border border-slate-50 max-w-4xl mx-auto flex flex-col items-center">
                        <div className="w-14 h-14 bg-white rounded-[20px] flex items-center justify-center text-blue-500 text-2xl mb-8 shadow-sm">
                            <FaHandshake />
                        </div>
                        <h3 className="text-2xl font-light text-slate-900 mb-6 Mont">Empowering Creators & Businesses</h3>
                        <p className="text-slate-500 Inter text-sm leading-relaxed max-w-xl mb-10 font-light">
                            Whether you're an influencer looking for free stays or a business seeking authentic promotion, Travoxa Collab is the ecosystem where travel dreams become professional reality.
                        </p>
                        <div className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium Mont text-xs tracking-widest shadow-lg opacity-80 cursor-not-allowed uppercase">
                            Launching in Phase 2
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CreatorCollabComingSoon;
