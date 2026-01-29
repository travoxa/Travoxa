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

    const images = [
        { src: "/home/tourist-places1.jpg", alt: "India Destination 1" },
        { src: "/home/tourist-places2.jpg", alt: "India Destination 2" },
        { src: "/home/tourist-places3.jpg", alt: "India Destination 3" },
        { src: "/home/tourist-places4.jpg", alt: "India Destination 4" },
        { src: "/home/tourist-places5.jpg", alt: "India Destination 5" },
        { src: "/home/tourist-places6.jpg", alt: "India Destination 6" },
        { src: "/home/tourist-places7.jpg", alt: "India Destination 7" },
        { src: "/home/tourist-places8.jpeg", alt: "India Destination 8" },
        { src: "/home/tourist-places9.jpg", alt: "India Destination 9" },
        { src: "/home/tourist-places10.jpeg", alt: "India Destination 10" },
        { src: "/home/tourist-places11.jpeg", alt: "India Destination 11" },
        { src: "/home/tourist-places12.jpeg", alt: "India Destination 12" },
        { src: "/home/tourist-places13.jpeg", alt: "India Destination 13" },
        { src: "/home/tourist-places14.jpeg", alt: "India Destination 14" },
        { src: "/home/tourist-places15.jpeg", alt: "India Destination 15" },
        { src: "/home/tourist-places16.jpeg", alt: "India Destination 16" },
        { src: "/home/tourist-places17.jpeg", alt: "India Destination 17" },
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
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`break-inside-avoid overflow-hidden rounded-2xl shadow-md bg-white p-2 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] cursor-pointer group ${getRotation(index)} hover:rotate-0`}
                            data-aos="zoom-in"
                            data-aos-delay={getDelay(index)}
                        >
                            <div className="relative overflow-hidden rounded-xl">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={500}
                                    height={IMAGE_HEIGHTS[index % IMAGE_HEIGHTS.length]}
                                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <span className="text-white font-montserrat font-medium text-sm">
                                        Explore India
                                    </span>
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
