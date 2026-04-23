"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowRight } from "react-icons/fa";

function Cta() {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (containerRef.current && imageRef.current) {
            // Parallax effect on the image
            gsap.to(imageRef.current, {
                yPercent: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom", 
                    end: "bottom top", 
                    scrub: true
                }
            });
        }
    }, []);

    return (
        <div className="w-full p-[12px]">
             {/* Boxy section like hero */}
            <section 
                ref={containerRef}
                className="relative w-full rounded-[12px] overflow-hidden min-h-[600px] lg:min-h-[700px] flex items-center group"
                data-aos="fade-up"
            >
                {/* 
                  Layer 1 (Bottom): Hook Text 
                  Matches the "ABOUT US" title style from about page.
                */}
                <div className="absolute top-8 left-2 md:top-16 md:left-6 z-0 flex flex-col">
                    <h1 className="text-[4rem] sm:text-[6rem] lg:text-[7rem] xl:text-[9rem] font-bold text-black leading-[0.85] tracking-tighter Mont uppercase" data-aos="fade-right" data-aos-delay="100">
                        FIND YOUR NEXT
                    </h1>
                    <h1 className="text-[4rem] sm:text-[6rem] lg:text-[7rem] xl:text-[9rem] font-bold text-black leading-[0.85] tracking-tighter Mont uppercase" data-aos="fade-right" data-aos-delay="200">
                        ADVENTURE
                    </h1>
                </div>

                {/* 
                  Layer 2 (Middle): Background Image
                  Has transparent top-left area so text is visible. Parallax effect applied via GSAP.
                */}
                <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center pointer-events-none">
                    <img
                        ref={imageRef}
                        src="/home/footor_cta.png"
                        alt="Adventure CTA"
                        className="absolute w-full h-full top-0 object-contain object-right"
                    />
                </div>

                {/* 
                  Layer 3 (Top): CTA Button 
                  Placed exactly beneath the hook text. We use an invisible spacer duplicate of the hook text 
                  to ensure perfect responsive spacing above the button.
                */}
                <div className="absolute top-8 left-2 md:top-16 md:left-6 z-20 flex flex-col pointer-events-none">
                    {/* Invisible spacer matching the text size to push the CTA down */}
                    <div className="opacity-0 select-none pointer-events-none" aria-hidden="true">
                        <h1 className="text-[4rem] sm:text-[6rem] lg:text-[7rem] xl:text-[9rem] font-bold leading-[0.85] tracking-tighter Mont uppercase">
                            FIND YOUR NEXT
                        </h1>
                        <h1 className="text-[4rem] sm:text-[6rem] lg:text-[7rem] xl:text-[9rem] font-bold leading-[0.85] tracking-tighter Mont uppercase">
                            ADVENTURE
                        </h1>
                    </div>
                    
                    {/* The CTA button, positioned directly below the invisible text, clickable */}
                    <div className="mt-8 ml-2 md:ml-4 pointer-events-auto" data-aos="fade-up" data-aos-delay="400">
                        <Link href="/tour" className="group flex items-center shrink-0 cursor-pointer w-fit">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-[3px] border-white relative z-0 shadow-lg">
                                <Image src="/Destinations/Des1.jpeg" alt="Discover" fill className="object-cover" />
                            </div>
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#111] flex items-center justify-center border-[3px] border-white relative z-10 -ml-5 shadow-xl group-hover:bg-emerald-500 transition-colors duration-300">
                                <FaArrowRight className="text-white text-xl md:text-2xl -rotate-45" />
                            </div>
                        </Link>
                    </div>
                </div>

            </section>
        </div>
    );
}

export default Cta;