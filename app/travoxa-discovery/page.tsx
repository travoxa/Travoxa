"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
    FaMapMarkerAlt,
    FaMotorcycle,
    FaUsers,
    FaHiking,
    FaStar,
    FaUtensils,
    FaPills,
    FaHandHoldingHeart,
    FaInstagram,
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';

const services = [
    {
        title: "Sightseeing",
        description: "Top places, routes & must-see spots",
        icon: <FaMapMarkerAlt />,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        slideBg: "bg-[#ccff00]",
        textColor: "text-orange-600",
        descriptionColor: "text-orange-800",
        iconColor: "text-orange-500/80",
        link: "/travoxa-discovery/sightseeing"
    },
    {
        title: "Rentals",
        description: "Scooty, bike & car rentals nearby",
        icon: <FaMotorcycle />,
        color: "text-orange-500",
        bg: "bg-orange-50",
        slideBg: "bg-[#FF6D00]",
        textColor: "text-purple-900",
        descriptionColor: "text-purple-100",
        iconColor: "text-purple-800/60",
        link: "/travoxa-discovery/rentals"
    },
    {
        title: "Local Connect",
        description: "Meet local guides & helpers",
        icon: <FaUsers />,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        slideBg: "bg-[#2962FF]",
        textColor: "text-yellow-300",
        descriptionColor: "text-yellow-100",
        iconColor: "text-yellow-400/50",
        link: "/travoxa-discovery/local-connect"
    },
    {
        title: "Activities",
        description: "Treks, rafting, adventures & more",
        icon: <FaHiking />,
        color: "text-orange-500",
        bg: "bg-orange-50",
        slideBg: "bg-[#FFD600]",
        textColor: "text-red-600",
        descriptionColor: "text-red-800",
        iconColor: "text-red-500/60",
        link: "/travoxa-discovery/activities"
    },
    {
        title: "Attractions",
        description: "Famous spots & hidden gems",
        icon: <FaStar />,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        slideBg: "bg-[#00E676]",
        textColor: "text-pink-700",
        descriptionColor: "text-pink-900",
        iconColor: "text-pink-600/60",
        link: "/travoxa-discovery/attractions"
    },
    {
        title: "Food & Cafes",
        description: "Local food you shouldn't miss",
        icon: <FaUtensils />,
        color: "text-orange-500",
        bg: "bg-orange-50",
        slideBg: "bg-[#F50057]",
        textColor: "text-yellow-300",
        descriptionColor: "text-white",
        iconColor: "text-yellow-400/50",
        link: "/travoxa-discovery/food-and-cafes"
    },
    {
        title: "Emergency Help",
        description: "Hospitals, police & helplines",
        icon: <FaPills />,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        slideBg: "bg-[#D50000]",
        textColor: "text-white",
        descriptionColor: "text-white/80",
        iconColor: "text-black/20",
        link: "/travoxa-discovery/emergency-help"
    },
    {
        title: "Volunteer Yatra",
        description: "Travel by exchanging skills",
        icon: <FaHandHoldingHeart />,
        color: "text-orange-500",
        bg: "bg-orange-50",
        slideBg: "bg-[#AA00FF]",
        textColor: "text-green-300",
        descriptionColor: "text-white",
        iconColor: "text-green-400/40",
        link: "/travoxa-discovery/volunteer-yatra"
    },
    {
        title: "Creator Collab",
        description: "Collaborate with brands & creators",
        icon: <FaInstagram />,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        slideBg: "bg-[#00B0FF]",
        textColor: "text-indigo-900",
        descriptionColor: "text-white",
        iconColor: "text-indigo-800/40",
        link: "/travoxa-discovery/creator-collab"
    }
];

const list1 = services.slice(0, 5);
const list2 = services.slice(5, 9);

