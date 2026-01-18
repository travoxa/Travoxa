"use client";

import React from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import Link from 'next/link';
import { FaLocationDot, FaUsers, FaSliders, FaCamera } from 'react-icons/fa6';
import Image from 'next/image';

const LocalConnectPage = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Header forceWhite={true} />

            {/* HERO SECTION - Updated to use Emerald Theme */}
            <div className="pt-40 pb-20 text-center px-4">
                <div className="inline-block bg-orange-50 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 border border-orange-100 Mont">
                    Authentic Travel Redefined
                </div>
                <h1 className="text-4xl lg:text-7xl font-black text-slate-900 leading-tight mb-6 Mont tracking-tight">
                    Explore Cities Through<br />
                    <span className="text-emerald-500 italic font-medium font-serif">Locals, Not Tourists</span>
                </h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-10 Inter leading-relaxed">
                    Stop following guidebooks. Connect with storytellers, foodies, and experts who open doors to the real soul of their city.
                </p>
                <div className="flex justify-center gap-4">
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-emerald-500/30 transition-all Mont">
                        Explore Cities
                    </button>
                    <button className="bg-white border-2 border-slate-200 text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all Mont">
                        Become a Local Connector
                    </button>
                </div>
            </div>

            {/* CITIES GRID */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 Mont mb-2">Top Cities for Locals</h2>
                    <p className="text-slate-500 Inter text-sm">Verified experts ready to host you in these cultural hubs.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: "Goa", image: "/home/tourist-places5.jpg", locals: 12, exp: "Sucegaad, Sunsets", rating: 4.8 },
                        { name: "Jaipur", image: "/home/tourist-places9.jpg", locals: 18, exp: "Royal Tales & Pink Walls", rating: 4.9 },
                        { name: "Varanasi", image: "/home/tourist-places8.jpg", locals: 25, exp: "Spiritual Soul of India", rating: 4.9 },
                        { name: "Kolkata", image: "/home/tourist-places10.jpg", locals: 21, exp: "Culture, Coffee & Chaos", rating: 4.7 },
                        { name: "Udaipur", image: "/home/tourist-places2.jpg", locals: 32, exp: "Lakeside Serenity", rating: 4.8 },
                        { name: "Mumbai", image: "/home/tourist-places7.jpg", locals: 45, exp: "The Maximum City", rating: 4.6 },
                    ].map((city, i) => (
                        <div key={i} className="relative h-80 rounded-[32px] overflow-hidden group cursor-pointer">
                            <Image
                                src={city.image}
                                alt={city.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                                <div className="mb-auto flex justify-between items-start">
                                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 Inter">
                                        ★ {city.rating}
                                    </span>
                                    <span className="text-[9px] text-white/80 font-bold uppercase tracking-widest Inter">06 EXPERIENCES</span>
                                </div>

                                <h3 className="text-4xl font-bold text-white mb-1 Mont">{city.name}</h3>
                                <p className="text-slate-300 text-sm font-medium mb-6 Inter">{city.exp}</p>

                                <div className="flex items-center justify-between border-t border-white/20 pt-4">
                                    <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider Inter">
                                        {city.locals} Verified Locals
                                    </span>
                                    <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors">
                                        →
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* HOW IT WORKS */}
            <div className="py-24 bg-white mb-24">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-black text-slate-900 mb-20 Mont">How Local Connects Works</h2>
                    <div className="grid md:grid-cols-4 gap-12">
                        {[
                            { icon: <FaLocationDot />, title: "Choose City", text: "Pick your destination and explore local talent." },
                            { icon: <FaUsers />, title: "Select Local", text: "Browse verified profiles and read real reviews." },
                            { icon: <FaSliders />, title: "Customize", text: "Set the pace and focus of your city experience." },
                            { icon: <FaCamera />, title: "Travel Like a Local", text: "Experience the city through expert eyes." }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-3xl text-emerald-500 mb-8 border border-slate-100 custom-shadow hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h4 className="font-bold text-xl mb-3 Mont">{item.title}</h4>
                                <p className="text-slate-500 text-sm Inter leading-relaxed max-w-xs">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* PROMO BANNER */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-32">
                <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative min-h-[600px] flex items-center">
                    <div className="absolute right-0 top-0 w-full md:w-1/2 h-full">
                        <Image
                            src="https://images.unsplash.com/photo-1526772662000-3f88f107f598?auto=format&fit=crop&q=80&w=1200"
                            alt="Group of friends"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-12 lg:p-24 md:w-1/2">
                        <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 Mont">
                            Join the Community
                        </span>
                        <h2 className="text-4xl lg:text-6xl font-black text-white leading-none mb-2 Mont">
                            Your City. Your Stories.
                        </h2>
                        <h2 className="text-4xl lg:text-6xl font-black text-emerald-500 leading-none mb-8 Mont">
                            Your Income.
                        </h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed Inter max-w-md">
                            Turn your city knowledge into an experience. Become a verified Travoxa Local and connect with global travelers.
                        </p>

                        <div className="space-y-4 mb-10">
                            {['Earn ₹30,000 - ₹80,000 monthly', 'Set your own schedule & pricing', 'Travoxa provides the travelers, you provide the stories'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px]">✓</div>
                                    <span className="text-white font-bold text-xs Inter">{item}</span>
                                </div>
                            ))}
                        </div>

                        <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors Mont">
                            Join as a Local
                        </button>
                    </div>

                    {/* Stats Badge */}
                    <div className="absolute bottom-12 right-12 z-20 bg-emerald-500 p-6 rounded-3xl text-center shadow-2xl text-white md:block hidden">
                        <div className="text-4xl font-black mb-1 Mont">500+</div>
                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-80 Inter">Locals in India</div>
                    </div>
                </div>
            </div>

            <Footor />
        </div>
    );
};

export default LocalConnectPage;
