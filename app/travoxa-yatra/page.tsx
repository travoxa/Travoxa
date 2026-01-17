"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TravoxaYatraPayload = () => {
    const [activeSkill, setActiveSkill] = useState('all');

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const filterOps = (skill: string) => {
        setActiveSkill(skill);
    };

    const opportunities = [
        {
            id: 1,
            title: "Eco-Farm Builder",
            location: "📍 Manali, Mountains",
            duration: "⏳ 2 Weeks",
            openings: "👥 4 Openings",
            image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&q=80&w=600",
            skills: ["construction", "farming"],
            perks: ["🎁 Free Stay", "🎁 Organic Meals"],
            type: "construction farming"
        },
        {
            id: 2,
            title: "Village English Teacher",
            location: "📍 Rishikesh, Valley",
            duration: "⏳ 4 Weeks",
            openings: "👥 2 Openings",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600",
            skills: ["teaching", "social"],
            perks: ["🎁 Cultural Immersion", "🎁 Weekend Treks"],
            type: "teaching social"
        },
        {
            id: 3,
            title: "Hostel Content Creator",
            location: "📍 Goa, Beach Side",
            duration: "⏳ 2-3 Weeks",
            openings: "👥 3 Openings",
            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=600",
            skills: ["content", "tech"],
            perks: ["🎁 Dorm Stay", "🎁 Surf Lessons"],
            type: "content tech"
        }
    ];

    return (
        <div className="bg-white font-sans relative">
            <Header forceWhite={true} />

            {/* Hero Section - Matching Global Design */}
            <div className="w-screen flex justify-center items-center px-[12px] py-[12px]">
                <div className="w-full h-[47vh] lg:h-[97vh] bg-center bg-cover bg-no-repeat rounded-[12px] relative overflow-hidden" style={{ backgroundImage: "url('/home/tourist-places6.jpg')" }}>
                    {/* Overlay for readability if needed, though global hero relies on text shadow/styles */}

                    {/* Content */}
                    <div className="w-full h-full flex flex-col justify-center items-center relative z-10">
                        <p className="text-center text-[10vw] lg:text-[12vw] font-bold text-white Mont tracking-wider text-shadow-blue-400 leading-none" data-aos="fade-down">
                            TRAVOXA <br /><span className="text-emerald-400">YATRA</span>
                        </p>

                        <p className="text-center text-xl lg:text-3xl text-white font-medium Mont tracking-wide mt-8 mb-12 drop-shadow-md" data-aos="fade-up" data-aos-delay="100">
                            Travel for Free by Volunteering.
                        </p>

                        <div className="flex flex-col justify-center items-center text-white gap-8" data-aos="fade-up" data-aos-delay="200">
                            <div className="flex flex-wrap justify-center gap-5">
                                <Link href="#opportunities" className="bg-white text-black font-medium Mont px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
                                    Find Opportunities
                                </Link>
                                <Link href="#opportunities" className="bg-white/20 border border-white/50 text-white font-medium Mont px-8 py-3 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 backdrop-blur-lg">
                                    Explore
                                </Link>
                                <Link href="#how-it-works" className="bg-white/20 border border-white/50 text-white font-medium Mont px-8 py-3 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 backdrop-blur-lg">
                                    How it Works
                                </Link>
                                <Link href="#why-choose" className="bg-white/20 border border-white/50 text-white font-medium Mont px-8 py-3 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 backdrop-blur-lg">
                                    Impact Stories
                                </Link>
                            </div>
                            <p className="text-center text-[16px] lg:text-[20px] w-[90vw] lg:w-[50vw] text-white font-medium Inter drop-shadow-md leading-relaxed" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
                                Exchange your skills for food, stay, and experiences. Connect with hosts across India.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Selection Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* For Volunteers Card */}
                        <div className="bg-white border border-slate-100 p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 text-3xl mb-8 relative z-10">
                                👥
                            </div>
                            <h3 className="text-3xl font-medium text-slate-900 mb-4 Mont relative z-10">For Volunteers</h3>
                            <p className="text-slate-500 text-lg mb-8 leading-relaxed Inter relative z-10">
                                Share your skills, travel responsibly, and learn while you help local communities flourish.
                            </p>
                            <Link href="#opportunities" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-medium hover:bg-emerald-600 transition-colors relative z-10">
                                Explore Volunteer Roles <span className="text-xl">→</span>
                            </Link>
                        </div>

                        {/* For Service Providers Card */}
                        <div className="bg-white border border-slate-100 p-10 rounded-[32px] shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 text-3xl mb-8 relative z-10">
                                🏠
                            </div>
                            <h3 className="text-3xl font-medium text-slate-900 mb-4 Mont relative z-10">For Service Providers</h3>
                            <p className="text-slate-500 text-lg mb-8 leading-relaxed Inter relative z-10">
                                NGOs, Hostels, Farms, or Schools—find passionate volunteers ready to support your mission.
                            </p>
                            <button className="inline-flex items-center gap-2 bg-white text-orange-600 border-2 border-orange-100 px-8 py-4 rounded-full font-medium hover:border-orange-200 hover:bg-orange-50 transition-colors relative z-10">
                                Post a Requirement <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple Process */}
            <section className="py-32 bg-white" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <h2 className="text-center text-4xl lg:text-6xl font-medium mb-20 Mont">How it works</h2>
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="p-10 bg-slate-50 rounded-[32px] hover:bg-slate-100 transition-colors">
                            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold mb-6 text-lg Mont">1</div>
                            <h4 className="font-medium text-2xl mb-4 Mont">Choose Role</h4>
                            <p className="text-slate-600 Inter leading-relaxed">Browse through hundreds of verified opportunities. Filter by skills, location, or cause.</p>
                        </div>
                        <div className="p-10 bg-slate-50 rounded-[32px] hover:bg-slate-100 transition-colors">
                            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold mb-6 text-lg Mont">2</div>
                            <h4 className="font-medium text-2xl mb-4 Mont">Match Skills</h4>
                            <p className="text-slate-600 Inter leading-relaxed">Apply to hosts that match your skills. Discuss details and confirm your stay.</p>
                        </div>
                        <div className="p-10 bg-slate-50 rounded-[32px] hover:bg-slate-100 transition-colors">
                            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold mb-6 text-lg Mont">3</div>
                            <h4 className="font-medium text-2xl mb-4 Mont">Connect</h4>
                            <p className="text-slate-600 Inter leading-relaxed">Pack your bags and start your journey. Make an impact while traveling for free.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Discovery Section */}
            <section className="py-24 bg-slate-50" id="opportunities">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl lg:text-5xl font-medium text-black mb-4 Mont">Trending Opportunities</h2>
                            <p className="text-slate-500 Inter">Curated volunteering experiences just for you.</p>
                        </div>
                        <div className="flex gap-2 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                            {['all', 'farming', 'teaching', 'content', 'social'].map((skill) => (
                                <button
                                    key={skill}
                                    onClick={() => filterOps(skill)}
                                    className={`px-6 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all border Inter ${activeSkill === skill
                                        ? 'bg-black text-white border-black'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                        }`}
                                >
                                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {opportunities.map((op) => (
                            <div
                                key={op.id}
                                className={`bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-slate-100 ${activeSkill === 'all' || op.type.includes(activeSkill) ? 'block' : 'hidden'
                                    }`}
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img src={op.image} alt={op.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold shadow-sm Inter">
                                        <span>{op.location}</span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h4 className="text-2xl font-medium mb-3 group-hover:text-emerald-600 transition-colors Mont">{op.title}</h4>
                                    <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6 Inter">
                                        <span>{op.duration}</span>
                                        <span>{op.openings}</span>
                                    </div>
                                    <div className="space-y-3 mb-8">
                                        <div className="flex flex-wrap gap-2">
                                            {op.perks.map((perk, index) => (
                                                <span key={index} className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-md uppercase tracking-wider Inter">{perk}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-black text-white rounded-full font-medium hover:bg-emerald-600 transition-colors Mont">Apply to Volunteer</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8" id="why-choose">
                <div className="max-w-7xl mx-auto bg-slate-900 rounded-[40px] p-12 lg:p-16 relative overflow-hidden">
                    {/* Decorational blobs */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                        <div className="lg:w-1/3 text-center lg:text-left">
                            <h2 className="text-3xl lg:text-5xl font-medium mb-6 text-white Mont">Why Choose Travoxa?</h2>
                            <p className="text-slate-400 text-lg Inter leading-relaxed">
                                We bridge the gap between passionate travelers and meaningless local projects.
                            </p>
                        </div>

                        <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
                            {/* Card 1 */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-300 group flex items-start gap-4">
                                <div className="text-3xl group-hover:scale-110 transition-transform">🌍</div>
                                <div>
                                    <h4 className="text-lg font-medium text-white mb-2 Mont">Real Impact</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed Inter">Skills supporting local communities.</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-300 group flex items-start gap-4">
                                <div className="text-3xl group-hover:scale-110 transition-transform">🛡️</div>
                                <div>
                                    <h4 className="text-lg font-medium text-white mb-2 Mont">Verified Hosts</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed Inter">Vetted for a safe experience.</p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-300 group flex items-start gap-4">
                                <div className="text-3xl group-hover:scale-110 transition-transform">📜</div>
                                <div>
                                    <h4 className="text-lg font-medium text-white mb-2 Mont">Global Recognition</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed Inter">Official certificates for your work.</p>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all duration-300 group flex items-start gap-4">
                                <div className="text-3xl group-hover:scale-110 transition-transform">🧭</div>
                                <div>
                                    <h4 className="text-lg font-medium text-white mb-2 Mont">Structured Value</h4>
                                    <p className="text-slate-400 text-sm leading-relaxed Inter">Balanced work and exploration.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            <Footor />
        </div>
    );
};

export default TravoxaYatraPayload;
