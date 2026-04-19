"use client";

import React, { useState, useEffect } from 'react';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import TravelJournalCard from '@/components/Discovery/TravelJournalCard';
import { FiPlus, FiFilter, FiSearch, FiBookOpen } from 'react-icons/fi';
import { route } from '@/lib/route';
import { useSession } from 'next-auth/react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TravelJournalsPage = () => {
    const { data: session } = useSession();
    const [journals, setJournals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        fetchJournals();
    }, []);

    const fetchJournals = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/travel-journals`);
            const data = await res.json();
            if (data.success) {
                setJournals(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch journals:", error);
        } finally {
            setLoading(false);
        }
    };

    const filters = ["All", "Adventurous", "Relaxing", "Family", "Solo", "Honeymoon"];

    const filteredJournals = journals.filter(j => {
        const matchesSearch = j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             j.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeFilter === "All" || j.tripType === activeFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="bg-[#fcfdfd] min-h-screen font-sans">
            <Header forceWhite={true} />

            {/* Premium Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-50/50 to-transparent -z-10" />
                <div className="max-w-[1400px] mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                        <FiBookOpen size={14} /> Discovery: Travel Journals
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 Mont mb-6 leading-tight" data-aos="fade-up">
                        Stories that <span className="text-emerald-600 italic">inspire</span> <br /> your next escape.
                    </h1>
                    <p className="text-lg text-slate-500 Inter max-w-2xl mx-auto mb-10" data-aos="fade-up" data-aos-delay="100">
                        Explore authentic trip experiences shared by the Travoxa community.
                        From hidden mountain trails to secret city cafes.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
                        <div className="relative w-full max-w-md">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search stories, locations..."
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-900"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => route('/travoxa-discovery/travel-journals/create')}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200"
                        >
                            <FiPlus size={20} /> Share your Story
                        </button>
                    </div>
                </div>
            </section>

            {/* Filter Bar */}
            <div className="sticky top-[80px] z-[80] bg-white/80 backdrop-blur-xl border-y border-slate-100 py-4 mb-12">
                <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeFilter === f ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-slate-600 font-bold text-sm hover:text-emerald-600 transition-colors">
                        <FiFilter size={18} /> Filters
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <main className="max-w-[1400px] mx-auto px-6 pb-32">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[450px] bg-slate-100 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                ) : filteredJournals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredJournals.map((journal, index) => (
                            <div key={journal._id} data-aos="fade-up" data-aos-delay={index * 100}>
                                <TravelJournalCard journal={journal} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiBookOpen size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 Mont mb-2">No stories found</h3>
                        <p className="text-slate-500 Inter mb-8">Try adjusting your search or be the first to share this trip!</p>
                        <button 
                             onClick={() => route('/travoxa-discovery/travel-journals/create')}
                             className="text-emerald-600 font-bold hover:underline flex items-center gap-2 mx-auto"
                        >
                            <FiPlus size={18} /> Create Journal
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default TravelJournalsPage;
