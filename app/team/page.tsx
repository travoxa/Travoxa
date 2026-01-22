"use client";

import Footor from "@/components/ui/Footor";
import Header from "@/components/ui/Header";

export default function TeamPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans">
            <Header />

            <main className="flex-grow pt-[140px] px-6 lg:px-24 max-w-[1600px] mx-auto w-full mb-20 space-y-24">

                {/* 1. HERO SECTION */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 lg:items-start justify-between">
                    <div className="space-y-6">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-green-50 text-green-600 font-medium text-xs tracking-wide uppercase">
                            Our Story
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-black tracking-tighter leading-[0.9] Mont uppercase">
                            The Journey Behind <span className="text-green-600 block mt-2">Travoxa</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-600 font-light mt-4">Built by a traveler. For travelers.</p>
                    </div>

                    <div className="space-y-6 lg:pt-8">
                        <h2 className="text-3xl font-extralight text-black Mont">Solving What I Faced</h2>
                        <p className="text-lg text-zinc-600 font-light leading-relaxed">
                            Traveling 10,000+ kms across India wasn't just fun—it was research. I experienced first-hand:
                        </p>
                        <ul className="space-y-4">
                            {[
                                "The frustration of hidden costs in \"budget\" stays.",
                                "The struggle of finding reliable local transport in hill stations.",
                                "The safety anxiety when exploring unknown alleys.",
                                "The gap between tourist traps and real hidden gems."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-zinc-700 font-light text-lg">
                                    <span className="text-green-600 mt-1.5 text-xs">●</span>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* 3. QUOTE SECTION */}
                <section className="p-12 text-center">
                    <p className="text-2xl md:text-4xl font-light leading-snug mb-6 Mont">
                        “Travoxa is not a company I planned. <br />
                        <span className="text-green-600 font-normal">It’s a solution I needed while traveling.</span>”
                    </p>
                    <p className="text-lg font-medium text-zinc-500">— Aditya Pathak</p>
                </section>

                {/* 4. FOUNDER & TEAM (Bridge & Cut-Out Design) */}
                <section className="space-y-12">
                    {/* The Layout: Two Grey Panels connected by a Bridge */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 items-stretch">

                        {/* LEFT PANEL: FOUNDER */}
                        <div className="bg-[#EAE8E4] rounded-[3rem] lg:rounded-tr-none p-4 md:p-6 lg:p-8 flex flex-col relative order-2 lg:order-1 transition-transform hover:scale-[1.01] duration-500">
                            {/* Inner Image Container */}
                            <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-white shadow-sm relative w-full h-full">
                                <img
                                    src="https://i.postimg.cc/sfYj4WHh/Aditya-Proffestional-photo-2.jpg"
                                    alt="Aditya Pathak"
                                    className="w-full h-full object-cover object-top filter grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                {/* Overlay Card */}
                                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-5 rounded-[1.5rem] text-center border border-white/40 shadow-lg">
                                    <h3 className="text-xl font-bold text-black uppercase Mont leading-none mb-1">Aditya Pathak</h3>
                                    <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Founder & Principal</p>
                                </div>
                            </div>
                        </div>

                        {/* CENTER PANEL: BRIDGE & CONTENT */}
                        <div className="order-1 lg:order-2 flex flex-col justify-center items-center py-12 lg:py-0 relative z-10">

                            {/* THE BRIDGE (Desktop Only) */}
                            <div className="hidden lg:block absolute top-0 left-0 right-0 h-24 bg-[#EAE8E4]  z-0"></div>

                            <div className="text-center w-full rounded-t-[3rem] bg-white h-[500px] pt-[100px] space-y-6 relative z-10 lg:mt-16">
                                {/* Removed the icon as requested */}

                                <div className="space-y-[-0.3rem]">
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-widest text-black Mont leading-none">
                                        Meet The
                                    </h2>
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-widest text-black Mont leading-none text-stroke-black">
                                        Team
                                    </h2>
                                </div>

                                <div className="w-12 h-1 bg-black/10 rounded-full mx-auto"></div>

                                <p className="text-zinc-600 font-light text-sm md:text-base leading-relaxed max-w-xs mx-auto">
                                    The minds and souls behind the journey. We are a team of travelers building for travelers.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT PANEL: TEAM GRID */}
                        <div className="bg-[#EAE8E4] rounded-[3rem] lg:rounded-tl-none p-6 lg:p-10 flex flex-col justify-center order-3 lg:order-3 hover:shadow-xl transition-shadow duration-500">
                            <div className="h-full flex flex-col justify-between gap-6">
                                <div className="text-left pl-2">
                                    <h4 className="text-2xl font-light text-black Mont">Core Team</h4>
                                    <p className="text-xs text-zinc-500 uppercase tracking-wider">The Builders</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 h-full">
                                    {[
                                        { name: "Milan", role: "Tech Head", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" },
                                        { name: "Advik", role: "Marketing", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" },
                                        { name: "Karthik", role: "Partnerships", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400" },
                                        { name: "Mustak", role: "Research", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" }
                                    ].map((member, i) => (
                                        <div key={i} className="bg-white p-3 rounded-[2rem] shadow-sm border border-white flex flex-col items-center justify-center text-center gap-3 group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-zinc-100 ring-2 ring-zinc-50 group-hover:ring-green-400 transition-all">
                                                <img
                                                    src={member.img}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-300"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-xs md:text-sm font-bold text-black uppercase Mont">{member.name}</h4>
                                                <p className="text-[8px] md:text-[9px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-green-600 transition-colors">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 5. JOURNEY */}
                <section>
                    <h2 className="text-3xl md:text-4xl font-extralight text-black mb-12 text-center Mont">My Travel Journey Across India</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Ayodhya", img: "https://via.placeholder.com/280x200", desc: "The spiritual vibration here taught me that travel is about peace, not just sightseeing." },
                            { title: "Varanasi", img: "https://via.placeholder.com/280x200", desc: "Wandering the ghats at 4 AM showed me the beauty of local rhythm and deep history." },
                            { title: "Darjeeling", img: "https://via.placeholder.com/280x200", desc: "Watching the sunrise over Kanchenjunga made me realize why nature needs better eco-tourism." },
                            { title: "Gangtok", img: "https://via.placeholder.com/280x200", desc: "Navigating the hills of Sikkim inspired our Smart Route Suggestion algorithms." },
                            { title: "Mayapur", img: "https://via.placeholder.com/280x200", desc: "Community living here gave birth to the 'Volunteer Yatra' concept in Travoxa." },
                            { title: "Delhi", img: "https://via.placeholder.com/280x200", desc: "The chaos and the food helped me understand the need for 'Food & Cafe' discovery." },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col gap-4 group">
                                <div className="overflow-hidden rounded-2xl">
                                    <img src={item.img} alt={item.title} className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-medium text-black">📍 {item.title}</h3>
                                    <p className="text-zinc-600 font-light mt-2">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. MOMENTS */}
                <section>
                    <h2 className="text-3xl md:text-4xl font-extralight text-black mb-12 text-center Mont">Moments That Built Travoxa</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { title: "Banaras Ganga Aarti", img: "https://via.placeholder.com/350x250" },
                            { title: "Darjeeling Sunrise", img: "https://via.placeholder.com/350x250" },
                            { title: "Gangtok Streets", img: "https://via.placeholder.com/350x250" },
                            { title: "Ayodhya Ram Mandir", img: "https://via.placeholder.com/350x250" }
                        ].map((item, i) => (
                            <div key={i} className="relative group overflow-hidden rounded-2xl h-64">
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                    <p className="text-white font-medium">{item.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 7. CTA */}
                <section className="text-center py-16 bg-zinc-50 rounded-3xl">
                    <p className="text-xl md:text-2xl font-light text-zinc-700 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Travoxa is built with travelers, creators, volunteers, and locals — together creating India’s most helpful travel ecosystem.
                    </p>
                    <a href="/travoxa-discovery" className="inline-block bg-black text-white px-10 py-4 rounded-full font-medium hover:bg-zinc-800 transition-colors hover:scale-105 transform duration-300">
                        Explore With Travoxa
                    </a>
                </section>

            </main>
            <Footor />
        </div>
    );
}
