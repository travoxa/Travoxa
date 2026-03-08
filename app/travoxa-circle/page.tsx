"use client";

import React, { useState } from 'react';
import Header from '@/components/ui/Header';

const TravoxaCirclePage = () => {
    const [email, setEmail] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const res = await fetch('/api/circle-waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
                setEmail("");
            } else {
                setStatus('error');
                setMessage(data.error || "Something went wrong.");
            }
        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage("Failed to connect to the server.");
        }
    };

    return (
        <div className="bg-white h-screen w-screen overflow-hidden font-sans selection:bg-emerald-100 relative flex flex-col">
            <div className="absolute top-0 left-0 w-full z-50">
                <Header />
            </div>

            <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
                {/* Left Side: Large Circle */}
                <div className="relative group flex items-center justify-center w-full md:w-1/2">
                    {/* Subtle Shadow effect */}
                    <div className="absolute inset-0 rounded-full bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all duration-700"></div>

                    {/* The Circle */}
                    <div className="w-[280px] h-[280px] md:w-[35vw] md:h-[35vw] max-w-[450px] max-h-[450px] rounded-full border border-black flex items-center justify-center relative bg-zinc-50/50 shadow-sm transition-transform duration-700 group-hover:scale-[1.01]">
                        <span className="text-[120px] md:text-[180px] lg:text-[220px] font-extralight text-black Mont leading-none select-none">
                            3
                        </span>

                        {/* Spinning border element */}
                        <div className="absolute inset-[-1px] rounded-full border-t border-r border-emerald-500/20 animate-[spin_12s_linear_infinite]"></div>
                    </div>
                </div>

                {/* Right Side: Content */}
                <div className="w-full md:w-1/2 flex flex-col items-start text-left max-w-xl">
                    <div className="inline-flex items-center gap-2 text-emerald-600 text-[10px] font-medium px-4 py-1.5 rounded-full uppercase tracking-[0.3em] mb-6 Mont bg-zinc-50 border border-zinc-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Coming in Phase 3
                    </div>

                    <h1 className="text-[2.4rem] md:text-[3.6rem] lg:text-[4.8rem] font-bold text-black leading-[0.85] tracking-tighter Mont uppercase mb-8">
                        The Social <br />
                        Revolution
                    </h1>

                    <p className="text-zinc-500 text-sm md:text-base mb-12 Inter font-light leading-relaxed max-w-sm">
                        A dedicated social ecosystem where every traveler has a voice, a community, and a journey to share.
                    </p>

                    <div className="min-h-[80px] w-full flex items-center justify-start">
                        {!showInput ? (
                            <button
                                onClick={() => setShowInput(true)}
                                className="group relative bg-black text-white px-12 py-4 rounded-full font-medium Mont text-xs uppercase tracking-widest transition-all duration-500 shadow-xl overflow-hidden"
                            >
                                <span className="relative z-10">Join the Waitlist</span>
                                <div className="absolute inset-y-0 left-0 w-0 bg-emerald-600 group-hover:w-full transition-all duration-500 ease-out z-0"></div>
                            </button>
                        ) : (
                            <div className="flex flex-col items-start w-full">
                                {status === 'success' ? (
                                    <div className="text-emerald-600 font-medium Mont text-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        {message}
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3 w-full animate-in fade-in slide-in-from-left-4 duration-700">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (status === 'error') setStatus('idle');
                                            }}
                                            placeholder="your@email.com"
                                            className={`w-full sm:w-80 px-6 py-4 rounded-full bg-zinc-50 border ${status === 'error' ? 'border-red-500' : 'border-zinc-200'} text-black Inter placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500/50 transition-all text-sm font-light`}
                                            disabled={status === 'loading'}
                                            autoFocus
                                        />
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full sm:w-auto bg-emerald-500 text-white px-10 py-4 rounded-full font-medium Mont text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {status === 'loading' ? 'Joining...' : 'Join'}
                                        </button>
                                    </form>
                                )}
                                {status === 'error' && (
                                    <p className="text-red-500 text-[10px] mt-2 ml-4 Mont uppercase tracking-wider">
                                        {message}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TravoxaCirclePage;
