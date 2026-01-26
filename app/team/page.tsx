"use client";

import Footor from "@/components/ui/Footor";
import Header from "@/components/ui/Header";
import MomentsSlider from "@/components/Pages/Team/MomentsSlider";
import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';


export default function TeamPage() {
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [journeyItems, setJourneyItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamRes, journeyRes] = await Promise.all([
                    fetch('/api/team/core'),
                    fetch('/api/team/journey')
                ]);

                const teamData = await teamRes.json();
                const journeyData = await journeyRes.json();

                if (teamData.success) setTeamMembers(teamData.data);
                if (journeyData.success) setJourneyItems(journeyData.data);

            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <Header />

            <main className="flex-grow pt-[140px] px-6 lg:px-24 max-w-[1600px] mx-auto w-full mb-20 space-y-24">

                {/* 1. HERO SECTION */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:items-start justify-between">
                    <div className="space-y-6">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-600 font-medium text-xs tracking-wide uppercase">
                            Our Story
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-black tracking-tighter leading-[0.9] Mont uppercase" data-aos="fade-up">
                            The Journey Behind <span className="text-green-600 block mt-2">Travoxa</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-600 font-light mt-4" data-aos="fade-up" data-aos-delay="100">Built by a traveler. For travelers.</p>
                    </div>

                    <div className="space-y-6 lg:pt-8" data-aos="fade-left">
                        <h2 className="text-3xl font-extralight text-black Mont">Solving What I Faced</h2>
                        <p className="text-lg text-zinc-600 font-light leading-relaxed">
                            Traveling 10,000+ kms across India wasn't just fun—it was research. I experienced first-hand:
                        </p>
                        <ul className="space-y-4">
                            {[
                                "The frustration of hidden costs in \"budget\" stays.",
                                "The struggle of finding reliable local transport in hill stations.",
                                "The safety anxiety when exploring unknown alleys.",
                                "The gap between tourist traps and real hidden gems."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-zinc-700 font-light text-lg">
                                    <span className="text-green-600 mt-1.5 text-xs">●</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* 3. QUOTE SECTION */}
                <section className="p-12 text-center">
                    <p className="text-2xl md:text-4xl font-light leading-snug mb-6 Mont" data-aos="zoom-in">
                        “Travoxa is not a company I planned. <br />
                        <span className="text-green-600 font-normal">It’s a solution I needed while traveling.</span>”
                    </p>
                    <p className="text-lg font-medium text-zinc-500">— Aditya Pathak</p>
                </section>

                {/* 4. FOUNDER & TEAM (Bridge & Cut-Out Design) */}
                <section className="space-y-12">
                    {/* The Layout: Two Grey Panels connected by a Bridge */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 items-stretch">

                        {/* LEFT PANEL: FOUNDER */}
                        <div className="bg-[#EAE8E490] rounded-[1rem] lg:rounded-tr-none p-4 md:p-6 lg:p-8 flex flex-col relative order-2 lg:order-1 transition-transform hover:scale-[1.01] duration-500" data-aos="fade-right">
                            {/* Inner Image Container */}
                            <div className="aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-white shadow-sm relative w-full h-full">
                                <img
                                    src="https://i.postimg.cc/sfYj4WHh/Aditya-Proffestional-photo-2.jpg"
                                    alt="Aditya Pathak"
                                    className="w-full h-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                {/* Overlay Card */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-5 rounded-[1rem] text-center border border-white/40 shadow-lg">
                                    <h3 className="text-xl font-bold text-black uppercase Mont leading-none mb-1">Aditya Pathak</h3>
                                    <p className="text--[10px] font-bold text-green-600 uppercase tracking-widest">Founder & Principal</p>
                                </div>
                            </div>
                        </div>

                        {/* CENTER PANEL: BRIDGE & CONTENT */}
                        <div className="order-1 lg:order-2 flex flex-col justify-center items-center py-12 lg:py-0 relative z-10" data-aos="fade-up">

                            {/* THE BRIDGE (Desktop Only) */}
                            <div className="hidden lg:block absolute top-0 left-0 right-0 h-24 bg-[#EAE8E490] z-0"></div>

                            <div className="text-center w-full rounded-t-[2rem] bg-white h-[500px] pt-[100px] space-y-6 relative z-10 lg:mt-16 flex flex-col items-center">
                                <div className="space-y-[-0.3rem]">
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-widest text-black Mont leading-none">
                                        Meet The
                                    </h2>
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-widest text-black Mont leading-none text-stroke-black">
                                        Team
                                    </h2>
                                </div>

                                <div className="w-12 h-1 bg-black/10 rounded-full mx-auto"></div>

                                <p className="text-zinc-600 font-light text-sm md:text-base leading-relaxed max-w-xs mx-auto">
                                    The minds and souls behind the journey. We are a team of travelers building for travelers.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT PANEL: TEAM GRID */}
                        <div className="bg-[#EAE8E490] rounded-[1rem] lg:rounded-tl-none p-6 lg:p-10 flex flex-col justify-center order-3 lg:order-3 hover:shadow-xl transition-shadow duration-500" data-aos="fade-left">
                            <div className="h-full flex flex-col justify-between gap-6">
                                <div className="text-left pl-2">
                                    <h4 className="text-2xl font-light text-black Mont">Core Team</h4>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider">The Builders</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 h-full">
                                    {loading ? (
                                        <div className="col-span-2 text-center text-gray-400 py-10 text-sm">
                                            Loading Team...
                                        </div>
                                    ) : (
                                        teamMembers.map((member, i) => (
                                            <div key={i} className="bg-white p-3 rounded-[1.5rem] shadow-sm border border-white flex flex-col items-center justify-center text-center gap-3 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-zinc-100 ring-2 ring-zinc-50 group-hover:ring-green-400 transition-all">
                                                    {member.image ? (
                                                        <img
                                                            src={member.image}
                                                            alt={member.name}
                                                            className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-xs md:text-sm font-bold text-black uppercase Mont">{member.name}</h4>
                                                    <p className="text-[8px] md:text-[9px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-green-600 transition-colors">{member.role}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 5. JOURNEY */}
                <section>
                    <h2 className="text-3xl md:text-4xl font-extralight text-black mb-4 text-center Mont" data-aos="fade-up">My Travel Journey Across India</h2>

                    <div className="space-y-5 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                        {loading ? (
                            <div className="text-center py-10 text-gray-400">Loading Journey...</div>
                        ) : (
                            journeyItems.map((item, i) => (
                                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active" data-aos="fade-up">
                                    {/* Icon/Dot */}
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-green-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10 text-sm">
                                        {i + 1}
                                    </div>

                                    {/* Card */}
                                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col gap-2 relative overflow-hidden">
                                        {/* Title & Desc - Always Visible */}
                                        <div>
                                            <h3 className="text-lg font-medium text-black">📍 {item.title}</h3>
                                            <p className="text-zinc-600 font-light text-sm">{item.desc || item.description}</p>
                                        </div>

                                        {/* Image - Hidden initially, shown on hover (only if image exists) */}
                                        {item.image && (
                                            <div className="max-h-0 opacity-0 group-hover:max-h-[350px] group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden rounded-[1rem] w-full mt-0 group-hover:mt-3">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* 6. MOMENTS (Infinite Card Slider) */}
                <MomentsSlider items={journeyItems} />

                {/* 7. CTA */}
                <section className="text-center mt-[-4rem] pt-8 pb-8 bg-zinc-50 rounded-3xl" data-aos="fade-up">
                    <p className="text-xl md:text-2xl font-light text-green-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Travoxa is built with travelers, creators, volunteers, and locals — together creating India’s most helpful travel ecosystem.
                    </p>
                    <a href="/travoxa-discovery" className="inline-block bg-black text-white px-10 py-4 rounded-full font-medium hover:bg-zinc-800 transition-all hover:scale-105 transform duration-300">
                        Explore With Travoxa
                    </a>
                </section>

            </main>
            <Footor />
        </div>
    );
}
