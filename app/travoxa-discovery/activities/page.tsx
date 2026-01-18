"use client";

import React, { useEffect, useState } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import Image from 'next/image';
import { FaLocationDot, FaStar, FaFilter, FaChevronDown, FaMapLocationDot, FaPersonHiking } from 'react-icons/fa6';
import AOS from 'aos';
import 'aos/dist/aos.css';

const activities = [
    {
        id: 1,
        title: "White Water Rafting",
        location: "Rishikesh, Uttarakhand",
        image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        reviews: "5k+",
        category: "Water Sports",
        duration: "3-4 Hours",
        price: "1,500"
    },
    {
        id: 2,
        title: "Paragliding",
        location: "Bir Billing, Himachal",
        image: "https://images.unsplash.com/photo-1526772662000-3f88f107f598?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        reviews: "2k+",
        category: "Air",
        duration: "1 Hour",
        price: "2,500"
    },
    {
        id: 3,
        title: "Triund Trek",
        location: "Mcleodganj, Himachal",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        reviews: "3.2k",
        category: "Trekking",
        duration: "2 Days",
        price: "3,000"
    },
    {
        id: 4,
        title: "Scuba Diving",
        location: "Havelock Island, Andaman",
        image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&q=80&w=800",
        rating: 4.9,
        reviews: "4k+",
        category: "Underwater",
        duration: "2 Hours",
        price: "4,500"
    },
    {
        id: 5,
        title: "Desert Camping",
        location: "Jaisalmer, Rajasthan",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        reviews: "6k+",
        category: "Camping",
        duration: "Overnight",
        price: "2,000"
    },
    {
        id: 6,
        title: "Jungle Safari",
        location: "Jim Corbett, Uttarakhand",
        image: "https://images.unsplash.com/photo-1564760055278-df032906c11d?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        reviews: "8k+",
        category: "Wildlife",
        duration: "4 Hours",
        price: "4,000"
    }
];

const ActivitiesPage = () => {
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
                    src="https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&q=80&w=2000"
                    alt="Activities Hero"
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-10">
                    <h1 className="text-4xl lg:text-6xl font-medium text-white mb-4 Mont tracking-tight drop-shadow-lg" data-aos="fade-up">
                        Adventure <span className="text-orange-400">Begins Here</span>
                    </h1>
                    <p className="text-white/90 text-lg max-w-xl font-normal Inter" data-aos="fade-up" data-aos-delay="100">
                        Find the best thrills, treks, and experiences across India.
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
                                <FaFilter size={14} className="text-orange-500" /> Filters
                            </h3>
                            <button className="text-xs font-medium text-slate-400 hover:text-orange-600 transition-colors Inter">Reset</button>
                        </div>

                        {/* Categories */}
                        <div className="mb-8">
                            <h4 className="text-sm font-medium text-slate-800 mb-4 flex justify-between cursor-pointer group">
                                Activity Type <FaChevronDown size={10} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                            </h4>
                            <div className="space-y-3">
                                {['Water Sports', 'Trekking', 'Air', 'Wildlife', 'Camping'].map(cat => (
                                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${selectedCategories.includes(cat) ? 'border-orange-500' : 'border-slate-300 group-hover:border-orange-400'
                                            }`}>
                                            {selectedCategories.includes(cat) && <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>}
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

                        {/* Difficulty */}
                        <div className="mb-0">
                            <h4 className="text-sm font-medium text-slate-800 mb-4 flex justify-between cursor-pointer group">
                                Difficulty <FaChevronDown size={10} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                            </h4>
                            <div className="space-y-3">
                                {['Easy', 'Moderate', 'Challenging', 'Extreme'].map(diff => (
                                    <label key={diff} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center group-hover:border-orange-400">
                                            <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-orange-200"></div>
                                        </div>
                                        <span className="text-sm text-slate-600 font-normal Inter">{diff}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRID (75%) */}
                <div className="lg:w-3/4">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-slate-500 text-sm font-medium Inter">Showing <span className="text-slate-900">{activities.length}</span> adventures</p>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-sm font-medium Inter">Sort by:</span>
                            <select className="bg-transparent text-slate-900 font-medium text-sm focus:outline-none cursor-pointer Mont">
                                <option>Popularity</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map((item, index) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                                data-aos="fade-up"
                                data-aos-delay={index * 50}
                            >
                                {/* Image */}
                                <div className="relative h-56 overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <FaStar className="text-orange-400 text-[10px]" />
                                        <span className="text-[10px] font-medium text-slate-900">{item.rating}</span>
                                    </div>

                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-[10px] uppercase font-medium tracking-wider">
                                        {item.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="text-lg font-medium text-slate-900 mb-1 leading-tight group-hover:text-orange-600 transition-colors Mont">{item.title}</h3>
                                    <div className="flex items-start gap-1.5 text-slate-500 text-xs font-normal mb-4 Inter min-h-[32px]">
                                        <FaMapLocationDot className="mt-0.5 shrink-0 text-orange-400" />
                                        {item.location}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Start From</span>
                                            <span className="text-slate-900 font-bold Mont">₹{item.price}</span>
                                        </div>
                                        <button className="bg-orange-50 text-orange-600 border border-orange-100 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-500 hover:text-white transition-all Mont">
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination / Load More */}
                    <div className="mt-12 flex justify-center">
                        <button className="px-8 py-3 rounded-full border-2 border-slate-100 text-slate-600 font-medium text-sm hover:border-orange-500 hover:text-orange-600 transition-all Mont">
                            Load More Adventures
                        </button>
                    </div>
                </div>
            </div>

            <Footor />
        </div>
    );
};

export default ActivitiesPage;
