"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { FiSearch, FiFileText, FiZap, FiArrowRight, FiInfo, FiCheck } from "react-icons/fi";
import { MdTrain, MdFlight, MdDirectionsBus } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export default function BookingPage() {
    const [activeTab, setActiveTab] = useState("train");
    const [showModal, setShowModal] = useState(false);

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        setShowModal(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />
            
            <main className="flex-grow pt-28 pb-12 px-4 md:px-8">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 Mont">
                        Seamless Travel, <span className="text-green-600">Premium Experience</span>
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto Inter">
                        Experience India's fastest personalized booking service. From rail to sky, we handle the complexity while you enjoy the journey.
                    </p>
                </div>

                {/* Main Booking Hub */}
                <div className="max-w-4xl mx-auto">
                    
                    {/* Tab Selector */}
                    <div className="flex p-1.5 bg-white shadow-sm border border-slate-200 rounded-2xl gap-2 mb-8 max-w-md mx-auto">
                        <button 
                            onClick={() => setActiveTab('train')} 
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'train' ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <MdTrain className="w-4 h-4" /> Train
                        </button>
                        <button 
                            onClick={() => setActiveTab('bus')} 
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'bus' ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <MdDirectionsBus className="w-4 h-4" /> Bus
                        </button>
                        <button 
                            onClick={() => setActiveTab('flight')} 
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === 'flight' ? 'bg-green-600 text-white shadow-md shadow-green-200' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <MdFlight className="w-4 h-4" /> Flight
                        </button>
                    </div>

                    {/* Content Container */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'train' && (
                            <motion.div 
                                key="train"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-green-300 transition-colors shadow-sm">
                                        <div className="text-green-600 mb-2"><FiSearch className="w-5 h-5" /></div>
                                        <h4 className="font-semibold text-sm mb-1 text-slate-800">Live Availability</h4>
                                        <p className="text-xs text-slate-500">Real-time seat tracking coming soon.</p>
                                    </div>
                                    <div className="bg-white border border-slate-200 p-5 rounded-2xl hover:border-green-300 transition-colors shadow-sm">
                                        <div className="text-green-600 mb-2"><FiFileText className="w-5 h-5" /></div>
                                        <h4 className="font-semibold text-sm mb-1 text-slate-800">PNR Status</h4>
                                        <p className="text-xs text-slate-500">Check your booking status instantly.</p>
                                    </div>
                                    <div className="bg-white border border-green-200 p-5 rounded-2xl hover:border-green-400 transition-colors shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-green-50 px-2 py-1 text-[8px] font-bold text-green-600 rounded-bl-lg uppercase">Hot</div>
                                        <div className="text-orange-500 mb-2"><FiZap className="w-5 h-5" /></div>
                                        <h4 className="font-semibold text-sm mb-1 text-slate-800">Tatkal Special</h4>
                                        <p className="text-xs text-slate-500">99% success rate in peak hours.</p>
                                    </div>
                                </div>

                                <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-lg shadow-slate-200/50">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-1 text-slate-900 Mont">Book Your Journey</h2>
                                            <p className="text-sm text-slate-500">Enter details to request a premium booking.</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100 font-semibold uppercase tracking-wider">Promo Active</span>
                                            <p className="text-[10px] text-slate-400 mt-2 italic">First 100 users book for FREE*</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleBooking} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-4 text-slate-900">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 uppercase ml-1">From Station</label>
                                                <input type="text" placeholder="Departure City" className="w-full px-4 py-3 rounded-xl mt-1 text-sm border border-slate-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 uppercase ml-1">To Station</label>
                                                <input type="text" placeholder="Destination City" className="w-full px-4 py-3 rounded-xl mt-1 text-sm border border-slate-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all" />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-4 text-slate-900">
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Travel Date</label>
                                                <input type="date" className="w-full px-4 py-3 rounded-xl mt-1 text-sm border border-slate-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Quota</label>
                                                <select className="w-full px-4 py-3 rounded-xl mt-1 text-sm border border-slate-200 focus:border-green-500 outline-none">
                                                    <option>General Quota</option>
                                                    <option>Ladies Quota</option>
                                                    <option>Tatkal Quota</option>
                                                    <option>Premium Tatkal</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Preferred Time</label>
                                                <select className="w-full px-4 py-3 rounded-xl mt-1 text-sm border border-slate-200 focus:border-green-500 outline-none">
                                                    <option>Any Time</option>
                                                    <option>Morning (6AM - 12PM)</option>
                                                    <option>Afternoon (12PM - 6PM)</option>
                                                    <option>Night (6PM - 6AM)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-semibold text-slate-400 uppercase ml-1">Travel Class</label>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {['1A', '2A', '3A', 'SL', 'CC', '2S'].map((cls) => (
                                                    <button key={cls} type="button" className={`px-4 py-2 rounded-lg text-xs transition-all border ${cls === '3A' ? 'bg-green-600 text-white border-green-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-green-400'}`}>
                                                        {cls}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 text-slate-900">
                                            <div>
                                                <label className="text-[10px] font-semibold text-slate-400 uppercase">Adults (Male)</label>
                                                <input type="number" defaultValue="0" min="0" className="w-full px-4 py-3 rounded-xl mt-1 text-sm text-center border border-slate-200 focus:border-green-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-semibold text-slate-400 uppercase">Adults (Female)</label>
                                                <input type="number" defaultValue="0" min="0" className="w-full px-4 py-3 rounded-xl mt-1 text-sm text-center border border-slate-200 focus:border-green-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-semibold text-slate-400 uppercase">Infants</label>
                                                <input type="number" defaultValue="0" min="0" className="w-full px-4 py-3 rounded-xl mt-1 text-sm text-center border border-slate-200 focus:border-green-500 outline-none" />
                                            </div>
                                        </div>

                                        <button type="submit" className="w-full bg-green-600 py-4 rounded-xl font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                                            Send Booking Request <FiArrowRight className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'bus' && (
                            <motion.div 
                                key="bus"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white border border-slate-200 p-8 rounded-3xl shadow-lg shadow-slate-200/50"
                            >
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 Mont">
                                    <MdDirectionsBus className="text-green-600" /> Bus Travel Concierge
                                </h2>
                                <form onSubmit={handleBooking} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="From Station" className="px-4 py-3 rounded-xl text-sm border border-slate-200 focus:border-green-500 outline-none" />
                                        <input type="text" placeholder="To Station" className="px-4 py-3 rounded-xl text-sm border border-slate-200 focus:border-green-500 outline-none" />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input type="date" className="px-4 py-3 rounded-xl text-sm border border-slate-200 focus:border-green-500 outline-none" />
                                        <select className="px-4 py-3 rounded-xl text-sm border border-slate-200 focus:border-green-500 outline-none">
                                            <option>Any Departure Time</option>
                                            <option>Morning</option>
                                            <option>Evening</option>
                                            <option>Night</option>
                                        </select>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-slate-400 ml-1">Bus Type</label>
                                            <div className="flex gap-2 mt-1">
                                                <button type="button" className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold">AC</button>
                                                <button type="button" className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs border border-slate-200">Non-AC</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-400 ml-1">Seat Preference</label>
                                            <div className="flex gap-2 mt-1">
                                                <button type="button" className="flex-1 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold">Sleeper</button>
                                                <button type="button" className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-xs border border-slate-200">Seater</button>
                                            </div>
                                        </div>
                                    </div>
                                    <textarea placeholder="Tell us if you have any special requirements (e.g., preferred operator, specific seat number...)" className="w-full px-4 py-3 rounded-xl text-sm h-32 border border-slate-200 focus:border-green-500 outline-none"></textarea>
                                    <button type="submit" className="w-full bg-green-600 py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:bg-green-700">Submit Bus Request</button>
                                </form>
                            </motion.div>
                        )}

                        {activeTab === 'flight' && (
                            <motion.div 
                                key="flight"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white border border-green-100 p-8 rounded-3xl shadow-lg shadow-green-200/20"
                            >
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-slate-900 Mont">
                                    <MdFlight className="text-green-600" /> Premium Flight Booking
                                </h2>
                                <form onSubmit={handleBooking} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Source Airport (Code)" className="px-4 py-3 rounded-xl text-sm border border-slate-200 focus:border-green-500 outline-none" />
                                        <input type="text" placeholder="Destination Airport (Code)" className="px-4 py-3 rounded-xl text-sm border border-slate-200 focus:border-green-500 outline-none" />
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <input type="date" className="px-4 py-3 rounded-xl text-sm border border-slate-200 focus:border-green-500 outline-none" />
                                        <input type="number" placeholder="Adults" className="px-4 py-3 rounded-xl text-sm border border-slate-200 focus:border-green-500 outline-none" />
                                        <input type="number" placeholder="Children" className="px-4 py-3 rounded-xl text-sm border border-slate-200 focus:border-green-500 outline-none" />
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                        <p className="text-sm text-green-800 flex items-center gap-2">
                                            <FiInfo className="w-4 h-4 flex-shrink-0" /> 
                                            Premium support included: Handled by our flight specialists.
                                        </p>
                                    </div>
                                    <button type="submit" className="w-full bg-green-600 py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:bg-green-700">Request Flight Quote</button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Note */}
                    <div className="mt-12 text-center text-slate-400 text-xs flex flex-col items-center gap-4">
                        <div className="flex flex-wrap justify-center gap-8">
                            <div className="flex items-center gap-2">Secure Payments</div>
                            <div className="flex items-center gap-2">24/7 Support</div>
                            <div className="flex items-center gap-2">Instant Response</div>
                        </div>
                        <p>© 2024 Travoxa Premium Concierge. All rights reserved.</p>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white max-w-sm w-full p-8 rounded-3xl text-center shadow-2xl"
                        >
                            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                                <FiCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-slate-900 Mont">Request Submitted!</h3>
                            <p className="text-sm text-slate-500 mb-6 Inter">Our travel concierge will contact you within the next 5-10 minutes to confirm your booking.</p>
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-all"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
