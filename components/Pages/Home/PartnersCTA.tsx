
import React from 'react';
import Link from 'next/link';
import { FaHandshake, FaGlobe, FaUsers, FaChartLine, FaVideo, FaBullhorn, FaPlane, FaLightbulb } from 'react-icons/fa';

const PartnersCTA = () => {
    return (
        <div
            className="w-full h-[450px] bg-[#f0f4ff] rounded-[24px] relative overflow-hidden group lg:[clip-path:polygon(0_0,100%_0,92%_100%,0_100%)]"
        >

            {/* Subtle Textured Icons Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-700 scale-100">
                <FaHandshake className="absolute top-[10%] left-[5%] text-slate-300 text-7xl transform -rotate-12" />
                <FaGlobe className="absolute top-[15%] right-[10%] text-slate-300 text-8xl transform rotate-12" />
                <FaVideo className="absolute bottom-[20%] left-[15%] text-slate-300 text-6xl transform -rotate-6" />
                <FaChartLine className="absolute top-[30%] right-[25%] text-slate-300 text-7xl transform rotate-6" />
                <FaUsers className="absolute bottom-[10%] right-[5%] text-slate-300 text-8xl transform -rotate-12" />
                <FaBullhorn className="absolute top-[50%] left-[8%] text-slate-300 text-6xl transform rotate-12" />
                <FaPlane className="absolute top-[10%] left-[40%] text-slate-300 text-9xl transform -rotate-45 opacity-50" />
                <FaLightbulb className="absolute bottom-[30%] right-[35%] text-slate-300 text-7xl transform rotate-12" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-8 lg:px-12 w-full mx-auto">
                <h2 className="text-3xl lg:text-5xl text-slate-900 font-light mb-6 Mont tracking-tight uppercase">
                    TRAVOXA <span className="text-[#6585f4] font-medium">COLLAB</span>
                </h2>
                <p className="text-slate-500 text-base lg:text-lg mb-8 Inter font-light max-w-xl leading-relaxed">
                    Generate click-worthy opportunities and grow your reach <br className="hidden lg:block" />
                    in seconds, fully automated.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link href="/travoxa-partners" className="bg-[#6585f4] text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-[#6585f4]/90 hover:scale-105 transition-all duration-300 Mont flex items-center gap-2 group/btn shadow-lg shadow-[#6585f4]/20">
                        Start Collaborating
                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PartnersCTA;
