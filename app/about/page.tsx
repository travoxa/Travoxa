"use client";

import { useEffect } from "react";
import Link from 'next/link';
import Footor from "@/components/ui/Footor";
import Header from "@/components/ui/Header";
import { LuSparkles, LuMap, LuShieldCheck, LuUser } from "react-icons/lu";
import { FaHiking, FaMapMarkedAlt, FaHandsHelping, FaHome, FaLeaf, FaCamera, FaCampground } from 'react-icons/fa';
import { GiBackpack } from 'react-icons/gi';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutPage() {

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <Header />

            <main className="flex-grow pt-[140px] px-6 lg:px-24 max-w-[1600px] mx-auto w-full mb-20 space-y-32">

                {/* 1. HERO SECTION: Merged with Why We Started - 'About Us' Layout */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:items-end justify-between" data-aos="fade-down">
                    {/* Left: About Us */}
                    <div className="space-y-0 relative">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-600 font-medium text-xs tracking-wide mb-6 uppercase">
                            Next-Gen Travel
                        </div>
                        <h1 className="text-[5rem] sm:text-[7rem] lg:text-[9rem] font-bold text-black leading-[0.85] tracking-tighter Mont uppercase">
                            About
                        </h1>
                        <h1 className="text-[5rem] sm:text-[7rem] lg:text-[9rem] font-bold text-black leading-[0.85] tracking-tighter Mont uppercase">
                            Us
                        </h1>
                    </div>

                    {/* Right: Why We Started Content - Aligned horizontal with 'Us' */}
                    <div className="space-y-8 lg:pb-4" data-aos="fade-left" data-aos-delay="200">
                        <h2 className="text-4xl font-extralight text-black Mont">Why we started</h2>
                        <p className="text-xl text-zinc-600 font-light leading-relaxed">
                            Traditional travel platforms focus on bookings, but forget the <strong className="font-medium text-black">journey</strong>. We saw travelers overwhelmed by endless tabs, confusing reviews, and safety concerns. Travoxa exists to bridge the gap between inspiration and execution using intelligent data.
                        </p>
                    </div>
                </section>

                {/* 3. INTELLIGENCE (AI ECOSYSTEM) */}
                <section className="space-y-12">
                    <div className="text-center space-y-4" data-aos="fade-up">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-orange-50 text-orange-500 font-medium text-xs tracking-wide uppercase">
                            Intelligence
                        </span>
                        <h2 className="text-4xl font-extralight text-black Mont">The AI Ecosystem</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "AI Trip Planning", desc: "Custom itineraries generated in seconds based on your specific vibe." },
                            { title: "Budget Optimization", desc: "Smart spending tracking and cost-saving alerts while you roam." },
                            { title: "Smart Route Suggestions", desc: "Real-time traffic and terrain analysis for the smoothest travel." },
                            { title: "Safety Intelligence", desc: "24/7 monitoring of local conditions to keep you protected." }
                        ].map((item, i) => (
                            <div key={i} className="p-8 bg-zinc-50 rounded-[12px] space-y-4 hover:shadow-lg transition-shadow" data-aos="zoom-in" data-aos-delay={i * 100}>
                                <h3 className="text-xl font-light text-black">{item.title}</h3>
                                <p className="text-zinc-600 font-light text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. TRAVOXA DISCOVERY */}
                <section className="text-center" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-extralight text-black mb-6 Mont">Travoxa Discovery</h2>
                    <p className="text-center text-zinc-500 mb-12 max-w-2xl mx-auto font-light text-lg">Pick only what you need. We’ll handle the rest.</p>

                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* First Row: 5 items */}
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xl md:text-2xl font-light text-zinc-400" data-aos="fade-up" data-aos-delay="200">
                            {[
                                "Sightseeing",
                                "Rentals",
                                "Local Connect",
                                "Activities",
                                "Attractions"
                            ].map((label, i) => (
                                <span key={i} className="hover:text-black transition-colors cursor-pointer duration-300 transform hover:scale-105">
                                    {label}
                                </span>
                            ))}
                        </div>

                        {/* Second Row: 4 items */}
                        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xl md:text-2xl font-light text-zinc-400" data-aos="fade-up" data-aos-delay="400">
                            {[
                                "Food & Cafes",
                                "Emergency",
                                "Volunteer",
                                "Influencers"
                            ].map((label, i) => (
                                <span key={i} className="hover:text-black transition-colors cursor-pointer duration-300 transform hover:scale-105">
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. EXCLUSIVE FEATURES */}
                <section className="space-y-16 bg-zinc-50/50 p-12 rounded-[36px]" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-extralight text-black text-center Mont">Exclusive Features</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                title: "Mystery Trip",
                                desc: "Embrace the unknown. Input your budget and let our AI surprise you with a destination that matches your profile perfectly.",
                                icon: <LuSparkles className="w-8 h-8" />
                            },
                            {
                                title: "Khazana Map",
                                desc: "Find hidden gems, secret viewpoints, and local legends that aren't on standard maps. Our community-driven treasure map.",
                                icon: <LuMap className="w-8 h-8" />
                            },
                            {
                                title: "Safety Score",
                                desc: "Travel with confidence. Get real-time safety ratings for neighborhoods, transit routes, and solo-traveler friendliness.",
                                icon: <LuShieldCheck className="w-8 h-8" />
                            },
                            {
                                title: "Local Legends",
                                desc: "Connect with verified local experts who can guide you to authentic experiences and cultural deep-dives.",
                                icon: <LuUser className="w-8 h-8" />
                            }
                        ].map((feat, i) => (
                            <div key={i} className="bg-white p-10 rounded-[12px] shadow-sm hover:shadow-md transition-shadow group" data-aos="fade-up" data-aos-delay={i * 100}>
                                <div className="w-16 h-16 bg-lime-100 rounded-[12px] flex items-center justify-center text-lime-600 mb-6 group-hover:bg-lime-200 transition-colors">
                                    {feat.icon}
                                </div>
                                <h3 className="text-2xl font-medium text-black mb-3">{feat.title}</h3>
                                <p className="text-zinc-600 font-light leading-relaxed">
                                    {feat.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. VOLUNTEER SECTION - Yatra Style */}
                <section className="bg-emerald-50/50 rounded-[24px] relative overflow-hidden group py-24 px-8 md:px-12 text-center" data-aos="zoom-in">
                    {/* Background Icons */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-700 scale-100">
                        <GiBackpack className="absolute top-[10%] left-[5%] text-slate-300 text-7xl transform -rotate-12" />
                        <FaMapMarkedAlt className="absolute top-[15%] right-[10%] text-slate-300 text-8xl transform rotate-12" />
                        <FaCampground className="absolute bottom-[20%] left-[15%] text-slate-300 text-6xl transform -rotate-6" />
                        <FaHandsHelping className="absolute top-[30%] right-[25%] text-slate-300 text-7xl transform rotate-6" />
                        <FaHome className="absolute bottom-[10%] right-[5%] text-slate-300 text-8xl transform -rotate-12" />
                        <FaLeaf className="absolute top-[50%] left-[8%] text-slate-300 text-6xl transform rotate-12" />
                        <FaHiking className="absolute top-[10%] left-[40%] text-slate-300 text-9xl transform -rotate-45 opacity-50" />
                        <FaCamera className="absolute bottom-[30%] right-[35%] text-slate-300 text-7xl transform rotate-12" />
                    </div>

                    <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-5xl font-extralight text-black Mont" data-aos="fade-up">Volunteer <span className="text-emerald-600 font-medium">Yatra</span></h2>
                        <p className="text-lg text-zinc-600 font-light max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
                            Give back while you explore. Our skill-based volunteering program connects you with local communities across India. Exchange your skills (teaching, design, farming) for food and stay.
                        </p>
                        <div className="flex gap-4 justify-center pt-4" data-aos="fade-up" data-aos-delay="400">
                            <Link href="/travoxa-yatra" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-emerald-600/90 hover:scale-105 transition-all duration-300 Mont flex items-center gap-2 group/btn shadow-lg shadow-emerald-600/20">
                                Explore Opportunities
                                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 7. COLLABORATIONS */}
                <section>
                    <h2 className="text-3xl md:text-4xl font-extralight text-black mb-12 text-center Mont" data-aos="fade-up">Collaborations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["Creators", "YouTubers", "Local Brands", "Hotels & Cafes"].map((collab, i) => (
                            <div key={i} className="p-8 text-center font-light text-xl text-zinc-600 hover:text-black transition-colors cursor-default border border-transparent hover:border-zinc-200 rounded-[12px]" data-aos="fade-up" data-aos-delay={i * 100}>
                                {collab}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 8. BUSINESS PARTNERS */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8" data-aos="fade-right">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-4 block">Business Partners</span>
                            <h2 className="text-4xl font-light text-slate-900 mb-6 Mont">Businesses, Grow with Creators</h2>
                            <p className="text-lg text-zinc-600 leading-relaxed font-light">
                                We partner with Hotels, Homestays, Cafés, Tour Agencies, and Local Travel Brands. Connect with professional storytellers to showcase your property or service to thousands of real travelers.
                            </p>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Paid promotions for direct ROI",
                                "Barter deals (Stay/Food/Experience)",
                                "Hybrid collaborations for maximum impact"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center space-x-3 text-zinc-700 font-light">
                                    <span className="text-emerald-500 font-medium">✓</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid sm:grid-cols-1 gap-6 w-full" data-aos="fade-left">
                        {[
                            { title: "Promote Your Business", desc: "Reach real travelers through authentic influencer content and targeted travel audience strategy.", btn: "Partner with Travoxa", primary: true },
                            { title: "Host Creators", desc: "Offer stays, food, or packages to get organic social promotion and long-term brand exposure.", btn: "Partner with Travoxa", primary: false }
                        ].map((card, i) => (
                            <div key={i} className="bg-zinc-50 p-10 rounded-[12px] border border-zinc-100 hover:border-emerald-200 transition-colors group">
                                <h4 className="text-2xl font-light mb-4">{card.title}</h4>
                                <p className="text-zinc-600 mb-8 text-sm leading-relaxed font-light">{card.desc}</p>
                                <button className={`px-6 py-3 rounded-[12px] font-medium text-sm transition-all ${card.primary ? 'bg-slate-900 text-white group-hover:bg-emerald-600' : 'bg-white border-2 border-slate-900 text-slate-900 group-hover:bg-slate-900 group-hover:text-white'}`}>
                                    {card.btn}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 9. CTA */}
                <section className="text-center py-12" data-aos="zoom-in-up">
                    <h2 className="text-3xl md:text-5xl font-extralight text-black mb-8 leading-tight Mont">
                        Travoxa is not just a travel platform — it is a complete <strong className="font-semibold text-green-600">travel operating system</strong> for India.
                    </h2>
                    <a href="/travoxa-discovery" className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-zinc-800 transition-colors">
                        Explore with Travoxa
                    </a>
                </section>

            </main>
            <Footor />
        </div>
    );
}
