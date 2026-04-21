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
import MetaBalls from '@/components/Discovery/MetaBalls';

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
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(1deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes float-slow {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(-1deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-slow {
                    animation: float-slow 8s ease-in-out infinite;
                }
            `}</style>
            <Header forceWhite={true} />

            {/* Premium Dark Bento Hero Section - BOX TYPE */}
            <div className="px-3 md:px-4 py-3 bg-white">
                <section className="relative h-[65vh] min-h-[550px] bg-[#000] rounded-[24px] overflow-hidden flex flex-col justify-between pt-24 pb-12 px-8 md:px-16 transition-all duration-500">
                    
                    {/* Background Decor */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/15 blur-[100px] rounded-full pointer-events-none" />
                    
                    {/* Dynamic MetaBalls Background */}
                    <div className="absolute inset-y-0 right-0 w-full md:w-[60%] z-0 opacity-60">
                        <MetaBalls 
                            color="#10b981"
                            cursorBallColor="#34d399"
                            cursorBallSize={2.5}
                            ballCount={20}
                            animationSize={20}
                            enableMouseInteraction={true}
                            enableTransparency={true}
                            hoverSmoothness={0.03}
                            clumpFactor={1.2}
                            speed={0.4}
                        />
                    </div>
                    


                    {/* Randomly Positioned Bento Boxes with animations */}
                    <div className="absolute top-[20%] right-[10%] z-20 hidden md:block animate-float" data-aos="zoom-in" data-aos-delay="400">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] w-48 shadow-2xl">
                            <span className="text-3xl font-bold text-white mb-2 block Mont">320+</span>
                            <h3 className="text-sm font-bold text-white mb-1 Mont">Trips Shared</h3>
                            <p className="text-[10px] text-white/40 Inter leading-tight">
                                Join the circle of real explorers.
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-[35%] right-[25%] z-20 hidden lg:block animate-float-slow" data-aos="zoom-in" data-aos-delay="600">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] w-48 shadow-2xl">
                            <span className="text-3xl font-bold text-white mb-2 block Mont">99%</span>
                            <h3 className="text-sm font-bold text-white mb-1 Mont">Happy Travelers</h3>
                            <p className="text-[10px] text-white/40 Inter leading-tight">
                                Community-sourced authentic insights.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-[1400px] mx-auto w-full flex-1 flex flex-col justify-between relative z-10">
                        
                        {/* Top Section: Typography */}
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                            <div className="max-w-2xl">
                                <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-white Mont leading-[1] tracking-tight mb-6" data-aos="fade-right">
                                    Stories that <br />
                                    <span className="italic font-serif text-emerald-500 text-[1.1em]">Escape</span> the <br />
                                    Ordinary
                                </h1>
                            </div>
                        </div>

                        {/* Mobile view of boxes (visible only on mobile) */}
                        <div className="flex flex-row gap-4 md:hidden mb-8">
                             <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-[1.5rem] flex-1">
                                <span className="text-2xl font-bold text-white block Mont">320+</span>
                                <span className="text-[10px] text-white/50 Mont font-bold uppercase">Trips</span>
                             </div>
                             <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-[1.5rem] flex-1">
                                <span className="text-2xl font-bold text-white block Mont">99%</span>
                                <span className="text-[10px] text-white/50 Mont font-bold uppercase">Happy</span>
                             </div>
                        </div>

                        {/* Bottom Section: Search Bar & Share Button side-by-side */}
                        <div className="flex flex-col md:flex-row items-end gap-4 mt-8">
                            <div className="w-full max-w-lg" data-aos="fade-up" data-aos-delay="800">
                                <label className="block text-white/30 text-[9px] font-bold uppercase tracking-[0.2em] mb-3 ml-2">Discover Journals</label>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="relative group flex-1 min-w-[280px]">
                                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-500 transition-colors" size={16} />
                                        <input 
                                            type="text" 
                                            placeholder="Where to? Search location..."
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all font-medium text-sm placeholder:text-white/20"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <button 
                                        onClick={() => route('/travoxa-discovery/travel-journals/create')}
                                        className="bg-emerald-600 text-white px-6 py-4 rounded-2xl font-bold text-xs flex items-center gap-2 hover:bg-emerald-500 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-95 whitespace-nowrap"
                                        data-aos="fade-up" data-aos-delay="1000"
                                    >
                                        <FiPlus size={18} /> SHARE JOURNEY
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aesthetic Detail Box at bottom right */}
                    <div className="absolute bottom-8 right-12 text-right hidden xl:block opacity-10 pointer-events-none" data-aos="fade-in" data-aos-delay="1200">
                         <p className="text-[9px] font-bold text-white uppercase tracking-[0.4em] mb-1">Discovery Protocol</p>
                         <p className="text-[8px] text-white/50 Inter">CURATED EXPERIENCES / TRAVEL JOURNALS</p>
                    </div>
                </section>
            </div>

            {/* Filter Bar */}
            <div className="sticky top-[80px] z-[80] bg-white/80 backdrop-blur-xl border-y border-slate-100 py-4 mb-12">
                <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${activeFilter === f ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button className="hidden md:flex items-center gap-2 text-slate-600 font-bold text-xs hover:text-emerald-600 transition-colors">
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

            <div className="relative z-[90] bg-[#fcfdfd]">
                <Footer />
            </div>
        </div>
    );
};

export default TravelJournalsPage;
