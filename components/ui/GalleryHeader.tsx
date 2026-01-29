"use client";

import React from "react";
import Image from "next/image";
import { FiArrowLeft } from "react-icons/fi";
import { route } from "@/lib/route";

const GalleryHeader = () => {
    const handleBack = () => {
        window.history.back();
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                {/* Logo - Left */}
                <button
                    onClick={() => route("/")}
                    className="flex items-center"
                >
                    <Image
                        src="/logo.png"
                        alt="Travoxa Logo"
                        width={100}
                        height={30}
                        className="h-[16px] md:h-[20px] w-auto"
                        priority
                    />
                </button>

                {/* Back Button - Right */}
                <button
                    onClick={handleBack}
                    className="bg-black text-white px-5 py-1.5 rounded-full hover:bg-gray-900 transition-all flex items-center gap-2 text-xs md:text-sm font-medium shadow-md"
                    aria-label="Go back"
                >
                    <FiArrowLeft size={16} />
                    <span>Back</span>
                </button>
            </div>
        </header>
    );
};

export default GalleryHeader;
