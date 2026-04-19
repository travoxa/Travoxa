"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import Timeline from '@/components/Discovery/Timeline';
import { FiHeart, FiBookmark, FiShare2, FiArrowLeft, FiClock, FiMapPin, FiInstagram, FiCheck } from 'react-icons/fi';
import { route } from '@/lib/route';
import { useSession } from 'next-auth/react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const JournalDetailPage = () => {
    const { id } = useParams();
    const { data: session } = useSession();
    const [journal, setJournal] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
        if (id) fetchJournal();
    }, [id]);

    const fetchJournal = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/travel-journals/${id}`);
            const data = await res.json();
            if (data.success) {
                setJournal(data.data);
                setIsLiked(data.data.likes?.includes(session?.user?.email));
            }
        } catch (error) {
            console.error("Failed to fetch journal details:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!session) return alert("Please login to like journals");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/travel-journals/${id}/like`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${session.user?.email}` }
            });
            const data = await res.json();
            if (data.success) {
                setIsLiked(!isLiked);
                setJournal({ ...journal, likes: data.likes });
            }
        } catch (error) {
            console.error("Like failed:", error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!journal) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Journal not found</h2>
            <button onClick={() => route('/travoxa-discovery/travel-journals')} className="text-emerald-600 font-bold">Back to Feed</button>
        </div>
    );

    const coverImage = journal.igLink ? (journal.image || '/journal-placeholder.webp') : (journal.steps?.[0]?.images?.[0] || '/journal-placeholder.webp');

    return (
        <div className="bg-[#fcfdfd] min-h-screen font-sans">
            <Header forceWhite={false} />

            {/* Premium Header/Hero */}
            <header className="relative h-[80vh] w-full overflow-hidden">
                <img 
                    src={coverImage} 
                    alt={journal.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                
                {/* Floating Actions */}
                <div className="absolute top-32 left-6 z-20">
                     <button 
                        onClick={() => route('/travoxa-discovery/travel-journals')}
                        className="p-3 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 transition-all border border-white/20"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                </div>

                <div className="absolute bottom-16 left-0 w-full px-6 md:px-12 z-10">
                    <div className="max-w-[1400px] mx-auto">
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-emerald-500 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-emerald-500/20">
                                {journal.tripType}
                            </span>
                            <div className="flex items-center gap-2 text-white/80 text-sm font-medium">
                                <FiClock size={16} /> {journal.duration || 'Flexible'}
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white Mont mb-6 max-w-4xl leading-tight">
                            {journal.title}
                        </h1>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                                    <img 
                                        src={journal.author?.image || `https://ui-avatars.com/api/?name=${journal.author?.name}&background=random`} 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-white">
                                    <p className="text-sm font-bold Mont tracking-wide">Shared by {journal.author?.name}</p>
                                    <p className="text-xs text-white/60 Inter">{new Date(journal.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handleLike}
                                    className={`p-4 rounded-full transition-all border ${isLiked ? 'bg-red-500 border-red-500 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
                                >
                                    <FiHeart size={20} fill={isLiked ? "currentColor" : "none"} />
                                </button>
                                <button className="p-4 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all">
                                    <FiBookmark size={20} />
                                </button>
                                <button className="p-4 bg-white text-slate-900 rounded-full hover:bg-emerald-500 hover:text-white transition-all shadow-xl">
                                    <FiShare2 size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Overview / Standalone Reel */}
            <section className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-2xl font-bold text-slate-900 Mont mb-6">Trip Overview</h2>
                    <p className="text-xl text-slate-600 Inter leading-relaxed italic">
                        "{journal.description}"
                    </p>
                </div>

                {journal.igLink && (
                    <div className="mb-20" data-aos="fade-up">
                        <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-[2rem] border border-pink-100 flex flex-col items-center gap-6">
                            <FiInstagram size={40} className="text-pink-600" />
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Watch the Reel</h3>
                                <p className="text-slate-500 text-sm mb-6">This trip has a standalone reel shared by the author.</p>
                                <a 
                                    href={journal.igLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg transition-all"
                                >
                                    View on Instagram <FiShare2 size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                <div className="h-[2px] w-40 bg-emerald-100 mx-auto" />
            </section>

            {/* The Timeline */}
            <section className="max-w-[1400px] mx-auto px-6 pb-40">
                <div className="text-center mb-12">
                     <h2 className="text-xs font-bold text-emerald-600 tracking-[0.3em] uppercase mb-4">Trip Timeline</h2>
                     <div className="w-12 h-1 bg-emerald-600 mx-auto" />
                </div>
                <Timeline steps={journal.steps} />
                
                {/* Final Destination / End of Story */}
                <div className="text-center mt-20" data-aos="zoom-in">
                    <div className="w-20 h-20 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-200">
                        <FiCheck size={32} />
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900 Mont mb-4">End of Story</h3>
                    <p className="text-slate-500 Inter mb-10 max-w-lg mx-auto">
                        "{journal.author?.name} finished this trip with memories for a lifetime. Start yours today."
                    </p>
                    <button 
                         onClick={() => route('/tour')}
                         className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-100"
                    >
                        Explore Similar Tours
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default JournalDetailPage;
