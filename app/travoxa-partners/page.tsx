"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaYoutube, FaInstagram, FaFacebook, FaPenNib, FaVideo } from 'react-icons/fa';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TravoxaPartnersPage = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    return (
        <div className="bg-white font-sans relative">
            <Header forceWhite={true} />

            {/* Hero Section - Matching Global Design */}
            <div className="w-full flex justify-center items-center px-[12px] py-[12px]">
                <div className="w-full h-[47vh] lg:h-[97vh] bg-center bg-cover bg-no-repeat rounded-[12px] relative overflow-hidden" style={{ backgroundImage: "url('/home/tourist-places5.jpg')" }}>
                    {/* Content */}
                    <div className="w-full h-full flex flex-col justify-center items-center relative z-10">
                        <p className="text-center text-[10vw] lg:text-[12vw] font-bold text-white Mont tracking-wider text-shadow-blue-400 leading-none" data-aos="fade-down">
                            TRAVOXA <br /><span className="text-emerald-400">COLLAB</span>
                        </p>

                        <p className="text-center text-xl lg:text-3xl text-white font-medium Mont tracking-wide mt-8 mb-12 drop-shadow-md" data-aos="fade-up" data-aos-delay="100">
                            Where Creators Meet Travel Businesses.
                        </p>

                        <div className="flex flex-col justify-center items-center text-white gap-8" data-aos="fade-up" data-aos-delay="200">
                            <div className="flex flex-wrap justify-center gap-5">
                                <Link href="#join" className="bg-white text-black font-medium Mont px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
                                    Join Now
                                </Link>
                                <Link href="#connect" className="bg-white/20 border border-white/50 text-white font-medium Mont px-8 py-3 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 backdrop-blur-lg">
                                    Creators
                                </Link>
                                <Link href="#business" className="bg-white/20 border border-white/50 text-white font-medium Mont px-8 py-3 rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 backdrop-blur-lg">
                                    Businesses
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Creators Section */}
            <section className="py-24 bg-white" id="connect">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-16">
                        <span className="text-emerald-500 font-bold uppercase tracking-wider text-sm mb-4 block Mont">CREATORS</span>
                        <h2 className="text-4xl lg:text-6xl font-light text-slate-900 mb-6 Mont">Travel Smarter with Travoxa</h2>
                        <p className="text-slate-500 text-lg lg:text-xl leading-relaxed Inter max-w-3xl">
                            Whether you're an influencer, blogger, or video creator, you can travel in exchange for
                            high-quality content, authentic promotions, and long-term brand partnerships. We are
                            open to creators across all major platforms.
                        </p>
                    </div>

                    {/* Platform Icons */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-24">
                        {[
                            { icon: <FaYoutube />, label: "YOUTUBE CREATOR" },
                            { icon: <FaInstagram />, label: "INSTAGRAM CREATOR" },
                            { icon: <FaFacebook />, label: "FACEBOOK CREATOR" },
                            { icon: <FaPenNib />, label: "TRAVEL BLOGGER" },
                            { icon: <FaVideo />, label: "VIDEO CREATOR" },
                        ].map((item, index) => (
                            <div key={index} className="bg-white border border-slate-100 p-6 rounded-[24px] flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300 group">
                                <span className="text-4xl text-slate-700 mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                                <span className="font-bold text-xs uppercase tracking-wide text-slate-900 Mont">{item.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Benefits Grid */}
                    <div className="text-center mb-16">
                        <span className="text-emerald-500 font-bold uppercase tracking-wider text-sm mb-4 block Mont">BENEFITS FOR CREATORS</span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <div className="bg-slate-50 p-10 rounded-[32px] hover:bg-slate-100 transition-all duration-300">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🏠</div>
                            <h3 className="text-xl text-slate-900 mb-3 Mont">Free Stays</h3>
                            <p className="text-slate-500 Inter leading-relaxed text-sm">Access to premium hotels and homestays at zero cost in exchange for content.</p>
                        </div>
                        {/* Benefit 2 */}
                        <div className="bg-slate-50 p-10 rounded-[32px] hover:bg-slate-100 transition-all duration-300 relative overflow-hidden">
                            <span className="absolute top-4 right-4 bg-orange-100 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider Mont">FEATURED</span>
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">💰</div>
                            <h3 className="text-xl text-slate-900 mb-3 Mont">Paid Collaborations</h3>
                            <p className="text-slate-500 Inter leading-relaxed text-sm">Get paid for your creativity and reach on selected luxury brand campaigns.</p>
                        </div>
                        {/* Benefit 3 */}
                        <div className="bg-slate-50 p-10 rounded-[32px] hover:bg-slate-100 transition-all duration-300">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🎒</div>
                            <h3 className="text-xl text-slate-900 mb-3 Mont">Travel Packages</h3>
                            <p className="text-slate-500 Inter leading-relaxed text-sm">Complete tour packages covering transport, food, and local experiences.</p>
                        </div>
                        {/* Benefit 4 */}
                        <div className="bg-slate-50 p-10 rounded-[32px] hover:bg-slate-100 transition-all duration-300">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🤝</div>
                            <h3 className="text-xl text-slate-900 mb-3 Mont">Brand Partnerships</h3>
                            <p className="text-slate-500 Inter leading-relaxed text-sm">Opportunity for long-term exclusivity and ambassadorship with travel brands.</p>
                        </div>
                        {/* Benefit 5 */}
                        <div className="bg-slate-50 p-10 rounded-[32px] hover:bg-slate-100 transition-all duration-300">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">🌐</div>
                            <h3 className="text-xl text-slate-900 mb-3 Mont">Platform Feature</h3>
                            <p className="text-slate-500 Inter leading-relaxed text-sm">Get featured on Travoxa's main platform and reach a targeted traveler audience.</p>
                        </div>
                        {/* Benefit 6 */}
                        <div className="bg-slate-50 p-10 rounded-[32px] hover:bg-slate-100 transition-all duration-300 relative overflow-hidden">
                            <span className="absolute top-4 right-4 bg-orange-100 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider Mont">FEATURED</span>
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm">⭐</div>
                            <h3 className="text-xl text-slate-900 mb-3 Mont">Exclusive Trips</h3>
                            <p className="text-slate-500 Inter leading-relaxed text-sm">Join creator-only networking trips to offbeat locations across India.</p>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <Link href="#join-creator" className="inline-flex items-center gap-2 bg-slate-900 text-white px-10 py-4 rounded-full font-medium hover:bg-emerald-600 transition-colors shadow-xl">
                            Join as Creator <span className="text-xl">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Business Section */}
            <section className="py-24 bg-white border-t border-slate-100" id="business">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">

                        {/* Left Content */}
                        <div>
                            <span className="text-emerald-500 font-bold uppercase tracking-wider text-sm mb-4 block Mont">BUSINESS PARTNERS</span>
                            <h2 className="text-4xl lg:text-5xl font-light text-slate-900 mb-6 Mont tracking-tight">Businesses, Grow with Creators</h2>
                            <p className="text-slate-500 text-lg leading-relaxed Inter mb-10">
                                We partner with Hotels, Homestays, Cafés, Tour Agencies, and
                                Local Travel Brands. Connect with professional storytellers to
                                showcase your property or service to thousands of real travelers.
                            </p>

                            <div className="space-y-6">
                                {[
                                    "Paid promotions for direct ROI",
                                    "Barter deals (Stay/Food/Experience)",
                                    "Hybrid collaborations for maximum impact"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</div>
                                        <span className="text-slate-700 font-medium Inter">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Content */}
                        <div className="space-y-8">
                            {/* Card 1 */}
                            <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 hover:shadow-lg transition-all duration-300">
                                <h3 className="text-2xl text-slate-900 mb-4 Mont">Promote Your Business</h3>
                                <p className="text-slate-500 Inter mb-8 leading-relaxed text-sm">
                                    Reach real travelers through authentic influencer content and targeted travel audience strategy.
                                </p>
                                <Link href="#join-business" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-full font-medium text-sm hover:bg-emerald-600 transition-colors Mont">
                                    Partner with Travoxa
                                </Link>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 hover:shadow-lg transition-all duration-300">
                                <h3 className="text-2xl text-slate-900 mb-4 Mont">Host Creators</h3>
                                <p className="text-slate-500 Inter mb-8 leading-relaxed text-sm">
                                    Offer stays, food, or packages to get organic social promotion and long-term brand exposure.
                                </p>
                                <Link href="#join-business" className="inline-block bg-white text-slate-900 border border-slate-300 px-8 py-3 rounded-full font-medium text-sm hover:bg-slate-50 transition-colors Mont">
                                    Partner with Travoxa
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Simple Process */}
            <section className="py-32 bg-white" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <h2 className="text-center text-4xl lg:text-6xl font-light mb-20 Mont">Simple process</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="p-8 bg-slate-50 rounded-[32px] hover:bg-slate-100 transition-colors text-center">
                            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold mb-6 text-lg Mont mx-auto">1</div>
                            <h4 className="font-light text-xl mb-3 Mont">Apply</h4>
                            <p className="text-slate-600 Inter text-sm leading-relaxed">Join as a Creator or a Business Partner.</p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-[32px] hover:bg-slate-100 transition-colors text-center">
                            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold mb-6 text-lg Mont mx-auto">2</div>
                            <h4 className="font-light text-xl mb-3 Mont">Match</h4>
                            <p className="text-slate-600 Inter text-sm leading-relaxed">Get matched with the perfect partner via Travoxa.</p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-[32px] hover:bg-slate-100 transition-colors text-center">
                            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold mb-6 text-lg Mont mx-auto">3</div>
                            <h4 className="font-light text-xl mb-3 Mont">Collaborate</h4>
                            <p className="text-slate-600 Inter text-sm leading-relaxed">Create high-quality content and travel stories.</p>
                        </div>
                        <div className="p-8 bg-slate-50 rounded-[32px] hover:bg-slate-100 transition-colors text-center">
                            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center font-bold mb-6 text-lg Mont mx-auto">4</div>
                            <h4 className="font-light text-xl mb-3 Mont">Grow</h4>
                            <p className="text-slate-600 Inter text-sm leading-relaxed">Grow your brand and audience together.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-white" id="join">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-24 text-center text-white shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-emerald-500/5 -z-10"></div>
                        {/* Decorational blobs for CTA */}
                        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>

                        <h2 className="text-4xl lg:text-6xl font-light mb-8 Mont relative z-10">Let’s Build Travel Stories Together</h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 relative z-10">
                            <button className="bg-emerald-600 text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 Mont">
                                Join as Creator
                            </button>
                            <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-medium text-lg hover:bg-white/20 transition-all Mont">
                                Join as Business
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <Footor />
        </div>
    );
};

export default TravoxaPartnersPage;
