
import Link from 'next/link';
import { FaHiking, FaMapMarkedAlt, FaHandsHelping, FaHome, FaLeaf, FaCamera, FaCampground } from 'react-icons/fa';
import { GiBackpack } from 'react-icons/gi';

const YatraCTA = () => {
    return (
        <div
            className="w-full h-[450px] bg-emerald-50/50 rounded-[24px] relative overflow-hidden group lg:[clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)]"
        >

            {/* Subtle Textured Icons Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-700 scale-100">
                <GiBackpack className="absolute top-[10%] left-[5%] text-slate-300 text-7xl transform -rotate-12" />
                <FaMapMarkedAlt className="absolute top-[15%] right-[10%] text-slate-300 text-8xl transform rotate-12" />
                <FaCampground className="absolute bottom-[20%] left-[15%] text-slate-300 text-6xl transform -rotate-6" />
                <FaHandsHelping className="absolute top-[30%] right-[25%] text-slate-300 text-7xl transform rotate-6" />
                <FaHome className="absolute bottom-[10%] right-[5%] text-slate-300 text-8xl transform -rotate-12" />
                <FaLeaf className="absolute top-[50%] left-[8%] text-slate-300 text-6xl transform rotate-12" />
                <FaHiking className="absolute top-[10%] left-[40%] text-slate-300 text-9xl transform -rotate-45 opacity-50" />
                <FaCamera className="absolute bottom-[30%] right-[35%] text-slate-300 text-7xl transform rotate-12" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-8 lg:px-12 w-full mx-auto">
                <h2 className="text-3xl lg:text-5xl text-slate-900 font-light mb-6 Mont tracking-tight uppercase">
                    TRAVOXA <span className="text-emerald-600 font-medium">YATRA</span>
                </h2>
                <p className="text-slate-500 text-base lg:text-lg mb-8 Inter font-light max-w-xl leading-relaxed">
                    Travel for free by volunteering. Exchange your skills for stays, <br className="hidden lg:block" />
                    food, and unforgettable experiences across India.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link href="/travoxa-yatra" className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-emerald-600/90 hover:scale-105 transition-all duration-300 Mont flex items-center gap-2 group/btn shadow-lg shadow-emerald-600/20">
                        Explore Opportunities
                        <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default YatraCTA;
