'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import EmergencyCard from '@/components/Pages/Emergency/EmergencyCard';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaHospital, FaShieldAlt, FaAmbulance, FaFireExtinguisher, FaTaxi } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface EmergencyHelpClientProps {
    initialHelplines: any[];
}

const EmergencyHelpClient: React.FC<EmergencyHelpClientProps> = ({ initialHelplines }) => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-out-cubic'
        });
    }, []);

    const [searchLocation, setSearchLocation] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [filteredHelplines, setFilteredHelplines] = useState(initialHelplines);

    useEffect(() => {
        let results = initialHelplines;

        if (searchLocation) {
            results = results.filter(h =>
                h.city.toLowerCase().includes(searchLocation.toLowerCase()) ||
                h.state.toLowerCase().includes(searchLocation.toLowerCase())
            );
        }

        if (selectedType !== 'All') {
            results = results.filter(h => h.emergencyType === selectedType);
        }

        setFilteredHelplines(results);
    }, [searchLocation, selectedType, initialHelplines]);

    const emergencyTypes = [
        { name: 'All', icon: <FaFilter /> },
        { name: 'Hospital', icon: <FaHospital /> },
        { name: 'Police', icon: <FaShieldAlt /> },
        { name: 'Ambulance', icon: <FaAmbulance /> },
        { name: 'Fire', icon: <FaFireExtinguisher /> },
        { name: 'Taxi', icon: <FaTaxi /> },
    ];

    return (
        <div className="bg-white min-h-screen font-sans">
            <Header forceWhite={true} />

            {/* Hero Section */}
            <div className="relative mx-[12px] mt-[12px] rounded-[12px] h-[65vh] min-h-[550px] overflow-hidden flex flex-col justify-between pt-24 pb-12 px-8 md:px-16 transition-all duration-500 bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
                    </div>
                </div>

                {/* Content Overlay */}
                <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col justify-between relative z-10">
                    
                    {/* Top Section: Typography */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                        <div className="max-w-2xl">
                            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-white Mont leading-[1] tracking-tight mb-6 drop-shadow-sm" data-aos="fade-right">
                                Emergency <br />
                                <span className="italic font-serif text-rose-500 text-[1.1em]">& Help</span>
                            </h1>
                            <p className="text-slate-400 text-sm md:text-base max-w-xl Inter" data-aos="fade-up" data-aos-delay="100">
                                Quick access to verified emergency services, hospitals, and helplines across your destination.
                            </p>
                        </div>
                    </div>

                    {/* Bottom Section: Search Bar */}
                    <div className="flex flex-col md:flex-row items-end gap-4 mt-8">
                        <div className="w-full max-w-4xl" data-aos="fade-up" data-aos-delay="200">
                            <label className="block text-slate-500 text-[9px] font-bold uppercase tracking-[0.2em] mb-3 ml-2">Discover Emergency Services</label>
                            <div className="w-full bg-white/10 backdrop-blur-md rounded-full p-2.5 flex flex-col md:flex-row gap-1 items-center border border-white/10 hover:border-rose-500/30 transition-colors shadow-lg">

                                <div className="flex-1 w-full relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-rose-500 transition-colors">
                                        <FaMapMarkerAlt size={10} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search by Location (e.g. Varanasi)"
                                        className="w-full h-9 pl-10 pr-6 rounded-full bg-transparent hover:bg-white/5 border-none text-white text-xs font-light focus:outline-none focus:ring-0 placeholder:text-slate-400 cursor-text transition-colors"
                                        value={searchLocation}
                                        onChange={(e) => setSearchLocation(e.target.value)}
                                    />
                                </div>

                                <div className="h-5 w-[1px] bg-white/10 hidden md:block"></div>

                                <div className="flex-1 w-full relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-rose-500 transition-colors">
                                        <FaSearch size={10} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Hospital, Police, Fire..."
                                        className="w-full h-9 pl-10 pr-6 rounded-full bg-transparent hover:bg-white/5 border-none text-white text-xs font-light focus:outline-none focus:ring-0 placeholder:text-slate-400 cursor-text transition-colors"
                                    />
                                </div>

                                <button className="w-full md:w-auto h-9 px-6 bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-medium rounded-full transition-all flex items-center justify-center gap-2 active:scale-95 uppercase tracking-wide ml-1 shadow-md">
                                    <FaSearch size={8} />
                                    Find Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Aesthetic Detail Box at bottom right */}
                <div className="absolute bottom-8 right-12 text-right hidden xl:block opacity-30 pointer-events-none" data-aos="fade-in" data-aos-delay="1200">
                    <p className="text-[9px] font-bold text-white uppercase tracking-[0.4em] mb-1">Discovery Protocol</p>
                    <p className="text-[8px] text-slate-400 Inter">CRITICAL SERVICES / EMERGENCY</p>
                </div>
            </div>

            {/* Filters & Results */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Type Filters */}
                <div className="flex flex-wrap gap-3 mb-12 justify-center" data-aos="fade-up">
                    {emergencyTypes.map((type) => (
                        <button
                            key={type.name}
                            onClick={() => setSelectedType(type.name)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border Inter ${selectedType === type.name
                                    ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-100 scale-105'
                                    : 'bg-white text-slate-600 border-slate-100 hover:border-slate-300'
                                }`}
                        >
                            <span className={selectedType === type.name ? 'text-white' : 'text-slate-400'}>{type.icon}</span>
                            {type.name}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 Mont">
                        {selectedType === 'All' ? 'Available Services' : `${selectedType} Services`}
                        <span className="text-sm font-normal text-slate-500 ml-2 Inter">({filteredHelplines.length} verified packages)</span>
                    </h2>
                </div>

                {filteredHelplines.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredHelplines.map((h, index) => (
                            <div key={h._id} data-aos="fade-up" data-aos-delay={index * 50}>
                                <EmergencyCard helpline={h} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200" data-aos="zoom-in">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6 shadow-sm">
                            <FaFilter size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 Mont mb-2">No matching services found</h3>
                        <p className="text-slate-500 Inter mb-8">Try adjusting your search location or selecting a different category.</p>
                        <button
                            onClick={() => { setSearchLocation(''); setSelectedType('All'); }}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors Inter"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default EmergencyHelpClient;
