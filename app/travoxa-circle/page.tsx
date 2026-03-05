"use client";

import React from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { FaUsers, FaMapLocationDot, FaHandshakeAngle, FaShareNodes, FaEarthAmericas, FaCommentDots, FaIdCard, FaCompass } from 'react-icons/fa6';

const TravoxaCirclePage = () => {
    const phase3Features = [
        {
            title: "Global Travel Feed",
            icon: <FaEarthAmericas />,
            description: "A cinematic space to share your stories, photos, and high-quality travel videos with a global community.",
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            title: "Explorer Network",
            icon: <FaUsers />,
            description: "Connect with like-minded travelers, find trip partners, and follow your favorite travel creators.",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Real-time Chat",
            icon: <FaCommentDots />,
            description: "Instant messaging to coordinate trips, share tips, and stay connected with your travel circle.",
            color: "text-purple-500",
            bg: "bg-purple-50"
        },
        {
            title: "Verified Profiles",
            icon: <FaIdCard />,
            description: "Build your travel reputation with verified reviews, badges, and a portfolio of your journeys.",
            color: "text-orange-500",
            bg: "bg-orange-50"
        }
    ];

    const phase2Features = [
        {
            title: "Travoxa Yatra",
            icon: <FaHandshakeAngle className="text-emerald-500" />,
            description: "Volunteering & local impact.",
            link: "/travoxa-discovery/volunteer-yatra",
        },
        {
            title: "Travoxa Collab",
            icon: <FaMapLocationDot className="text-blue-500" />,
            description: "Creators & business partnerships.",
            link: "/travoxa-discovery/creator-collab",
        },
        {
            title: "Local Connect",
            icon: <FaCompass className="text-orange-500" />,
            description: "Authentic local storytelling.",
            link: "/travoxa-discovery/local-connect",
        }
    ];

    return (
        <div className="bg-white min-h-screen font-sans selection:bg-emerald-100">
            <Header forceWhite={true} />

            {/* HERO SECTION - Phase 3 Focus */}
            <div className="relative pt-44 pb-32 overflow-hidden bg-slate-900">
                {/* Background Image Placeholder */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
                        alt="Adventure Background"
                        fill
                        className="object-cover opacity-30 scale-105 animate-slow-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-white"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-emerald-500 text-white text-[10px] font-medium px-4 py-1.5 rounded-full uppercase tracking-[0.2em] mb-10 shadow-lg shadow-emerald-500/20 Mont">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Coming in Phase 3
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-light text-white leading-tight mb-8 Mont tracking-tight drop-shadow-2xl">
                        The Social <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 italic font-medium font-serif">Revolution</span>
                    </h1>

                    <p className="text-slate-300 text-lg lg:text-xl max-w-3xl mx-auto mb-14 Inter leading-relaxed font-light">
                        Travoxa Circle is the bridge between pixels and paths. A dedicated social ecosystem where every traveler has a voice, a community, and a journey to share.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button className="bg-white text-slate-900 px-8 py-3.5 rounded-xl font-medium Mont text-xs uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all duration-300 shadow-xl">
                            Join the Waitlist
                        </button>
                    </div>
                </div>
            </div>

            {/* PHASE 3 VISION SECTION */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
                        <div>
                            <span className="text-emerald-600 font-medium uppercase tracking-widest text-[10px] mb-4 block Mont">The Vision</span>
                            <h2 className="text-3xl lg:text-5xl font-light text-slate-900 mb-8 Mont leading-tight">
                                More than just <br />
                                <span className="text-emerald-600 italic font-medium">Networking.</span>
                            </h2>
                            <p className="text-slate-600 text-lg Inter leading-relaxed font-light mb-10">
                                We're building a space where "where to go" meets "who to go with". Phase 3 will introduce features that turn Travoxa from a travel tool into a travel lifestyle.
                            </p>
                            <div className="space-y-4">
                                {['Cinematic Content Sharing', 'Micro-Communities by Interest', 'Direct Creator Engagement'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[10px]">✓</div>
                                        <span className="text-slate-700 font-normal Inter text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 rounded-[2rem] rotate-2 scale-105 opacity-5"></div>
                            <div className="relative bg-slate-900 rounded-[2rem] p-8 aspect-video overflow-hidden shadow-xl flex items-center justify-center shadow-emerald-500/10">
                                <FaShareNodes className="text-white text-7xl opacity-10 animate-pulse" />
                                <div className="absolute inset-x-0 bottom-8 px-8 text-center text-white font-light Mont text-xl">Coming Phase 3</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {phase3Features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-8 rounded-[2rem] border border-slate-50 bg-white hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
                            >
                                <div className={`w-14 h-14 ${feature.bg} ${feature.color} rounded-[16px] flex items-center justify-center text-2xl mb-6 transition-transform duration-500`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-medium text-slate-900 mb-3 Mont">{feature.title}</h3>
                                <p className="text-slate-500 Inter text-xs leading-relaxed font-light">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PHASE 2 PREVIEW SECTION */}
            <section className="py-24 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-block bg-white border border-slate-100 px-6 py-2 rounded-full mb-6 shadow-sm">
                            <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-emerald-600 Mont italic">Coming Next</span>
                        </div>
                        <h2 className="text-3xl lg:text-5xl font-light text-slate-900 mb-6 Mont tracking-tight">Immediate Next Steps</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto Inter font-light">
                            The social circle is the destination. These Phase 2 features are the roadmap that takes you there.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {phase2Features.map((feature, index) => (
                            <Link
                                href={feature.link}
                                key={index}
                                className="group bg-white p-10 rounded-[2.5rem] border border-slate-50 hover:shadow-xl transition-all duration-700 flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 bg-slate-50 rounded-[20px] flex items-center justify-center text-3xl mb-8 group-hover:bg-emerald-50 transition-colors duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-medium text-slate-900 mb-3 Mont">{feature.title}</h3>
                                <p className="text-slate-500 Inter text-xs leading-relaxed mb-8 font-light">
                                    {feature.description}
                                </p>
                                <div className="mt-auto px-6 py-2.5 rounded-full border border-slate-100 text-slate-600 font-medium text-[9px] uppercase tracking-widest group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 transition-all duration-300 Mont">
                                    Preview Feature
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="relative bg-slate-900 rounded-[3rem] p-12 lg:p-24 text-center overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-5xl font-light text-white mb-8 Mont leading-tight">
                                Ready for the <br />Circle?
                            </h2>
                            <p className="text-slate-400 text-lg mb-12 Inter max-w-xl mx-auto leading-relaxed font-light">
                                Join the private beta waitlist today and be the first to experience the future of travel social networking.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full sm:w-72 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white Inter placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-light"
                                />
                                <button className="w-full sm:w-auto bg-emerald-500 text-white px-10 py-3.5 rounded-xl font-medium Mont text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                                    Join Waitlist
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx global>{`
                @keyframes slow-zoom {
                    0% { transform: scale(1.05); }
                    100% { transform: scale(1.1); }
                }
                .animate-slow-zoom {
                    animation: slow-zoom 20s infinite alternate ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default TravoxaCirclePage;
