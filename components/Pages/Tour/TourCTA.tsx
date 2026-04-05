"use client";

import { useState } from "react";
import { HiOutlineChatAlt2, HiOutlinePhone, HiOutlineSparkles, HiX, HiCheck } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_INFO } from "@/config/contact";

export default function TourCTA() {
    const phoneNumber = CONTACT_INFO.phones.whatsapp;
    const displayPhoneNumber = CONTACT_INFO.phones.primary;
    const whatsappMessage = encodeURIComponent("Hi Travoxa, I'm interested in a custom tour package. Can you help me plan my trip?");

    const [modal, setModal] = useState<{ open: boolean; type: 'call' | 'whatsapp' | null }>({
        open: false,
        type: null
    });
    const [copied, setCopied] = useState(false);

    const scrollToForm = () => {
        const element = document.getElementById("customize-form");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(displayPhoneNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="mx-auto max-w-7xl px-4 md:px-8 py-16">
            <div className="relative rounded-[40px] overflow-hidden p-8 md:p-16 border border-white/10 shadow-2xl bg-black">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-emerald-950/80" />
                    
                    {/* Animated Glows */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/10 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-bold tracking-[3px] uppercase mb-8 shadow-sm">
                        <HiOutlineSparkles className="text-yellow-400 animate-pulse" />
                        Tailor-Made Journey
                    </span>
                    
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                        Can't find your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">perfect</span> package?
                    </h2>
                    
                    <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed font-light Inter max-w-2xl">
                        Our travel experts are ready to curate a unique itinerary just for you. 
                        Tell us where you want to go, and we'll handle the rest.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                        <button
                            onClick={scrollToForm}
                            className="group relative px-8 py-5 bg-white text-black font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            <HiOutlineSparkles className="text-xl group-hover:scale-125 transition-transform" />
                            <span>Customize Trip</span>
                        </button>

                        <button
                            onClick={() => setModal({ open: true, type: 'whatsapp' })}
                            className="group px-8 py-5 bg-[#25D366] text-white font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(37,211,102,0.2)]"
                        >
                            <HiOutlineChatAlt2 className="text-xl group-hover:rotate-12 transition-transform" />
                            <span>WhatsApp Us</span>
                        </button>

                        <button
                            onClick={() => setModal({ open: true, type: 'call' })}
                            className="group px-8 py-5 bg-white/5 backdrop-blur-md border border-white/20 text-white font-bold rounded-2xl transition-all hover:bg-white/10 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                        >
                            <HiOutlinePhone className="text-xl group-hover:scale-110 transition-transform" />
                            <span>Call Expert</span>
                        </button>
                    </div>
                    
                    <div className="mt-10 flex items-center gap-2 text-gray-400 text-sm italic opacity-60">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Available for consultation 24/7
                    </div>
                </div>
            </div>

            {/* Contact Modal */}
            <AnimatePresence>
                {modal.open && (
                    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setModal({ open: false, type: null })}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl p-8 text-center"
                        >
                            <button 
                                onClick={() => setModal({ open: false, type: null })}
                                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <HiX className="text-gray-400" />
                            </button>

                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white ${modal.type === 'whatsapp' ? 'bg-[#25D366]' : 'bg-black'}`}>
                                {modal.type === 'whatsapp' ? <HiOutlineChatAlt2 size={40} /> : <HiOutlinePhone size={40} />}
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Connect with us</h3>
                            <p className="text-gray-500 mb-6 font-light">Direct connection for faster response</p>

                            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between mb-8 group cursor-pointer hover:bg-gray-100 transition-colors" onClick={handleCopy}>
                                <div className="text-left">
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Contact Number</p>
                                    <p className="text-lg font-bold text-black">{displayPhoneNumber}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${copied ? 'bg-green-100 text-green-600' : 'bg-black text-white group-hover:bg-gray-800'}`}>
                                    {copied ? (
                                        <span className="flex items-center gap-1"><HiCheck /> COPIED</span>
                                    ) : (
                                        'COPY'
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-center gap-2 py-2 px-3 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    OUR TEAM IS ONLINE NOW
                                </div>
                                <p className="text-[10px] text-gray-400">Available: Mon - Sat, 10:00 AM - 8:00 PM IST</p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 mt-8">
                                <a 
                                    href={modal.type === 'whatsapp' ? `https://wa.me/${phoneNumber}?text=${whatsappMessage}` : `tel:+${phoneNumber}`}
                                    className={`py-4 rounded-[18px] text-white font-bold transition-all hover:scale-[1.02] active:scale-95 ${modal.type === 'whatsapp' ? 'bg-[#25D366]' : 'bg-black'}`}
                                >
                                    Proceed to {modal.type === 'whatsapp' ? 'WhatsApp' : 'Call'}
                                </a>
                                <button 
                                    onClick={() => setModal({ open: false, type: null })}
                                    className="py-3 text-gray-400 text-sm hover:underline"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
