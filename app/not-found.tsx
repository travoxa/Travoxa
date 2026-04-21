'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronLeft } from "react-icons/fi";
import FuzzyText from '@/components/ui/FuzzyText';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="fixed inset-0 h-screen w-screen bg-[#050505] text-white selection:bg-[#4da528]/30 selection:text-white overflow-hidden font-sans flex flex-col items-center justify-center z-[10000]">
      {/* Minimal Back Button */}
      <button 
        onClick={() => router.back()}
        className="absolute top-8 left-8 text-white/50 hover:text-white transition-colors cursor-pointer z-50"
        aria-label="Go back"
      >
        <FiChevronLeft size={36} />
      </button>

      <main className="flex flex-col items-center justify-center p-6 text-center relative z-10">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#4da528]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="z-10 flex flex-col items-center">
          <div className="relative cursor-default select-none">
            <FuzzyText 
              baseIntensity={0.2} 
              hoverIntensity={0.6} 
              enableHover={true}
              fontSize="clamp(6rem, 25vw, 18rem)"
              fontWeight={900}
              color="#4da528"
              className="leading-none"
              glitchMode={true}
              glitchInterval={3000}
            >
              404
            </FuzzyText>
          </div>
          
          <p className="mt-8 text-gray-400 text-lg md:text-xl Inter font-light tracking-wide max-w-sm">
            The page you are looking for is not found.
          </p>
        </div>
      </main>

      {/* Background patterns if any, but user said remove all other things. 
          I'll keep it extremely minimal. */}
    </div>
  );
}
