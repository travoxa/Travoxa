"use client";

import React from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import { FaPhone, FaHospital, FaShieldHalved } from 'react-icons/fa6';

const EmergencyHelpPage = () => {
    const contacts = [
        { title: "Police Control Room", number: "100", icon: <FaShieldHalved /> },
        { title: "Ambulance", number: "102", icon: <FaHospital /> },
        { title: "Women Helpline", number: "1091", icon: <FaPhone /> },
        { title: "Tourist Helpline", number: "1363", icon: <FaPhone /> },
    ];

    return (
        <div className="bg-white min-h-screen font-sans">
            <Header forceWhite={true} />

            <div className="pt-32 pb-20 max-w-4xl mx-auto px-4">
                <h1 className="text-4xl font-black text-slate-900 mb-4 Mont">Emergency Help</h1>
                <p className="text-slate-500 mb-12 Inter">Quick access to essential emergency numbers across India.</p>

                <div className="grid md:grid-cols-2 gap-6">
                    {contacts.map((c, i) => (
                        <div key={i} className="bg-red-50 p-6 rounded-2xl flex items-center justify-between border border-red-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-red-500 text-xl shadow-sm">
                                    {c.icon}
                                </div>
                                <h3 className="font-bold text-slate-900 Mont">{c.title}</h3>
                            </div>
                            <a href={`tel:${c.number}`} className="bg-red-500 text-white px-6 py-2 rounded-full font-bold hover:bg-red-600 transition-colors Mont">
                                {c.number}
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            <Footor />
        </div>
    );
};

export default EmergencyHelpPage;
