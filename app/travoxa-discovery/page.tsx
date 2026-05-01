"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import MagicBento from '@/components/ui/MagicBento';
import { useRouter } from 'next/navigation';
import { FiArrowUpRight } from 'react-icons/fi';
import Masonry from '@/components/ui/Masonry';

const services = [
    {
        title: "Sightseeing",
        description: "Top places, routes & must-see spots",
        link: "/travoxa-discovery/sightseeing"
    },
    {
        title: "Rentals",
        description: "Scooty, bike & car rentals nearby",
        link: "/travoxa-discovery/rentals"
    },
    {
        title: "Food & Cafes",
        description: "Local food you shouldn't miss",
        link: "/travoxa-discovery/food-and-cafes"
    },
    {
        title: "Attractions",
        description: "Famous spots & hidden gems",
        link: "/travoxa-discovery/attractions"
    },
    {
        title: "Travoxa AI",
        description: "Your personal intelligent travel companion",
        link: "/travoxa-ai"
    },
    {
        title: "Activities",
        description: "Treks, rafting, adventures & more",
        link: "/travoxa-discovery/activities"
    },
    {
        title: "Local Connect",
        description: "Meet local guides & helpers",
        link: "/travoxa-discovery/local-connect"
    },
    {
        title: "Travel Journal",
        description: "Document your beautiful memories",
        link: "/journal"
    },
    {
        title: "Volunteer Yatra",
        description: "Travel by exchanging skills",
        link: "/travoxa-discovery/volunteer-yatra"
    },
    {
        title: "Creator Collab",
        description: "Collaborate with brands & creators",
        link: "/travoxa-discovery/creator-collab"
    },
    {
        title: "Help & Support",
        description: "24/7 assistance for your journey",
        link: "/help"
    },
    {
        title: "Community",
        description: "Connect with fellow travelers",
        link: "/community"
    },
    {
        title: "Emergency Help",
        description: "Hospitals, police & helplines",
        link: "/travoxa-discovery/emergency-help"
    }
];

const TravoxaDiscoveryPage = () => {
    const router = useRouter();

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const bentoData = [
        {
            title: "Explore The Unseen",
            description: "Find hidden gems, connect with locals, and embark on unforgettable adventures around you.",
            label: "Discovery Protocol",
            color: "#ffffff",
            link: "#",
            isHook: true
        },
        ...services.map((s, idx) => ({
            title: s.title,
            description: s.description,
            label: s.title === "Travoxa AI" ? "AI POWERED" : "Explore",
            color: s.title === "Travoxa AI" ? "#f8fafc" : "#ffffff", // Subtle difference for AI
            link: s.link
        }))
    ];

    const handleCardClick = (index: number) => {
        const link = bentoData[index].link;
        if (link && link !== "#") {
            router.push(link);
        }
    };

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <Header forceWhite={true} />

            <main className="flex-grow pt-32 lg:pt-40 pb-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
                <div data-aos="fade-up">
                    <MagicBento 
                        cardData={bentoData}
                        textAutoHide={true}
                        enableStars={true}
                        enableSpotlight={true}
                        enableBorderGlow={true}
                        enableTilt={false}
                        enableMagnetism={false}
                        clickEffect={true}
                        glowColor="16, 185, 129" // Emerald 500
                        onCardClick={handleCardClick}
                    />
                </div>

                {/* GALLERY CTA SECTION */}
                <section className="mt-8 lg:mt-12" data-aos="fade-up">
                    <div className="flex flex-col mb-12 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-4">
                                Captured <span className="text-emerald-500">Memories</span>
                            </h2>
                            <p className="text-lg text-slate-500 font-normal">
                                A visual journey through the soul of India, captured by our vibrant community of explorers.
                            </p>
                        </div>
                    </div>

                    <div className="w-full relative group">
                        {/* MASONRY CONTAINER WITH FADE */}
                        <div className="relative max-h-[600px] overflow-hidden rounded-[32px]">
                            <Masonry 
                                items={[
                                    { id: "1", img: "/home/tourist-places1.jpg", height: 600, url: "/gallery" },
                                    { id: "2", img: "/home/tourist-places2.jpg", height: 400, url: "/gallery" },
                                    { id: "3", img: "/home/tourist-places3.jpg", height: 800, url: "/gallery" },
                                    { id: "4", img: "/home/tourist-places4.jpg", height: 500, url: "/gallery" },
                                    { id: "5", img: "/home/tourist-places5.jpg", height: 700, url: "/gallery" },
                                    { id: "6", img: "/home/tourist-places6.jpg", height: 450, url: "/gallery" },
                                    { id: "7", img: "/home/tourist-places7.jpg", height: 650, url: "/gallery" },
                                    { id: "8", img: "/home/tourist-places8.jpeg", height: 550, url: "/gallery" }
                                ]}
                                animateFrom="bottom"
                                duration={0.8}
                                stagger={0.05}
                                scaleOnHover={true}
                                hoverScale={0.95}
                                blurToFocus={true}
                                colorShiftOnHover={false}
                            />
                            
                            {/* BOTTOM FADE OVERLAY */}
                            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />
                        </div>

                        {/* CENTERED CTA BUTTON */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
                            <Link 
                                href="/gallery" 
                                className="flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:bg-emerald-500 shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                            >
                                See More Memories
                                <FiArrowUpRight className="group-hover:rotate-45 transition-transform" size={20} />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default TravoxaDiscoveryPage;
