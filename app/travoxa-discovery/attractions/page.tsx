"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import Image from 'next/image';
import { FaLocationDot, FaStar, FaFilter, FaChevronDown, FaMapLocationDot } from 'react-icons/fa6';
import AOS from 'aos';
import 'aos/dist/aos.css';

const attractions = [
    {
        id: 1,
        title: "Mysore Palace",
        location: "Mysore, Karnataka",
        image: "https://images.unsplash.com/photo-1590050752117-238cb0fb32b6?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        reviews: "18k+",
        category: "Royal",
        type: "Palace"
    },
    {
        id: 2,
        title: "Victoria Memorial",
        location: "Kolkata, WB",
        image: "https://images.unsplash.com/photo-1558431382-27e30314225d?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        reviews: "12k+",
        category: "History",
        type: "Museum"
    },
    {
        id: 3,
        title: "Lotus Temple",
        location: "New Delhi",
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800",
        rating: 4.6,
        reviews: "22k+",
        category: "Modern",
        type: "Temple"
    },
    {
        id: 4,
        title: "Charminar",
        location: "Hyderabad, Telangana",
        image: "https://images.unsplash.com/photo-1572445217366-26e8281180b5?auto=format&fit=crop&q=80&w=800",
        rating: 4.5,
        reviews: "9k+",
        category: "Landmark",
        type: "Monument"
    },
    {
        id: 5,
        title: "Qutub Minar",
        location: "New Delhi",
        image: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        reviews: "14k+",
        category: "UNESCO",
        type: "Tower"
    },
    {
        id: 6,
        title: "Sun Temple",
        location: "Konark, Odisha",
        image: "https://images.unsplash.com/photo-1629213856230-0199ae6cc180?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        reviews: "10k+",
        category: "Ancient",
        type: "Temple"
    }
];

const AttractionsPage = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const toggleCategory = (cat: string) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat));
        } else {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            <Header forceWhite={true} />

            {/* HERO SECTION */}
            <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden mx-[12px] mt-[12px] rounded-[12px]">
                <Image
                    src="https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&q=80&w=2000"
                    alt="Attractions Hero"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-10">
                    <h1 className="text-4xl lg:text-6xl font-medium text-white mb-4 Mont tracking-tight drop-shadow-lg" data-aos="fade-up">
                        Popular <span className="text-pink-500">Attractions</span>
                    </h1>
                    <p className="text-white/90 text-lg max-w-xl font-normal Inter" data-aos="fade-up" data-aos-delay="100">
                        Must-visit spots, historical sites, and cultural wonders.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col lg:flex-row gap-10">

                {/* SIDEBAR FILTERS (25%) */}
                <div className="lg:w-1/4 space-y-8" data-aos="fade-right">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-medium text-slate-900 Mont flex items-center gap-2">
                                <FaFilter size={14} className="text-pink-500" /> Filters
                            </h3>
                            <button className="text-xs font-medium text-slate-400 hover:text-pink-600 transition-colors Inter">Reset</button>
                        </div>

                        {/* Categories */}
                        <div className="mb-8">
                            <h4 className="text-sm font-medium text-slate-800 mb-4 flex justify-between cursor-pointer group">
                                Category <FaChevronDown size={10} className="text-slate-400 group-hover:text-pink-500 transition-colors" />
                            </h4>
                            <div className="space-y-3">
                                {['Historical', 'Religious', 'Modern', 'UNESCO', 'Nature'].map(cat => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedCategories.includes(cat) ? 'bg-pink-500 border-pink-500' : 'border-slate-300 group-hover:border-pink-400'
                                            }`}>
                                            {selectedCategories.includes(cat) && <span className="text-white text-xs">✓</span>}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedCategories.includes(cat)}
                                            onChange={() => toggleCategory(cat)}
                                        />
                                        <span className={`text-sm ${selectedCategories.includes(cat) ? 'text-slate-900 font-medium' : 'text-slate-600 font-normal'} Inter`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRID (75%) */}
                <div className="lg:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-slate-500 text-sm font-medium Inter">Showing <span className="text-slate-900">{attractions.length}</span> spots</p>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-sm font-medium Inter">Sort by:</span>
                            <select className="bg-transparent text-slate-900 font-medium text-sm focus:outline-none cursor-pointer Mont">
                                <option>Popularity</option>
                                <option>Rating</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {attractions.map((spot, index) => (
                            <div
                                key={spot.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-pink-500/5 transition-all duration-300"
                                data-aos="fade-up"
                                data-aos-delay={index * 50}
                            >
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={spot.image}
                                        alt={spot.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <FaStar className="text-orange-400 text-[10px]" />
                                        <span className="text-[10px] font-medium text-slate-900">{spot.rating}</span>
                                    </div>

                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] uppercase font-medium tracking-wider">
                                        {spot.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-medium text-slate-900 mb-1 leading-tight group-hover:text-pink-600 transition-colors Mont">{spot.title}</h3>
                                    <div className="flex items-start gap-1.5 text-slate-500 text-xs font-normal mb-4 Inter min-h-[32px]">
                                        <FaMapLocationDot className="mt-0.5 shrink-0 text-pink-400" />
                                        {spot.location}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="text-xs text-slate-400 font-medium">
                                            Type: <span className="text-slate-600">{spot.type}</span>
                                        </div>
                                        <button className="text-pink-600 text-xs font-bold uppercase tracking-wider hover:underline Mont">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footor />
        </div>
    );
};

export default AttractionsPage;
