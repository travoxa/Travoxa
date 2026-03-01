'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
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
            <div className="pt-32 pb-20 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-rose-500 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 Mont" data-aos="fade-up">Emergency & Help</h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 Inter" data-aos="fade-up" data-aos-delay="100">
                        Quick access to verified emergency services, hospitals, and helplines across your destination.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2" data-aos="fade-up" data-aos-delay="200">
                        <div className="flex-1 flex items-center px-4 py-3 gap-3 border-b md:border-b-0 md:border-r border-slate-100">
                            <FaMapMarkerAlt className="text-rose-500" />
                            <input
                                type="text"
                                placeholder="Search by Location (e.g. Varanasi)"
                                className="w-full outline-none Inter font-medium text-slate-900 border-none"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                            />
                        </div>
                        <div className="flex-1 flex items-center px-4 py-3 gap-3">
                            <FaSearch className="text-slate-300" />
                            <input
                                type="text"
                                placeholder="Hospital, Police, Fire..."
                                className="w-full outline-none Inter font-medium text-slate-900 border-none"
                            // We use the type filter below but could also add text search here
                            />
                        </div>
                        <button className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-rose-600 transition-colors shadow-lg shadow-rose-200 Inter">
                            Find Now
                        </button>
                    </div>
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

            <Footor />
        </div>
    );
};

export default EmergencyHelpClient;
