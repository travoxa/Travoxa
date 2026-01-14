import React from 'react';
import Header from '@/components/ui/Header';
import Footor from '@/components/ui/Footor';
import { FaSearch, FaTruck, FaCog, FaExclamationCircle, FaLock, FaUser, FaUsers, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

const HelpPage = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <Header />
            <div className="pt-40 pb-24">
                {/* Hero Section */}
                <div className="container mx-auto px-4 text-center max-w-4xl mb-20">
                    <h1 className="text-5xl font-light mb-6 text-gray-900 Mont">Help Center</h1>
                    <p className="text-gray-600 mb-10 max-w-2xl mx-auto Inter text-lg font-light">
                        Explore our SupportHub for answers to your questions and assistance with your social media experience.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto mb-8">
                        <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            placeholder="Search your keyword"
                            className="w-full pl-16 pr-6 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4da528] shadow-sm text-lg Inter font-light"
                        />
                    </div>

                    {/* Popular Topics */}
                    <div className="flex flex-wrap justify-center gap-4 text-sm font-medium Inter">
                        <span className="text-gray-500 py-2 font-light">Popular topics:</span>
                        <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors font-light">Getting started</button>
                        <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors font-light">Chat</button>
                        <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors font-light">Documentation</button>
                    </div>
                </div>

                {/* Topics Grid */}
                <div className="container mx-auto px-4 max-w-6xl mb-24">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card Component for reusability within this file */}
                        {[
                            { icon: FaTruck, title: "Getting Started", desc: "Learn the basics of setting up your profile and connecting with friends." },
                            { icon: FaCog, title: "Account Settings", desc: "Customize your experience with account settings, privacy controls, and notifications." },
                            { icon: FaExclamationCircle, title: "Troubleshooting", desc: "Resolve common issues and errors for seamless social media usage." },
                            { icon: FaLock, title: "Privacy Tips", desc: "Explore features to enhance your privacy and control over shared content." },
                            { icon: FaUser, title: "Profile Customization", desc: "Express yourself by specializing your profile with photos, bios, and more." },
                            { icon: FaUsers, title: "Connecting with Others", desc: "Discover tips on building and managing your social network effectively." }
                        ].map((item, index) => (
                            <div key={index} className="text-center p-8 rounded-2xl transition-all duration-300 cursor-pointer bg-white border border-transparent hover:bg-[#4da528] hover:shadow-xl hover:-translate-y-2 group">
                                <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl text-gray-700 group-hover:bg-white/20 group-hover:text-white transition-colors">
                                    <item.icon />
                                </div>
                                <h3 className="text-xl font-medium mb-4 text-gray-900 group-hover:text-white Mont">{item.title}</h3>
                                <p className="text-gray-500 mb-6 text-sm leading-relaxed group-hover:text-white/90 Inter font-light">
                                    {item.desc}
                                </p>
                                <span className="text-gray-900 font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all group-hover:text-white Mont">
                                    Learn More <FaArrowRight size={12} />
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-lg">
                        <h2 className="text-3xl font-light mb-6 text-gray-900 Mont">Need Personal Assistance?</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed Inter font-light">
                            If you couldn't find the information you need, our support team is ready to assist you. Submit a ticket, and we'll get back to you as soon as possible.
                        </p>
                        <Link href="/support">
                            <button className="bg-[#4da528] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#3d8b1f] transition-colors shadow-lg shadow-green-200 Mont">
                                Submit a Ticket
                            </button>
                        </Link>
                    </div>
                    <div className="relative">
                        {/* Placeholder for illustration */}
                        <div className="w-full max-w-sm bg-green-100 rounded-full aspect-square flex items-center justify-center">
                            <FaUser className="text-9xl text-[#4da528]" />
                        </div>
                    </div>
                </div>
            </div>
            <Footor />
        </div>
    );
};

export default HelpPage;
