"use client";

import { useState } from "react";
import Image from "next/image";
import { FaSearch, FaMapMarkerAlt, FaCar, FaMotorcycle, FaCalendarAlt, FaChevronDown } from "react-icons/fa";

interface RentalHeroProps {
    onSearch: (filters: { city: string; type: string; date: string }) => void;
}

export default function RentalHero({ onSearch }: RentalHeroProps) {
    const [city, setCity] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");

    const cities = ["Goa", "Manali", "Jaipur", "Rishikesh", "Kolkata"];
    const vehicleTypes = ["Scooter", "Bike", "Car", "SUV"];

    const handleSearch = () => {
        onSearch({ city, type, date });
    };

    return (
        <div className="relative mx-[12px] mt-[12px] rounded-[12px] py-16 md:py-24 overflow-hidden">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://res.cloudinary.com/dta29uych/image/upload/v1771256150/lucid-origin_A_wide_high-quality_flat_vector_illustration_suitable_for_a_website_hero_backgro-0_1_yy5pty.jpg"
                    alt="Rentals Background"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                />
                {/* Gradient Overlay for blending at bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/90"></div>
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center px-4">
                <h1 className="mt-24 text-3xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 Mont tracking-tight text-center drop-shadow-sm">
                    Rent Your Ride <br /> <span className="text-emerald-600 font-serif italic font-medium">Explore Freedom</span>
                </h1>

                {/* Search Bar */}
                <div className="w-full max-w-4xl bg-white/90 backdrop-blur-sm rounded-full p-2.5 flex flex-col md:flex-row gap-1 items-center border border-slate-200 hover:border-emerald-500/30 transition-colors shadow-lg">

                    {/* City Dropdown */}
                    <div className="flex-1 w-full relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors">
                            <FaMapMarkerAlt size={10} />
                        </div>
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full h-9 pl-10 pr-6 rounded-full bg-transparent hover:bg-slate-50 border-none text-slate-700 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors"
                        >
                            <option value="">Select City</option>
                            {cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-[8px] pointer-events-none" />
                    </div>

                    <div className="h-5 w-[1px] bg-slate-300 hidden md:block"></div>

                    {/* Vehicle Type Dropdown */}
                    <div className="flex-1 w-full relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors">
                            <FaMotorcycle size={10} />
                        </div>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full h-9 pl-10 pr-6 rounded-full bg-transparent hover:bg-slate-50 border-none text-slate-700 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors"
                        >
                            <option value="">Vehicle Type</option>
                            {vehicleTypes.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-[8px] pointer-events-none" />
                    </div>

                    <div className="h-5 w-[1px] bg-slate-300 hidden md:block"></div>

                    {/* Date (Optional) */}
                    <div className="flex-1 w-full relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-emerald-500 transition-colors">
                            <FaCalendarAlt size={10} />
                        </div>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full h-9 pl-10 pr-6 rounded-full bg-transparent hover:bg-slate-50 border-none text-slate-700 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors placeholder:text-slate-500 uppercase"
                            style={{ colorScheme: 'light' }}
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="w-full md:w-auto h-9 px-6 bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-medium rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wide ml-1 shadow-md"
                    >
                        <FaSearch size={8} />
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}
