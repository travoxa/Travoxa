import React, { useEffect, useRef } from "react";
import {
  RiRobotLine,
  RiDiceLine,
  RiMapPinLine,
  RiLeafLine,
  RiMap2Line,
  RiBookLine,
  RiCheckboxLine,
  RiNotification3Line,
  RiShieldCheckLine,
  RiShakeHandsLine,
  RiCompass3Line,
  RiCupLine,
  RiGroupLine,
} from "react-icons/ri";
import { FaPaperPlane, FaMagic, FaUser, FaClock, FaMapMarkedAlt, FaCheckCircle, FaStar } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";



// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Feature content data with icons
// Feature content data with icons
const featureData = [
  {
    icon: RiCompass3Line,
    title: "Tour",
    description: "Handpicked tour packages for unforgettable memories.",
    bullets: [
      "Curated packages",
      "Expert guides",
      "Family friendly",
      "Adventure picks"
    ],
    isLocked: false,
    path: "/tour"
  },
  {
    icon: RiCupLine,
    title: "Discovery",
    description: "Explore hidden gems, sightseeing, and local flavors.",
    bullets: [
      "Sightseeing",
      "Local rentals",
      "Food & Cafes",
      "Attractions"
    ],
    isLocked: false,
    path: "/travoxa-discovery"
  },
  {
    icon: RiGroupLine,
    title: "Backpackers",
    description: "Group adventures for like-minded travelers.",
    bullets: [
      "Join groups",
      "Split costs",
      "Shared memories",
      "Safety first"
    ],
    isLocked: false,
    path: "/backpackers"
  },
  {
    icon: RiDiceLine,
    title: "Mystery Trip",
    description: "Let fate decide your next great adventure.",
    bullets: [
      "Surprise destinations",
      "Curated reveals",
      "Budget-aligned",
      "Thrill factor"
    ],
    isLocked: true
  },
  {
    icon: RiMapPinLine,
    title: "Nearby",
    description: "Discover the magic hidden right around you.",
    bullets: [
      "Instant discovery",
      "Local hotspots",
      "Walking tours",
      "Hidden gems"
    ],
    isLocked: true
  },
  {
    icon: RiLeafLine,
    title: "Eco Tours",
    description: "Travel responsibly with sustainable footprints.",
    bullets: [
      "Green stays",
      "Carbon tracking",
      "Nature-first",
      "Ethical guides"
    ],
    isLocked: true
  },
  {
    icon: RiMap2Line,
    title: "Khazana Map",
    description: "Unlock the treasure chest of local secrets.",
    bullets: [
      "Interactive view",
      "Cultural icons",
      "Offline mode",
      "Rich details"
    ],
    isLocked: true
  },
  {
    icon: RiBookLine,
    title: "Travel Journal",
    description: "Document every moment of your journey.",
    bullets: [
      "Photo memories",
      "Daily logs",
      "Smart tagging",
      "Shareable content"
    ],
    isLocked: true
  },
  {
    icon: RiCheckboxLine,
    title: "AI Checklist",
    description: "Smart packing tailored to your destination.",
    bullets: [
      "Weather-adaptive",
      "Activity-based",
      "Essential alerts",
      "Customizable"
    ],
    isLocked: true
  },
  {
    icon: RiNotification3Line,
    title: "Real-Time Alerts",
    description: "Stay ahead of delays and disruptions.",
    bullets: [
      "Instant updates",
      "Flight tracking",
      "Weather warnings",
      "Safety pings"
    ],
    isLocked: true
  },
  {
    icon: RiShieldCheckLine,
    title: "Safety Score",
    description: "Real-time safety insights for peace of mind.",
    bullets: [
      "Area ratings",
      "Health tips",
      "Emergency info",
      "Live updates"
    ],
    isLocked: true
  },
  {
    icon: RiShakeHandsLine,
    title: "Local Connect",
    description: "Bridge the gap with authentic local culture.",
    bullets: [
      "Meet guides",
      "Language aid",
      "Cultural exchange",
      "Community events"
    ],
    isLocked: true
  }
];

interface Feature {
  title: string;
  description: string;
  bullets: string[];
  icon: React.ElementType;
  isLocked?: boolean;
  path?: string;
}