const TravoxaDiscoveryPage = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () =>
                setCurrentIndex((prevIndex) =>
                    prevIndex === services.length - 1 ? 0 : prevIndex + 1
                ),
            4000
        );

        return () => {
            resetTimeout();
        };
    }, [currentIndex]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? services.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === services.length - 1 ? 0 : prev + 1));
    };

    // We scroll deeply to the carousel when an ID matches
    // But since the IDs were on individual cards before, and now we want to show 
    // the carousel item, we should probably set the carousel index if hash changes?
    // For simplicity in this step, I will add IDs to the carousel wrapper so it scrolls there
    // and maybe I can try to set the index.

    // Simpler approach for IDs based on current request: 
    // The lists serve as nav buttons to the carousel details?
    // Or just static lists? The user said "listing of the items... like cubic model".
    // I will try to make the lists clickable to set the carousel index.

    const scrollToCarousel = (index: number) => {
        setCurrentIndex(index);
        const element = document.getElementById('discovery-carousel');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        // Handle initial hash
        const handleHashChange = () => {
            const hash = window.location.hash.substring(1); // remove #
            if (hash) {
                const index = services.findIndex(s =>
                    s.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === hash
                );
                if (index !== -1) {
                    scrollToCarousel(index);
                }
            }
        };

        // Check on mount and on hash change
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <Header forceWhite={true} />

            <main className="flex-grow pt-40 pb-32 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">



                {/* BENTO GRID */}
                <div
                    className="flex flex-col gap-1.5 h-auto lg:h-[850px]"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                >

                    {/* ROW 1: Top Left (60%) + Top Right (40%) */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-1.5 h-auto lg:h-[45%]">
                        {/* TOP LEFT: Hero */}
                        <div className="relative rounded-2xl overflow-hidden group h-full min-h-[300px]">
                            <Image
                                src="/home/tourist-places10.jpeg"
                                alt="Discovery Hero"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/60 to-purple-900/60"></div>

                            <div className="absolute inset-0 p-10 lg:p-14 flex flex-col justify-between text-white">
                                {/* Top Content: Heading */}
                                <div>
                                    <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] drop-shadow-lg">
                                        EXPLORE <br /> TRAVOXA
                                    </h1>
                                </div>

                                {/* Bottom Content: Details */}
                                <div className="flex flex-col gap-4">
                                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full w-fit border border-white/20">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        <span className="text-[10px] font-bold tracking-widest uppercase text-green-300">New Era of Travel</span>
                                    </div>

                                    <h2 className="text-2xl font-bold uppercase tracking-wide text-green-200">
                                        Discover • Connect
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* TOP RIGHT: List 1 (5 items) */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 lg:p-6 flex flex-col justify-center h-full">
                            <div className="grid grid-cols-2 gap-2 h-full">
                                {list1.map((service, i) => (
                                    <Link
                                        key={i}
                                        href={service.link}
                                        // White Theme: Colored BG from data, Dark Text
                                        className={`${service.bg} rounded-xl p-3 flex flex-col justify-between hover:shadow-md transition-all duration-300 cursor-pointer group ${i === 2 ? 'row-span-2' : ''}`}
                                    >
                                        <div className={`w-8 h-8 bg-white/40 ${service.color} rounded-full flex items-center justify-center text-sm mb-2 group-hover:scale-110 transition-transform`}>
                                            {service.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-800 leading-tight mb-1 Mont">{service.title}</h3>
                                            {i === 2 && <p className="text-[10px] text-slate-600 line-clamp-2 mt-1 inter">{service.description}</p>}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ROW 2: Bottom Left (40%) + Bottom Right (60%) */}
                    <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-1.5 h-auto lg:h-[55%]">
                        {/* BOTTOM LEFT: List 2 (4 items) */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 flex flex-col justify-center text-slate-900 h-full">
                            <div className="grid grid-cols-2 gap-2 h-full">
                                {list2.map((service, i) => {
                                    return (
                                        <Link
                                            key={i}
                                            href={service.link}
                                            // White Theme: Colored BG, Dark Text
                                            className={`${service.bg} rounded-xl p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-all duration-300 cursor-pointer group`}
                                        >
                                            <div className={`w-10 h-10 bg-white/40 ${service.color} rounded-full flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition-transform`}>
                                                {service.icon}
                                            </div>
                                            <h3 className="text-[13px] font-bold text-slate-800 Mont">{service.title}</h3>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* BOTTOM RIGHT: Carousel (Now Wrapped here) */}
                        <div id="discovery-carousel" className="relative rounded-2xl overflow-hidden bg-white/5 group h-full">
                            <div
                                className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {services.map((service, index) => (
                                    <Link
                                        href={service.link}
                                        key={index}
                                        className={`min-w-full h-full relative ${service.slideBg} flex p-10 lg:p-14 overflow-hidden`}
                                    >
                                        {/* LEFT: Text Content */}
                                        <div className="w-1/2 flex flex-col justify-between z-10 h-full">
                                            <h2 className={`text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.85] ${service.textColor} break-words`}>
                                                {service.title}
                                            </h2>

                                            <p className={`text-xl font-bold leading-tight ${service.descriptionColor} max-w-xs`}>
                                                {service.description}
                                            </p>
                                        </div>

                                        {/* RIGHT: Icon 50% */}
                                        <div className="absolute right-0 top-0 h-full w-1/2 flex items-center justify-center">
                                            <div className={`text-[12rem] lg:text-[16rem] ${service.iconColor} transform scale-110`}>
                                                {service.icon}
                                            </div>
                                        </div>

                                        {/* Deep Link Anchor */}
                                        <div id={service.title.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')} className="absolute top-0 left-0"></div>
                                    </Link>
                                ))}
                            </div>

                            {/* Carousel Controls */}
                            <button
                                onClick={handlePrev}
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
                            >
                                <FaChevronLeft className="text-xl" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-black/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
                            >
                                <FaChevronRight className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Removed Original Grid block ending since I replaced the whole block structure */}


            </main>

            <Footor />
        </div>
    );
};

export default TravoxaDiscoveryPage;
