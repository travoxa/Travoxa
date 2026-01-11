"use client";

import Footor from "@/components/ui/Footor";
import Header from "@/components/ui/Header";
import { IoLocationOutline, IoCallOutline, IoMailOpenOutline, IoPaperPlane } from "react-icons/io5";
import { useState } from "react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert("Message sent successfully! We'll get back to you soon.");
                setFormData({ name: "", phone: "", email: "", message: "" });
            } else {
                const data = await res.json();
                alert(data.error || "Failed to send message.");
            }
        } catch (error) {
            console.error("Contact Error:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-dots-svg min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow pt-[120px]">
                {/* Hero Section */}
                <div className="relative h-[40vh] w-full bg-cover bg-center overflow-hidden"
                    style={{ backgroundImage: `url('/contact/contact.jpg')` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center px-6 lg:px-24">
                        <div className="max-w-xl space-y-4 animate-fadeIn">
                            <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight">
                                Let's Start a <br /><span className="text-[#4da528]">Conversation</span>
                            </h1>
                            <p className="text-gray-200 text-lg">
                                Whether you have a question about tours, pricing, or just want to say hello, we're ready to answer all your questions.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 -mt-12 relative z-10 space-y-16">

                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ContactCard
                            icon={<IoLocationOutline size={28} />}
                            title="Visit Us"
                            content={
                                <p>Travoxa HQ, Howrah<br />West Bengal, India</p>
                            }
                        />
                        <ContactCard
                            icon={<IoCallOutline size={28} />}
                            title="Call Us"
                            content={
                                <div className="flex flex-col">
                                    <a href="tel:+917439708923" className="hover:text-[#4da528] transition">+91 7439708923</a>
                                    <a href="tel:+917449443669" className="hover:text-[#4da528] transition">+91 7449443669</a>
                                </div>
                            }
                        />
                        <ContactCard
                            icon={<IoMailOpenOutline size={28} />}
                            title="Email Us"
                            content={
                                <div className="flex flex-col">
                                    <a href="mailto:support@travoxa.com" className="hover:text-[#4da528] transition">support@travoxa.com</a>
                                    <a href="mailto:info@travoxa.com" className="hover:text-[#4da528] transition">info@travoxa.com</a>
                                </div>
                            }
                        />
                    </div>

                    {/* Form Section */}
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Left Side: Text */}
                        <div className="lg:w-1/3 space-y-6">
                            <p className="text-[#4da528] tracking-widest uppercase text-sm font-bold">Get In Touch</p>
                            <h2 className="text-4xl font-bold text-gray-900">Have specific requirements?</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Fill out the form and our team will get back to you within 24 hours. We love hearing from fellow travelers and future adventurers!
                            </p>
                            <div className="h-1 w-20 bg-[#4da528] rounded-full"></div>
                        </div>

                        {/* Right Side: Form */}
                        <div className="flex-1 w-full bg-white/70 backdrop-blur-xl border border-gray-200 p-8 lg:p-12 rounded-3xl shadow-xl">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Your Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#4da528] focus:ring-1 focus:ring-[#4da528] outline-none transition"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            type="tel"
                                            placeholder="+91 99999 99999"
                                            className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#4da528] focus:ring-1 focus:ring-[#4da528] outline-none transition"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#4da528] focus:ring-1 focus:ring-[#4da528] outline-none transition"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        placeholder="Tell us about your trip..."
                                        className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#4da528] focus:ring-1 focus:ring-[#4da528] outline-none transition"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#4da528] hover:bg-green-600 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Sending..." : "Send Message"} <IoPaperPlane />
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </main>
            <Footor />
        </div>
    );
}

function ContactCard({ icon, title, content }: { icon: React.ReactNode, title: string, content: React.ReactNode }) {
    return (
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center gap-4 hover:shadow-md transition-all group">
            <div className="p-4 bg-gray-50 text-[#4da528] rounded-full group-hover:bg-[#4da528] group-hover:text-white transition-colors duration-300">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">{title}</h3>
                <div className="text-gray-600 text-sm leading-relaxed">
                    {content}
                </div>
            </div>
        </div>
    );
}