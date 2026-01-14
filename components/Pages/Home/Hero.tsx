// app/components/Hero.tsx
"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <div className="w-screen flex justify-center items-center px-[12px] py-[12px]" >
      <div className="w-full h-[47vh] lg:h-[97vh] bg-center bg-cover bg-no-repeat rounded-[12px]" style={{ backgroundImage: `url('/hero-bg.jpg')` }} >
        {/* Increased Top Padding */}
        <p className="text-center pt-[20vh] lg:pt-[15vh] text-[16vw] font-bold text-white Mont tracking-wider text-shadow-blue-400 leading-none" data-aos="fade-down">TRAVOXA</p>

        {/* Subtitle with margin */}
        <p className=" text-center text-xl lg:text-3xl text-white font-medium Mont tracking-wide mt-8 mb-16 drop-shadow-md" data-aos="fade-up" data-aos-delay="100">
          Your AI-Powered Travel Companion.
        </p>

        {/* Content Container with Gap */}
        <div className="flex flex-col justify-center items-center text-white gap-12" data-aos="fade-up" data-aos-delay="200">
          <button className="bg-white text-black font-light Mont px-10 py-3 rounded-full shadow-lg uppercase hover:scale-105 transition-transform duration-300">Start Planning with AI </button>
          <p className="text-center text-[16px] lg:text-[20px] w-[90vw] lg:w-[50vw] text-white font-medium Inter drop-shadow-md leading-relaxed" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
            Plan smarter with Travoxa AI, find groups with Backpackers Club, aur discover budget-friendly destinations – sab ek hi platform par.
          </p>
        </div>
      </div>
    </div>
  );
}