const Choose = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  // Transition Refs
  const transitionWrapperRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State
      gsap.set(tabletRef.current, {
        rotationY: -45,
        rotationX: 20,
        z: -100,
        opacity: 0,
        y: 50
      });

      gsap.set(textContentRef.current && textContentRef.current.children, {
        y: 30,
        opacity: 0
      });

      // 2. ScrollTrigger Animation - Reveals content as users scroll down
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%", // Start when top of container hits 75% of viewport
          end: "bottom 80%",
          toggleActions: "play none none reverse"
        }
      });

      // Stagger Text Reveal
      if (textContentRef.current) {
        tl.to(textContentRef.current.children, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out"
        });
      }

      // 3D Tablet Entry
      tl.to(tabletRef.current, {
        rotationY: -25, // Final resting angle
        rotationX: 10,
        rotationZ: 2,
        z: 0,
        y: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
      }, "-=0.6"); // Overlap with text


      // 3. Mouse Parallax Effect
      // Only active after the entry animation is somewhat complete or running
      const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current || !tabletRef.current) return;

        const { left, top, width, height } = containerRef.current.getBoundingClientRect();

        // Calculate normalized mouse position (-1 to 1)
        const xPos = ((e.clientX - left) / width) * 2 - 1;
        const yPos = ((e.clientY - top) / height) * 2 - 1;

        // Animate towards mouse position
        gsap.to(tabletRef.current, {
          rotationY: -25 + (xPos * 10), // Base -25deg +/- 10deg
          rotationX: 10 - (yPos * 10), // Base 10deg -/+ 10deg
          duration: 1,
          ease: "power2.out"
        });
      };

      if (containerRef.current) {
        containerRef.current.addEventListener("mousemove", handleMouseMove);
      }

      return () => {
        if (containerRef.current) containerRef.current.removeEventListener("mousemove", handleMouseMove);
      };

    }, containerRef); // Scope to container

    return () => ctx.revert(); // Cleanup
  }, []);

  // Page Transition Handler
  const handleTransition = (e: React.MouseEvent) => {
    e.preventDefault();

    // Paths
    const startPath = "M 0 100 V 100 Q 50 100 100 100 V 100 z"; // Flat Bottom
    const midPath = "M 0 100 V 50 Q 50 0 100 50 V 100 z";    // Wave Mid
    const endPath = "M 0 100 V 0 Q 50 0 100 0 V 100 z";      // Full Screen

    if (transitionWrapperRef.current && pathRef.current) {
      // Make wrapper visible
      gsap.set(transitionWrapperRef.current, {
        zIndex: 9999,
        autoAlpha: 1
      });

      const tl = gsap.timeline({
        onComplete: () => {
          router.push("/ai-trip-planner");
        }
      });

      // Reset path just in case
      gsap.set(pathRef.current, { attr: { d: startPath } });

      tl.to(pathRef.current, {
        attr: { d: midPath },
        duration: 0.4,
        ease: "power2.in"
      })
        .to(pathRef.current, {
          attr: { d: endPath },
          duration: 0.4,
          ease: "power2.out"
        });
    }
  };

  // Create alternating rows with proper typing
  const rows: Feature[][] = [];
  featureData.forEach((feature, index) => {
    if (index % 2 === 0) {
      rows.push([feature]);
    } else {
      rows[rows.length - 1].push(feature);
    }
  });

  return (
    <div className="mx-auto max-w-[1600px] px-4 lg:px-[80px] py-[80px]">

      {/* SVG Transition Overlay */}
      <div
        ref={transitionWrapperRef}
        className="fixed inset-0 w-full h-full pointer-events-none opacity-0 flex items-center justify-center scale-110"
        style={{ zIndex: -1 }} // Hidden initially behind everything
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4da528" />
              <stop offset="100%" stopColor="#1a5c0b" />
            </linearGradient>
          </defs>
          <path
            ref={pathRef}
            className="transition-path"
            fill="url(#liquidGrad)"
            d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      {/* Add inline styles for the wave animation */}
      <style>{`
        @keyframes float-lines {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-wave-slow {
          animation: float-lines 15s linear infinite;
        }
        .animate-wave-medium {
          animation: float-lines 10s linear infinite;
        }
      `}</style>

      {/* Header Section - Premium */}
      <div className="text-center mb-[72px] max-w-4xl mx-auto" data-aos="fade-up">
        <p className="Mont text-[18px] tracking-[4px] uppercase text-[#4da528] font-medium mb-[12px]">
          WHY CHOOSE US
        </p>
        <h2 className=" text-4xl lg:text-6xl Mont font-normal leading-tight mb-8 text-black">
          Explore Our Features.
        </h2>
        <p className="Mont text-[22px] text-gray-600 leading-[1.6] max-w-5xl mx-auto ">
          Every trip tells a story, and we help you write yours beautifully.
          Discover our active sections and see what's coming soon.
        </p>
      </div>

      {/* 🌟 FEATURED HIGHLIGHT: AI PLANNER (TABLET 3D MOCKUP) 🌟 */}
      {/* Added ref for GSAP scope and mouse listeners */}
      <div ref={containerRef} className="mb-24 w-full opacity-100">
        {/* Container: Removed dark background, added overflow-hidden for waves */}
        <div className="relative w-full rounded-[24px] p-8 lg:p-16 overflow-hidden group border border-transparent">

          {/* BACKGROUND ANIMATION: Flowing Waves */}
          <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
            {/* Wave 1 */}
            <div className="absolute top-[20%] left-0 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-[#4da528] to-transparent animate-wave-slow"></div>
            {/* Wave 2 */}
            <div className="absolute top-[40%] left-0 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-green-600 to-transparent animate-wave-medium" style={{ animationDelay: '-2s' }}></div>
            {/* Wave 3 */}
            <div className="absolute top-[60%] left-0 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-[#4da528] to-transparent animate-wave-slow" style={{ animationDelay: '-5s' }}></div>
            {/* Wave 4 */}
            <div className="absolute top-[80%] left-0 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-green-600 to-transparent animate-wave-medium" style={{ animationDelay: '-1s' }}></div>

            {/* Subtle Glows */}
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-[#4da528] rounded-full filter blur-[120px] opacity-5"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">

            {/* Left Content - INVERTED TEXT COLORS for light bg */}
            <div ref={textContentRef} className="lg:w-1/3 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4da528]/10 border border-[#4da528]/30 mb-6 backdrop-blur-sm">
                <FaStar className="text-[#4da528] text-xs" />
                <span className="text-[#4da528] text-xs font-bold tracking-wider uppercase">Most Loved Feature</span>
              </div>
              <h3 className="text-4xl lg:text-5xl font-medium text-gray-900 Mont leading-tight mb-6">
                Your Personal <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4da528] to-emerald-600">AI Travel Architect</span>
              </h3>
              <p className="text-gray-500 Inter text-lg leading-relaxed mb-8">
                Experience the future of travel planning. Our intelligent AI builds feasible, budget-balanced, and personalized itineraries in seconds—not hours.
              </p>

              <div className="flex flex-col gap-4">
                {[
                  "Smart feasibility checks",
                  "Budget optimization",
                  "Real-time customization"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#4da528]/10 flex items-center justify-center">
                      <FaCheckCircle className="text-[#4da528] text-xs" />
                    </div>
                    <span className="text-gray-600 font-light Inter">{item}</span>
                  </div>
                ))}
              </div>

              <a
                href="/ai-trip-planner"
                onClick={handleTransition}
                className="mt-6 lg:mt-10 bg-black text-white font-bold Mont px-6 py-3 lg:px-8 lg:py-4 text-sm lg:text-base rounded-full hover:scale-105 transition-transform shadow-lg shadow-black/20 flex items-center gap-2 lg:gap-3 w-fit cursor-pointer"
              >
                <RiRobotLine className="text-lg lg:text-xl" />
                TRY AI PLANNER
              </a>
            </div>

            {/* Right: The Tablet Mockup - ENHANCED 3D */}
            <div className="lg:w-2/3 w-full perspective-[2000px] flex justify-center lg:justify-end">
              <div
                ref={tabletRef}
                className="relative w-full lg:w-[90%] transition-all duration-75 ease-out shadow-2xl shadow-green-900/40 rounded-[24px] border-[12px] border-[#18181b] bg-[#18181b]"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform"
                }}
              >
                {/* Tablet Buttons/Camera */}
                <div className="absolute top-[50%] -right-[14px] -translate-y-1/2 w-[2px] h-16 bg-gray-600 rounded-r-sm opacity-50"></div>

                {/* Fake Thickness/Depth Layer */}
                <div className="absolute inset-0 bg-gray-800 rounded-[20px] transform translate-z-[-20px] scale-[0.99]"></div>

                {/* Screen Content - Ai Trip Planner UI Recreated Static */}
                <div className="bg-white rounded-[14px] overflow-hidden aspect-[16/11] relative text-xs md:text-sm shadow-inner border-[1px] border-black">

                  {/* Fake Header */}
                  <div className="h-10 border-b flex items-center justify-between px-4 bg-white/80 backdrop-blur-sm z-10 relative">
                    <span className="font-semibold text-gray-800 flex items-center gap-2 font-mono text-[10px]"><span className="w-2 h-2 rounded-full bg-red-400"></span> Travoxa AI</span>
                    <div className="flex gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full"></div>
                    </div>
                  </div>

                  {/* Split View */}
                  <div className="flex h-full bg-slate-50 relative">

                    {/* Left: Chat */}
                    <div className="w-1/2 md:w-7/12 p-3 flex flex-col border-r border-gray-100 bg-white">
                      <div className="flex-1 space-y-2.5 pt-4">
                        {/* AI Message */}
                        <div className="flex gap-2 max-w-[90%]">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-[9px]">🤖</div>
                          <div className="bg-gray-100 p-2 rounded-2xl rounded-tl-none text-gray-600 text-[10px] leading-relaxed">
                            Hi Milan! Where would you like to go for your next adventure?
                          </div>
                        </div>

                        {/* User Message */}
                        <div className="flex gap-2 max-w-[90%] ml-auto flex-row-reverse">
                          <div className="w-5 h-5 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-[9px]">👤</div>
                          <div className="bg-[#4da528] text-white p-2 rounded-2xl rounded-tr-none text-[10px] leading-relaxed shadow-sm">
                            I'm thinking of a 5-day trip to Manali with my friends.
                          </div>
                        </div>

                        {/* AI Message */}
                        <div className="flex gap-2 max-w-[90%]">
                          <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-[9px]">🤖</div>
                          <div className="bg-gray-100 p-2 rounded-2xl rounded-tl-none text-gray-600 text-[10px] leading-relaxed">
                            That sounds exciting! What kind of budget are you looking at for this trip?
                          </div>
                        </div>
                      </div>

                      {/* Input */}
                      <div className="mt-auto pt-2 pb-1">
                        <div className="bg-gray-50 border rounded-full px-3 py-1.5 flex justify-between items-center text-gray-400 text-[9px]">
                          <span>We have a budget of...|</span>
                          <FaPaperPlane className="text-[#4da528]" />
                        </div>
                      </div>
                    </div>

                    {/* Right: Profile */}
                    <div className="w-1/2 md:w-5/12 bg-white/50 p-3 pt-5 relative overflow-hidden">
                      <div className="absolute inset-0 bg-dots-pattern opacity-10 pointer-events-none"></div>
                      <h4 className="font-semibold text-gray-800 mb-2 text-[9px] uppercase tracking-wider border-b pb-1">Trip Profile</h4>

                      <div className="space-y-1.5">
                        {/* Cards */}
                        <div className="bg-white border border-green-100 p-1.5 rounded-lg shadow-sm flex items-center gap-2">
                          <div className="p-1 bg-green-50 rounded text-green-600"><FaMapMarkedAlt className="text-[10px]" /></div>
                          <div>
                            <div className="text-[8px] text-gray-400 font-bold uppercase">Destination</div>
                            <div className="text-[9px] font-semibold text-gray-800">Manali, India</div>
                          </div>
                        </div>

                        <div className="bg-white border border-green-100 p-1.5 rounded-lg shadow-sm flex items-center gap-2">
                          <div className="p-1 bg-green-50 rounded text-green-600"><FaClock className="text-[10px]" /></div>
                          <div>
                            <div className="text-[8px] text-gray-400 font-bold uppercase">Duration</div>
                            <div className="text-[9px] font-semibold text-gray-800">5 Days</div>
                          </div>
                        </div>

                        <div className="bg-white border border-green-100 p-1.5 rounded-lg shadow-sm flex items-center gap-2">
                          <div className="p-1 bg-green-50 rounded text-green-600"><FaUser className="text-[10px]" /></div>
                          <div>
                            <div className="text-[8px] text-gray-400 font-bold uppercase">Travelers</div>
                            <div className="text-[9px] font-semibold text-gray-800">Milan + 3</div>
                          </div>
                        </div>

                        <div className="bg-green-50/50 border border-green-200 border-dashed p-2 rounded-lg text-center mt-2">
                          <p className="text-[8px] text-green-700 font-bold animate-pulse">Building Itinerary...</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Gloss properties */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none rounded-[18px] mix-blend-overlay"></div>
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* Cards Grid - Desktop Premium Bento Layout */}
      <div className="hidden lg:flex flex-col gap-[24px] max-w-6xl mx-auto">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-[24px] items-stretch" data-aos="fade-up" data-aos-delay={rowIndex * 100}>
            {row.map((feature, featureIndex) => {
              const absoluteIndex = rowIndex * 2 + featureIndex;
              const isBig = (rowIndex % 2 === 0 && featureIndex === 0) || (rowIndex % 2 === 1 && featureIndex === 1);

              return (
                <div
                  key={absoluteIndex}
                  onClick={() => !feature.isLocked && feature.path && router.push(feature.path)}
                  className={`bg-white rounded-[32px] border border-gray-100 shadow-lg shadow-gray-200/40 transition-all duration-500 flex flex-col group overflow-hidden ${
                    !feature.isLocked 
                      ? 'cursor-pointer hover:border-[#4da528]/40 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-[4px]' 
                      : 'opacity-95'
                  } ${isBig ? 'flex-[1.6]' : 'flex-[1]'}`}
                >
                  {/* Visual Workspace Area (Header) */}
                  <div className={`relative w-full bg-slate-50 border-b border-gray-100 flex items-center justify-center overflow-hidden transition-colors ${
                    isBig ? 'h-[220px]' : 'h-[180px]'
                  } ${!feature.isLocked ? 'group-hover:bg-slate-100/50' : ''}`}>
                    
                    {/* CSS Grid Pattern - Graph Paper Effect */}
                    <div 
                      className="absolute inset-0 z-0 opacity-40 mix-blend-multiply"
                      style={{
                        backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                      }}
                    />

                    {/* Central Elements */}
                    <div className="relative z-10 flex items-center justify-center w-full h-full">
                      {/* Main Icon Box */}
                      <div className="relative bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[20px] w-[88px] h-[88px] flex items-center justify-center z-10 transform group-hover:scale-105 transition-transform duration-500">
                        <feature.icon className="text-[44px] text-[#4da528]" />
                      </div>

                      {/* Floating Decorative Elements */}
                      {isBig && (
                        <>
                          <div className="absolute top-1/2 left-[calc(50%-100px)] w-14 h-px border-t-[1.5px] border-dashed border-gray-300"></div>
                          <div className="absolute top-1/2 right-[calc(50%-100px)] w-14 h-px border-t-[1.5px] border-dashed border-gray-300"></div>
                          <div className="absolute top-[calc(50%-16px)] left-[calc(50%-170px)] w-[70px] h-[32px] bg-white rounded-lg shadow-sm border border-gray-100 flex items-center px-3 transform -translate-y-1">
                            <div className="w-[6px] h-[6px] rounded-full bg-blue-400 mr-[6px]"></div>
                            <div className="h-[4px] w-8 bg-gray-200 rounded-full"></div>
                          </div>
                          <div className="absolute top-[calc(50%-16px)] right-[calc(50%-160px)] w-[60px] h-[32px] bg-white rounded-lg shadow-sm border border-gray-100 flex items-center px-3 transform translate-y-1">
                            <div className="w-[6px] h-[6px] rounded-full bg-green-400 mr-[6px]"></div>
                            <div className="h-[4px] w-6 bg-gray-200 rounded-full"></div>
                          </div>
                        </>
                      )}
                      
                      {!isBig && (
                        <>
                          <div className="absolute bottom-[calc(50%-68px)] w-px h-6 border-l-[1.5px] border-dashed border-gray-300"></div>
                          <div className="absolute bottom-[calc(50%-92px)] bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 rounded-full px-4 py-1.5 flex items-center gap-2">
                             <div className={`w-[6px] h-[6px] rounded-full ${feature.isLocked ? 'bg-orange-400' : 'bg-green-400'}`}></div>
                             <span className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">
                               {feature.isLocked ? 'Pending' : 'Active'}
                             </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Masking Overlay for Locked features */}
                    {feature.isLocked && (
                      <div className="absolute inset-0 bg-white/50 backdrop-blur-[4px] z-20 flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgb(0,0,0,0.08)] mb-2 relative">
                          <img
                            src="/lock.png"
                            alt="Lock"
                            className="w-5 h-5 object-contain opacity-80"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className={`flex flex-col flex-1 relative z-10 bg-white ${isBig ? 'p-[36px]' : 'p-[28px]'}`}>
                    <h3 className={`font-semibold Mont leading-[1.2] text-gray-900 ${isBig ? 'text-[24px]' : 'text-[20px]'}`}>
                      {feature.title}
                    </h3>

                    <p className={`text-gray-500 leading-[1.5] mt-[10px] Inter ${isBig ? 'text-[15px]' : 'text-[14px]'}`}>
                      {feature.description}
                    </p>

                    <div className={`grid grid-cols-2 gap-x-[16px] gap-y-[10px] mt-[24px] ${isBig ? 'text-[14px]' : 'text-[13px]'}`}>
                      {feature.bullets.slice(0, 4).map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="flex items-center gap-[8px]">
                          <div className="w-[6px] h-[6px] rounded-full bg-[#4da528]/80 flex-shrink-0"></div>
                          <span className="text-gray-600 font-medium Inter truncate">
                            {bullet}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Action Area */}
                    <div className="mt-auto pt-[24px] flex items-center justify-between border-t border-gray-50">
                      <span className={`font-semibold text-[#4da528] flex items-center transition-all ${
                        !feature.isLocked ? 'group-hover:tracking-wide' : 'opacity-60 text-gray-500'
                      } ${isBig ? 'text-[14px]' : 'text-[13px]'}`}>
                        {feature.isLocked ? 'Coming Soon' : 'Explore Now'} 
                        {!feature.isLocked && <span className="ml-[6px] text-[16px] transition-transform group-hover:translate-x-1">&rarr;</span>}
                      </span>
                      
                      {/* Abstract Progress or Status indicator */}
                      <div className="flex items-center gap-[4px] opacity-40">
                        <div className={`h-[3px] bg-gray-300 rounded-full ${isBig ? 'w-[20px]' : 'w-[16px]'}`}></div>
                        <div className={`h-[3px] bg-gray-300 rounded-full ${isBig ? 'w-[8px]' : 'w-[6px]'}`}></div>
                        <div className={`h-[3px] bg-[#4da528] rounded-full w-[4px]`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-[16px] mt-[48px] px-2 max-w-2xl mx-auto">
        {featureData.map((feature, index) => (
          <div
            key={index}
            onClick={() => !feature.isLocked && feature.path && router.push(feature.path)}
            className={`bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] transition-all duration-300 flex flex-col group overflow-hidden ${
              !feature.isLocked 
                ? 'cursor-pointer hover:border-[#4da528]/40 hover:shadow-lg hover:-translate-y-[2px]' 
                : 'opacity-95'
            }`}
          >
            {/* Visual Workspace Area (Header) */}
            <div className={`relative w-full bg-slate-50 border-b border-gray-100 flex items-center justify-center overflow-hidden h-[150px] transition-colors ${!feature.isLocked ? 'group-hover:bg-slate-100/50' : ''}`}>
              
              {/* CSS Grid Pattern */}
              <div 
                className="absolute inset-0 z-0 opacity-40 mix-blend-multiply"
                style={{
                  backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
                  backgroundSize: '32px 32px'
                }}
              />

              {/* Central Box */}
              <div className="relative z-10 bg-white shadow-[0_6px_20px_rgb(0,0,0,0.06)] rounded-[18px] w-[72px] h-[72px] flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500">
                <feature.icon className="text-[32px] text-[#4da528]" />
              </div>

              {/* Masking Overlay */}
              {feature.isLocked && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[3px] z-20 flex flex-col items-center justify-center">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgb(0,0,0,0.08)] mb-2">
                    <img src="/lock.png" alt="Lock" className="w-4 h-4 object-contain opacity-80" />
                  </div>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="p-[20px] flex flex-col flex-1 relative z-10 bg-white">
              <h3 className="font-semibold Mont leading-[1.2] text-gray-900 text-[18px]">
                {feature.title}
              </h3>

              <p className="text-gray-500 leading-[1.5] mt-[8px] Inter text-[13px]">
                {feature.description}
              </p>

              {/* Bottom Action Area */}
              <div className="mt-auto pt-[16px] flex items-center justify-between border-t border-gray-50">
                <span className={`font-semibold text-[#4da528] flex items-center transition-all ${
                  !feature.isLocked ? 'group-hover:tracking-wide' : 'opacity-60 text-gray-500'
                } text-[13px]`}>
                  {feature.isLocked ? 'Coming Soon' : 'Explore Now'} 
                  {!feature.isLocked && <span className="ml-[4px] text-[15px] transition-transform group-hover:translate-x-1">&rarr;</span>}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Choose;