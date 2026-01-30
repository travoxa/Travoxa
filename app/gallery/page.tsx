"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import GalleryHeader from "@/components/ui/GalleryHeader";
import Footor from "@/components/ui/Footor";
import { motion, AnimatePresence } from "framer-motion";

const GalleryPage = () => {
    const [stage, setStage] = useState("typing"); // 'typing', 'ready'

    useEffect(() => {
        // Typing takes about 0.8s-1.0s
        const timer = setTimeout(() => {
            setStage("ready");
            // Initialize AOS after movement starts and content is revealed
            setTimeout(() => {
                AOS.init({
                    duration: 1000,
                    once: true,
                });
            }, 100);
        }, 1200);

        return () => clearTimeout(timer);
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

    const getRotation = (index: number) => {
        const rotations = ["rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-0"];
        return rotations[index % rotations.length];
    };

    const getDelay = (index: number) => {
        return (index % 5) * 100;
    };

    const isBig = (index: number) => {
        return (index + 1) % 6 === 0;
    };

    const titleText = "Vibrant India Gallery";

    return (
        <div className="min-h-screen bg-white flex flex-col font-montserrat overflow-x-hidden relative">
            {/* Header - Fixed and fades in when ready */}
            <div className={`fixed top-0 left-0 right-0 z-[60] transition-opacity duration-1000 ${stage === 'ready' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <GalleryHeader />
            </div>

            <main className="flex-grow container mx-auto px-4 relative z-10">
                {/* HERO SECTION - Moves smoothly from center to top */}
                <motion.div
                    layout
                    transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
                    className={`w-full flex flex-col items-center justify-center overflow-visible ${stage === 'typing' ? 'h-screen' : 'h-32 md:h-48 mt-12 md:mt-24'
                        }`}
                >
                    <motion.h1
                        layout
                        layoutId="gallery-title"
                        className="text-3xl md:text-5xl font-playfair font-medium text-gray-900 tracking-tight flex justify-center flex-wrap gap-x-3 mb-4"
                    >
                        {titleText.split(" ").map((word, wordIdx) => (
                            <span key={wordIdx} className="whitespace-nowrap flex">
                                {word.split("").map((char, charIdx) => (
                                    <motion.span
                                        key={charIdx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            delay: (wordIdx * 5 + charIdx) * 0.04,
                                            duration: 0.1
                                        }}
                                        className={word === "Gallery" ? "text-green-600" : ""}
                                    >
                                        {char}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </motion.h1>

                    <AnimatePresence>
                        {stage === 'ready' && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="text-lg text-gray-600 max-w-2xl mx-auto font-light text-center"
                            >
                                A visual journey through the soul of India. Experience the enthusiasm, the colors, and the untold stories.
                            </motion.p>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Grid Section - Appears after movement */}
                <AnimatePresence>
                    {stage === 'ready' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 grid-flow-dense pb-12"
                        >
                            {images.map((image, index) => {
                                const big = isBig(index);
                                return (
                                    <div
                                        key={index}
                                        className={`
                                            overflow-hidden rounded-2xl transition-all duration-500 
                                            hover:shadow-2xl hover:scale-[1.02] cursor-pointer group 
                                            ${getRotation(index)} hover:rotate-0
                                            ${big ? 'sm:col-span-2 sm:row-span-2 shadow-xl' : 'col-span-1 row-span-1 shadow-md'}
                                        `}
                                        data-aos="zoom-in"
                                        data-aos-delay={getDelay(index)}
                                    >
                                        <div className="relative h-full w-full overflow-hidden rounded-xl">
                                            <Image
                                                src={image.src}
                                                alt={image.alt}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                        </div>
                                        {!big && <div className="pt-[100%]" />}
                                        {big && <div className="pt-[100%] sm:hidden" />}
                                    </div>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <div className={`transition-opacity duration-1000 ${stage === 'ready' ? 'opacity-100' : 'opacity-0'}`}>
                <Footor />
            </div>
        </div>
    );
};

export default GalleryPage;
