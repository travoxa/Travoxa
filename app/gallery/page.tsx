"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import GalleryHeader from "@/components/ui/GalleryHeader";
import Footor from "@/components/ui/Footor";

const GalleryPage = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);
    const destinations = [
        {
            id: 1,
            name: "Agra – Taj Mahal",
            description: "World wonder, iconic for international tourists.",
            price: "₹15,200",
            src: "/home/tourist-places1.jpg", alt: "India Destination 1"
        },
        {
            id: 2,
            name: "Jaipur – Pink City",
            description: "Forts, palaces, culture — huge demand for couples & families.",
            src: "/home/tourist-places2.jpg", alt: "India Destination 2",
            price: "₹16,750"
        },
        {
            id: 3,
            name: "Kerala – Alleppey / Munnar",
            description: "Houseboats, tea plantations, hill stations — perfect for calm luxury.",
            src: "/home/tourist-places3.jpg", alt: "India Destination 3",
            price: "₹22,600"
        },
        {
            id: 4,
            name: "Goa",
            description: "Beaches + nightlife; huge seasonal demand especially November–February.",
            price: "₹25,400",
            src: "/home/tourist-places4.jpg", alt: "India Destination 4"
        },
        {
            id: 5,
            name: "Varanasi",
            description: "Spiritual capital; sunrise boat rides, ghats, rituals.",
            price: "₹26,900",
            src: "/home/tourist-places5.jpg", alt: "India Destination 5",
        },
        {
            id: 6,
            name: "Manali & Kullu",
            description: "Himalayan beauty, snowfall, adventure tourism.",
            price: "₹28,200",
            src: "/home/tourist-places6.jpg", alt: "India Destination 6"
        },
        {
            id: 7,
            name: "Ladakh",
            description: "Pangong Lake, monasteries — extreme scenic & biker's paradise.",
            price: "₹29,100",
            src: "/home/tourist-places7.jpg", alt: "India Destination 7"
        },
        {
            id: 8,
            name: "Andaman Islands",
            description: "Best white sand beaches in India; honeymoon hotspot.",
            price: "₹17,900",
            src: "/home/tourist-places8.jpeg", alt: "India Destination 8"
        },
        {
            id: 9,
            name: "Mumbai",
            description: "Urban travel, food, nightlife, and Bollywood attractions.",
            price: "₹29,950",
            src: "/home/tourist-places9.jpg", alt: "India Destination 9"
        },
        {
            id: 10,
            name: "Kashmir (Srinagar & Gulmarg)",
            description: "Considered 'heaven on earth'; shikara rides and snow adventures.",
            price: "₹29,100",
            src: "/home/tourist-places10.jpeg", alt: "India Destination 10"
        },
        {
            id: 11,
            name: "Rishikesh",
            description: "Adventure capital of India; rafting, yoga, and riverfront serenity.",
            price: "₹18,500",
            src: "/home/tourist-places11.jpeg", alt: "India Destination 11"
        },
        {
            id: 12,
            name: "Udaipur – City of Lakes",
            description: "Romantic palaces, lakes, and cultural charm — perfect for couples.",
            price: "₹24,300",
            src: "/home/tourist-places12.jpeg", alt: "India Destination 12"
        },
        {
            id: 13,
            name: "Hampi",
            description: "Ancient ruins, UNESCO World Heritage site, rich historical vibes.",
            price: "₹19,750",
            src: "/home/tourist-places13.jpeg", alt: "India Destination 13"
        },
        {
            id: 14,
            name: "Mysore",
            description: "Palaces, gardens, and silk markets; ideal for cultural exploration.",
            price: "₹21,200",
            src: "/home/tourist-places14.jpeg", alt: "India Destination 14"
        },
        {
            id: 15,
            name: "Rann of Kutch",
            description: "Salt desert landscapes; especially stunning during Rann Utsav festival.",
            price: "₹23,400",
            src: "/home/tourist-places15.jpeg", alt: "India Destination 15"
        },
        {
            id: 16,
            name: "Coorg – Kodagu",
            description: "Coffee plantations, waterfalls, and serene hill landscapes.",
            price: "₹20,900",
            src: "/home/tourist-places16.jpeg", alt: "India Destination 16"
        },
        {
            id: 17,
            name: "Darjeeling",
            description: "Tea gardens, toy train rides, and Himalayan views.",
            price: "₹22,500",
            src: "/home/tourist-places17.jpeg", alt: "India Destination 17"
        },
        // {
        //     id: 18,
        //     name: "Pune",
        //     description: "City of history, culture, and modern urban attractions.",
        //     price: "₹18,700"
        // },
        // {
        //     id: 19,
        //     name: "Alleppey Backwaters",
        //     description: "Luxury houseboats, serene canals, and tropical scenery.",
        //     price: "₹23,900"
        // },
        // {
        //     id: 20,
        //     name: "Shillong",
        //     description: "Scenic hill station, waterfalls, and tribal culture.",
        //     price: "₹21,800"


        // }
    ];

    // Helper to get random rotation for scrambled look
    const getRotation = (index: number) => {
        const rotations = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-0"];
        return rotations[index % rotations.length];
    };

    const getDelay = (index: number) => {
        return (index % 5) * 100;
    };

    return (
        <div className="min-h-screen bg-white flex flex-col pt-24">
            <GalleryHeader />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="text-center mb-12" data-aos="fade-up">
                    <h1 className="text-3xl md:text-5xl font-playfair font-medium text-gray-900 mb-4 tracking-tight">
                        Vibrant India <span className="text-green-600">Gallery</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-montserrat font-light">
                        A visual journey through the soul of India. Experience the enthusiasm, the colors, and the untold stories.
                    </p>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {destinations.map((image, index) => (
                        <div
                            key={index}
                            className={`break-inside-avoid overflow-hidden rounded-2xl shadow-md bg-white p-2 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] cursor-pointer group ${getRotation(index)} hover:rotate-0`}
                            data-aos="zoom-in"
                            data-aos-delay={getDelay(index)}
                        >
                            <div className="relative overflow-hidden rounded-xl group">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={500}
                                    height={IMAGE_HEIGHTS[index % IMAGE_HEIGHTS.length]}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 gap-2">

                                    {/* Explore India tag */}
                                    <span className="inline-block bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full self-start">
                                        Explore India
                                    </span>

                                    {/* Name */}
                                    <h3 className="text-white font-montserrat font-semibold text-lg md:text-xl">
                                        {image.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-white font-inter text-sm md:text-base">
                                        {image.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <Footor />
        </div>
    );
};

// Dummy heights to simulate masonry better if images aren't perfectly sized
const IMAGE_HEIGHTS = [600, 400, 800, 500, 700, 450, 650];

export default GalleryPage;
