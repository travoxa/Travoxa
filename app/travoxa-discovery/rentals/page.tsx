"use client";

import React, { useState } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import { FaChevronLeft, FaChevronRight, FaFilter, FaWhatsapp, FaGasPump, FaUserGroup, FaHelmetSafety, FaChevronDown } from 'react-icons/fa6';
import Image from 'next/image';

const rentals = [
    {
        id: 1,
        name: "Honda Activa 6G",
        type: "Scooter",
        model: "2023 MODEL",
        rating: 4.6,
        reviews: 120,
        mileage: "45 km/l",
        seats: "2 Seats",
        fuel: "Petrol",
        helmet: "Helmet Included",
        price: 399,
        image: "https://images.unsplash.com/photo-1558981285-6f0c94958bb6?auto=format&fit=crop&q=80&w=600",
        verified: true,
        location: "Calangute, Goa"
    },
    {
        id: 2,
        name: "Royal Enfield Classic 350",
        type: "Bike",
        model: "2023 MODEL",
        rating: 4.8,
        reviews: 95,
        mileage: "35 km/l",
        seats: "2 Seats",
        fuel: "Petrol",
        helmet: "Helmet Included",
        price: 899,
        image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600",
        verified: true,
        location: "Calangute, Goa"
    },
    {
        id: 3,
        name: "Thar 4x4 Convertible",
        type: "Car",
        model: "2022 MODEL",
        rating: 4.9,
        reviews: 210,
        mileage: "15 km/l",
        seats: "4 Seats",
        fuel: "Diesel",
        helmet: "Self Drive",
        price: 3500,
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=600",
        verified: true,
        location: "Panjim, Goa"
    }
];

const RentalsPage = () => {
    const [selectedCity, setSelectedCity] = useState('Goa');
    const [selectedType, setSelectedType] = useState('Scooters / Bikes');

    const cities = ['Goa', 'Manali', 'Jaipur', 'Rishikesh', 'Kolkata'];
    const vehicleTypes = ['Scooters / Bikes', 'Self-drive Cars', 'With Driver', 'Tempo Traveler', 'SUV / Family'];

    return (
        <div className="bg-white min-h-screen font-sans">
            <Header forceWhite={true} />

            {/* HERO SECTION */}
            <div className="relative pt-32 pb-24 bg-black overflow-hidden mx-[12px] mt-[12px] rounded-[12px]">
                <Image
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1600"
                    alt="Rentals Hero"
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <h1 className="text-4xl lg:text-6xl font-medium text-white leading-tight mb-4 Mont">
                        Rent Your Ride.<br />
                        <span className="text-emerald-400">Explore Freedom.</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl font-normal Inter">
                        From scooters to SUVs, find the perfect vehicle for your journey. Affordable, reliable, and ready to go.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* FILTERS SIDEBAR */}
                    <div className="lg:w-1/4 space-y-8">
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-slate-900 Mont flex items-center gap-2">
                                    <FaFilter size={14} className="text-emerald-500" /> Filters
                                </h3>
                                <button className="text-xs font-medium text-slate-400 hover:text-emerald-600 transition-colors Inter">Reset</button>
                            </div>

                            {/* City Filter */}
                            <div className="mb-8">
                                <h4 className="text-sm font-medium text-slate-800 mb-4 flex justify-between cursor-pointer group">
                                    City <FaChevronDown size={10} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                </h4>
                                <div className="space-y-3">
                                    {cities.map(city => (
                                        <label key={city} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${selectedCity === city ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'
                                                }`}>
                                                {selectedCity === city && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>}
                                            </div>
                                            <input
                                                type="radio"
                                                name="city"
                                                className="hidden"
                                                checked={selectedCity === city}
                                                onChange={() => setSelectedCity(city)}
                                            />
                                            <span className={`text-sm ${selectedCity === city ? 'text-slate-900 font-medium' : 'text-slate-600 font-normal'} Inter`}>{city}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle Type Filter */}
                            <div>
                                <h4 className="text-sm font-medium text-slate-800 mb-4 flex justify-between cursor-pointer group">
                                    Vehicle Type <FaChevronDown size={10} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                </h4>
                                <div className="space-y-3">
                                    {vehicleTypes.map(type => (
                                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${selectedType === type ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'
                                                }`}>
                                                {selectedType === type && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>}
                                            </div>
                                            <input
                                                type="radio"
                                                name="vehicleType"
                                                className="hidden"
                                                checked={selectedType === type}
                                                onChange={() => setSelectedType(type)}
                                            />
                                            <span className={`text-sm ${selectedType === type ? 'text-slate-900 font-medium' : 'text-slate-600 font-normal'} Inter`}>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LISTINGS GRID */}
                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-medium text-gray-900 Mont">
                                Available in <span className="text-emerald-600">{selectedCity}</span>
                            </h2>
                            <span className="text-gray-500 text-sm font-normal Inter">{rentals.length} Vehicles</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {rentals.map((item) => (
                                <div key={item.id} className="bg-white border border-slate-100 rounded-3xl p-6 hover:shadow-xl transition-all duration-300 group">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 Inter">
                                            Trusted Owner
                                        </div>
                                        <div className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider Inter">
                                            {item.location}
                                        </div>
                                    </div>

                                    {/* Title Price */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-end">
                                            <h3 className="text-xl font-medium text-slate-900 leading-tight Mont">{item.name}</h3>
                                            <span className="text-orange-500 text-[10px] font-bold uppercase tracking-wider bg-orange-50 px-2 py-1 rounded Inter">{item.model}</span>
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-orange-500 text-sm">★</span>
                                            <span className="text-sm font-medium text-slate-900">{item.rating}</span>
                                            <span className="text-xs text-slate-400">({item.reviews} reviews)</span>
                                        </div>
                                    </div>

                                    {/* Image Placeholder - since we don't have vehicle images readily, verify links */}
                                    <div className="relative h-40 mb-6 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>

                                    {/* Specs Grid */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg Inter">
                                            <FaGasPump className="text-slate-400" /> {item.mileage}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg Inter">
                                            <FaUserGroup className="text-slate-400" /> {item.seats}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg Inter">
                                            <FaGasPump className="text-slate-400" /> {item.fuel}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg Inter">
                                            <FaHelmetSafety className="text-slate-400" /> {item.helmet}
                                        </div>
                                    </div>

                                    {/* Pricing & CTA */}
                                    <div className="pt-6 border-t border-slate-50">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1 Inter">RENTAL PRICE / DAY</p>
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-2xl font-bold text-slate-900 Mont">₹{item.price}<span className="text-sm font-medium text-slate-400 font-sans">/day</span></h4>
                                            <button className="bg-slate-50 text-slate-900 border border-slate-200 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors Mont">
                                                View Details
                                            </button>
                                        </div>
                                        <button className="w-full mt-4 bg-emerald-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 Mont">
                                            <FaWhatsapp size={18} /> Book via WhatsApp
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Footor />
        </div>
    );
};
export default RentalsPage;
