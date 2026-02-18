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
  RiShakeHandsLine
} from "react-icons/ri";
import { FaPaperPlane, FaMagic, FaUser, FaClock, FaMapMarkedAlt, FaCheckCircle, FaStar } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Feature content data with icons
const featureData = [
  {
    icon: RiDiceLine,
    title: "Mystery Trip",
    description: "Let fate decide your next great adventure.",
    bullets: [
      "Surprise destinations",
      "Curated reveals",
      "Budget-aligned",
      "Thrill factor"
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
  }
];

interface Feature {
  title: string;
  description: string;
  bullets: string[];
  icon: React.ElementType;
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
        <h2 className=" text-[56px] lg:text-[68px] Mont font-light leading-[1.1] mb-[20px] bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">
          What’s Coming Next.
        </h2>
        <p className="Mont text-[22px] text-gray-600 leading-[1.6] max-w-5xl mx-auto ">
          Every trip tells a story, and we help you write yours beautifully.
          From smart planning to real-time guidance, we combine intelligence with human care.
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

      {/* Cards Grid - Alternating big/small layout with reduced height - Hidden on Mobile */}
      <div className="hidden lg:flex flex-col gap-[24px] max-w-6xl mx-auto">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-[24px] items-stretch" data-aos="fade-up" data-aos-delay={rowIndex * 100}>
            {row.map((feature, featureIndex) => {
              const absoluteIndex = rowIndex * 2 + featureIndex;
              const isBig = (rowIndex % 2 === 0 && featureIndex === 0) || (rowIndex % 2 === 1 && featureIndex === 1);

              return (
                <div
                  key={absoluteIndex}
                  className={`bg-white rounded-[12px] border border-gray-100 hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-[3px] transition-all duration-300 flex flex-col group relative overflow-hidden ${isBig
                    ? 'flex-[1.6] p-[32px] min-h-[256px]'
                    : 'flex-[1] p-[24px] min-h-[208px]'
                    }`}
                >
                  {/* Premium Accent Line */}
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#4da528] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Background Icon */}
                  <feature.icon className="absolute -bottom-8 -right-8 text-[200px] text-[#4da528] opacity-10 pointer-events-none group-hover:scale-105 group-hover:opacity-15 transition-all duration-500" />

                  {/* Masking Overlay */}
                  <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                      {/* <span className="text-2xl">🔒</span> */}
                      <span className="inline-block w-6 h-6">
                        <img
                          src="/lock.png"
                          alt="Lock"
                          className="w-full h-full object-contain"
                        />
                      </span>
                    </div>
                    <p className="text-black font-semibold Inter text-sm mb-1 uppercase tracking-wider">
                      Coming Soon
                    </p>
                    <p className="text-gray-800 text-[11px] Inter font-medium max-w-[180px]">
                      This feature will be unlocked after official launch.
                    </p>
                    <div className="mt-4 px-3 py-1 bg-black/5 rounded-full border border-black/10">
                      <p className="text-[10px] text-gray-500 Inter italic">Currently under development</p>
                    </div>
                  </div>

                  {/* Title - Blurred */}
                  <h3 className={`font-medium Mont leading-[1.2] text-gray-900 relative z-10 blur-[4px] ${isBig ? 'text-[26px]' : 'text-[20px]'
                    }`}>
                    {feature.title}
                  </h3>

                  {/* Description - Blurred */}
                  <p className={`text-gray-600 leading-[1.5] font-light mt-[6px] Inter relative z-10 blur-[4px] ${isBig ? 'text-[15px]' : 'text-[13px]'
                    }`}>
                    {feature.description}
                  </p>

                  {/* Feature Bullets - Blurred */}
                  <div className={`grid grid-cols-2 gap-x-[10px] gap-y-[6px] mt-[10px] relative z-10 blur-[4px] ${isBig ? 'text-[13px]' : 'text-[11px]'
                    }`}>
                    {feature.bullets.slice(0, 4).map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-center gap-[5px]">
                        <span className={`text-[#4da528] font-bold flex-shrink-0 leading-none ${isBig ? 'text-[14px]' : 'text-[12px]'
                          }`}>•</span>
                        <span className="text-gray-700 leading-[1.4] font-light Inter">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Row - Compact */}
                  <div className="mt-auto pt-[12px] flex items-center justify-between border-t border-gray-100 relative z-10">
                    <button className={`bg-black text-white font-bold Mont rounded-full hover:shadow-lg transition-all duration-300 transform ${isBig ? 'text-[12px] px-[16px] py-[6px]' : 'text-[10px] px-[12px] py-[5px]'
                      }`}>
                      Coming Soon 🚀
                    </button>
                    {/* Progress Line - Compact */}
                    <div className="flex items-center gap-[4px] opacity-60">
                      <div className={`h-[2px] bg-gray-300 rounded-full ${isBig ? 'w-[24px]' : 'w-[18px]'
                        }`}></div>
                      <div className={`h-[2px] bg-gray-200 rounded-full ${isBig ? 'w-[8px]' : 'w-[6px]'
                        }`}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mobile Layout - 2 column grid with cubic boxes */}
      <div className="lg:hidden grid grid-cols-2 gap-3 max-w-lg mx-auto mt-[48px] px-2">
        {featureData.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-[12px] p-4 border border-gray-100 shadow-md relative overflow-hidden group aspect-square flex flex-col justify-between"
          >
            {/* Masking Overlay */}
            <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-20 flex flex-col items-center justify-center p-3 text-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg mb-2">
                <span className="text-lg">🔒</span>
              </div>
              <p className="text-black font-semibold Inter text-[10px] mb-0.5 uppercase tracking-wider">
                Coming Soon
              </p>
              <p className="text-gray-800 text-[8px] Inter font-medium leading-tight">
                Unlocked after launch
              </p>
            </div>

            {/* Background Icon - Blurred */}
            <feature.icon className="absolute -bottom-4 -right-4 text-[80px] text-[#4da528] opacity-10 pointer-events-none blur-[2px]" />

            {/* Title only - Blurred */}
            <h3 className="text-[14px] font-medium Mont leading-[1.2] relative z-10 blur-[3px]">
              {feature.title}
            </h3>

            {/* Icon centered - Blurred */}
            <div className="flex-1 flex items-center justify-center relative z-10 blur-[3px]">
              <feature.icon className="text-[36px] text-[#4da528] opacity-80" />
            </div>

            {/* Small See More button -> Coming Soon */}
            <div className="relative z-10">
              <button className="bg-black text-white text-[9px] font-bold Mont px-[10px] py-[4px] rounded-full">
                Coming Soon 🚀
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Choose;