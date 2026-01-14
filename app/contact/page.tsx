"use client";

import Footor from "@/components/ui/Footor";
import Header from "@/components/ui/Header";
import { useState } from "react";
import { IoPaperPlane } from "react-icons/io5";

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
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <Header />

            <main className="flex-grow pt-[140px] px-6 lg:px-24 max-w-[1600px] mx-auto w-full mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Section: Headings & Info */}
                    <div className="space-y-16">
                        <div>
                            <h1 className="text-6xl md:text-8xl font-light text-black tracking-tighter mb-8">
                                Contact us
                            </h1>
                            <p className="text-xl text-zinc-600 max-w-md font-light">
                                Get in touch with us for any enquiries and questions
                            </p>
                        </div>

                        {/* Contact Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8">
                            <div className="space-y-4">
                                <h3 className="text-lg text-zinc-400 font-light lowercase">general inquiries</h3>
                                <div className="space-y-1">
                                    <p className="font-medium text-lg text-black">work@travoxa.com</p>
                                    <p className="font-medium text-lg text-black">+91 7439708923</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg text-zinc-400 font-light lowercase">careers</h3>
                                <div className="space-y-1">
                                    <p className="font-medium text-lg text-black">hr@travoxa.com</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg text-zinc-400 font-light lowercase">collaborations</h3>
                                <div className="space-y-1">
                                    <p className="font-medium text-lg text-black">partners@travoxa.com</p>
                                    <p className="font-medium text-lg text-black">+91 7449443669</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg text-zinc-400 font-light lowercase">address</h3>
                                <div className="space-y-1">
                                    <p className="font-medium text-lg text-black">Travoxa HQ, Howrah</p>
                                    <p className="font-medium text-lg text-black">West Bengal, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Form (Placed at bottom/right area) */}
                    <div className="flex flex-col justify-end">
                        <div className="bg-zinc-50 p-8 md:p-12 rounded-3xl w-full max-w-xl ml-auto border border-zinc-100 shadow-sm">
                            <h3 className="text-2xl font-light text-black mb-8">Send a message</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            type="text"
                                            className="w-full bg-transparent border-b border-zinc-300 py-2 focus:border-black outline-none transition-colors text-black placeholder-zinc-300"
                                            placeholder="Your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Phone</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            type="tel"
                                            className="w-full bg-transparent border-b border-zinc-300 py-2 focus:border-black outline-none transition-colors text-black placeholder-zinc-300"
                                            placeholder="Your phone"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Email</label>
                                    <input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        type="email"
                                        className="w-full bg-transparent border-b border-zinc-300 py-2 focus:border-black outline-none transition-colors text-black placeholder-zinc-300"
                                        placeholder="Your email address"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={3}
                                        className="w-full bg-transparent border-b border-zinc-300 py-2 focus:border-black outline-none transition-colors text-black placeholder-zinc-300 resize-none"
                                        placeholder="How can we help?"
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-black hover:bg-zinc-800 text-white font-medium py-4 rounded-full transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group"
                                    >
                                        {isLoading ? "Sending..." : "Send Message"}
                                        <IoPaperPlane className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footor />
        </div>
    );
}