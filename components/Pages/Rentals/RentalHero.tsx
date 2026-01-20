"use client";

import { useState } from "react";
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
        <div className="relative mx-[12px] mt-[12px] rounded-[12px] py-16 md:py-24">

            {/* Content Overlay */}
            <div className="flex flex-col items-center justify-center px-4">
                <h1 className="mt-24 text-3xl md:text-5xl lg:text-6xl font-light text-slate-900 mb-8 Mont tracking-tight text-center">
                    Rent Your Ride <br /> <span className="text-emerald-500 font-serif italic">Explore Freedom</span>
                </h1>

                {/* Search Bar */}
                <div className="w-full max-w-4xl bg-white rounded-full p-2.5 flex flex-col md:flex-row gap-1 items-center border border-slate-200 hover:border-emerald-500/30 transition-colors">

                    {/* City Dropdown */}
                    <div className="flex-1 w-full relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors">
                            <FaMapMarkerAlt size={10} />
                        </div>
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full h-9 pl-10 pr-6 rounded-full bg-slate-50 hover:bg-slate-100 border-none text-slate-600 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors"
                        >
                            <option value="">Select City</option>
                            {cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 text-[8px] pointer-events-none" />
                    </div>

                    <div className="h-5 w-[1px] bg-slate-200 hidden md:block"></div>

                    {/* Vehicle Type Dropdown */}
                    <div className="flex-1 w-full relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors">
                            <FaMotorcycle size={10} />
                        </div>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full h-9 pl-10 pr-6 rounded-full bg-slate-50 hover:bg-slate-100 border-none text-slate-600 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors"
                        >
                            <option value="">Vehicle Type</option>
                            {vehicleTypes.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                        <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 text-[8px] pointer-events-none" />
                    </div>

                    <div className="h-5 w-[1px] bg-slate-200 hidden md:block"></div>

                    {/* Date (Optional) */}
                    <div className="flex-1 w-full relative group">
                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-emerald-500 transition-colors">
                            <FaCalendarAlt size={10} />
                        </div>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full h-9 pl-10 pr-6 rounded-full bg-slate-50 hover:bg-slate-100 border-none text-slate-600 text-xs font-light focus:outline-none focus:ring-0 appearance-none cursor-pointer transition-colors placeholder:text-slate-500 uppercase"
                            style={{ colorScheme: 'light' }}
                        />
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        className="w-full md:w-auto h-9 px-6 bg-slate-900 hover:bg-emerald-600 text-white text-[10px] font-medium rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wide ml-1"
                    >
                        <FaSearch size={8} />
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}
