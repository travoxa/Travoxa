// app/components/Hero.tsx
"use client";

import Image from "next/image";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Spinner from "@/components/ui/Spinner";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUserFriends, FaChevronDown, FaRegCompass, FaStar, FaArrowRight } from "react-icons/fa";
import { rentalsData } from "@/data/rentalsData";
import { sightseeingPackages } from "@/data/sightseeingData";
import { tourData as staticTourData } from "@/data/tourData";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [dynamicTours, setDynamicTours] = useState<any[]>([]);
  const [showQueryDropdown, setShowQueryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [enquiryInput, setEnquiryInput] = useState("");
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const queryRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth Spring config
  const springConfig = { damping: 25, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Transformations for 3D effect
  const backgroundX = useTransform(smoothX, [-500, 500], [15, -15]);
  const backgroundY = useTransform(smoothY, [-500, 500], [15, -15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    
    // Center-orient coordinates
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryInput) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setEnquirySuccess(true);
      setIsSubmitting(false);
      setEnquiryInput("");
      setTimeout(() => setEnquirySuccess(false), 5000);
    }, 1500);
  };

  // Fetch dynamic suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2 && !location) {
        setSuggestions([]);
        return;
      }
      
      setIsSearching(true);
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/search?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query, location]);

  // Fetch dynamic tours once on load
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/tours');
        const data = await res.json();
        if (data.success) {
          setDynamicTours(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch tours for hero suggestions:", error);
      }
    };
    fetchTours();
  }, []);

  const allTours = useMemo(() => [...staticTourData, ...dynamicTours], [dynamicTours]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (queryRef.current && !queryRef.current.contains(event.target as Node)) {
        setShowQueryDropdown(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Collect unique locations
  const allLocations = useMemo(() => {
    const locs = new Set<string>();
    rentalsData.forEach(i => { if (i.location && typeof i.location === 'string') locs.add(i.location); });
    sightseeingPackages.forEach(i => { 
      if (i.city && typeof i.city === 'string') locs.add(i.city); 
      if (i.state && typeof i.state === 'string') locs.add(i.state); 
    });
    allTours.forEach(i => { if (i.location && typeof i.location === 'string') locs.add(i.location); });
    return Array.from(locs).sort();
  }, [allTours]);

  const querySuggestions = suggestions;

  const filteredLocations = useMemo(() => {
    if (!location) return allLocations.slice(0, 8);
    return allLocations.filter(l => l.toLowerCase().includes(location.toLowerCase())).slice(0, 8);
  }, [location, allLocations]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('location', location);
    router.push(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
      setShowQueryDropdown(false);
      setShowLocationDropdown(false);
    }
  };

  return (
    <div className="w-full h-[100svh] flex flex-col justify-between p-[12px] bg-white overflow-hidden">
      <div 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-[80%] lg:h-[90%] rounded-[12px] relative overflow-hidden shrink-0"
      >
        {/* Parallax Background Container */}
        <motion.div 
          className="absolute inset-0 z-0 scale-110"
          style={{ x: backgroundX, y: backgroundY }}
        >
          <Image
            src="https://res.cloudinary.com/dta29uych/image/upload/v1772911288/895_uemkuk.jpg"
            alt="Travoxa Hero Background"
            fill
            priority
            className="object-cover -scale-x-100"
            sizes="100vw"
          />
        </motion.div>

        {/* Main Content Wrapper */}
        <div className="relative z-10 w-full h-full flex flex-col px-6 lg:px-12 pointer-events-none">
          
          {/* Top Section: Headline & Search (Pinned Top Left) */}
          <div className="pt-20 lg:pt-28 w-full max-w-2xl pointer-events-auto" data-aos="fade-right">
            <div className="space-y-4 mb-8">
              <p className="text-black font-bold uppercase tracking-[0.4em] text-[10px] md:text-xs bg-emerald-400 w-fit px-3 py-1 rounded-sm">Dil Se Bana Travel Partner</p>
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white Mont leading-[0.9] [text-shadow:2px_2px_15px_rgba(0,0,0,0.3)]">
                Discover <br />
                <span className="text-white">India's Hidden</span> <br />
                Wonders
              </h1>
            </div>

            {/* Integrated Search Bar (Slim & Minimalist) */}
            <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 p-1 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.2)] flex items-center gap-1 group transition-all hover:bg-white/15 focus-within:bg-white/20 focus-within:border-white/30">
              <div ref={queryRef} className="flex-1 relative flex items-center gap-2 px-3 py-1.5 border-r border-white/10">
                <FaSearch className="text-white/60 text-[10px]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setShowQueryDropdown(true); }}
                  onFocus={() => setShowQueryDropdown(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search destinations..."
                  className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/50 text-[11px] font-medium focus:ring-0 p-0"
                />
                {showQueryDropdown && (querySuggestions.length > 0 || isSearching) && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 z-[100] max-h-[280px] overflow-y-auto custom-scrollbar">
                    {isSearching ? (
                      <div className="px-4 py-3 flex items-center gap-2"><Spinner size="xs" /><span className="text-[10px] text-slate-400">Searching...</span></div>
                    ) : (
                      querySuggestions.map((suggestion, idx) => (
                        <div key={idx} onClick={() => { setQuery(suggestion.title); setShowQueryDropdown(false); }} className="px-5 py-3 hover:bg-emerald-50 cursor-pointer text-xs text-slate-700 font-medium flex justify-between items-center border-b border-slate-50 last:border-0 transition-colors">
                          <span>{suggestion.title}</span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold bg-slate-50 px-1.5 py-0.5 rounded">{suggestion.category}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div ref={locationRef} className="relative hidden md:flex items-center gap-2 px-3 py-1.5">
                <FaMapMarkerAlt className="text-white/60 text-[10px]" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); setShowLocationDropdown(true); }}
                  onFocus={() => setShowLocationDropdown(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Location"
                  className="w-24 bg-transparent border-none outline-none text-white placeholder:text-white/50 text-[11px] font-medium focus:ring-0 p-0"
                />
                {showLocationDropdown && filteredLocations.length > 0 && (
                  <div className="absolute top-full right-0 mt-3 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 z-[100] min-w-[200px] overflow-hidden">
                    {filteredLocations.map((loc, idx) => (
                      <div key={idx} onClick={() => { setLocation(loc); setShowLocationDropdown(false); }} className="px-5 py-3 hover:bg-emerald-50 cursor-pointer text-xs text-slate-700 font-medium flex items-center gap-2">
                         <FaMapMarkerAlt className="text-slate-400 text-[10px]" /> {loc}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={handleSearch} className="h-8 w-8 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center transition-all active:scale-95 flex-shrink-0">
                <FaSearch className="text-[10px]" />
              </button>
            </div>
          </div>

          {/* Bottom Right Content (Pinned Bottom Right) */}
          <div className="absolute bottom-2 lg:bottom-3 right-2 lg:right-3 z-10 w-full max-w-[260px] md:max-w-[280px] pointer-events-auto" data-aos="fade-left" data-aos-delay="400">
            <div className="bg-white border border-slate-100 rounded-[12px] p-4 lg:p-5 shadow-sm">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg md:text-xl font-medium text-slate-900 Mont tracking-tight">Free Enquiry</h3>
                  <p className="text-slate-500 text-[9px] font-medium leading-tight">Personalized itinerary within 24 hours.</p>
                </div>
                
                {enquirySuccess ? (
                  <div className="py-12 text-center bg-emerald-50 rounded-[12px] border border-emerald-100 animate-in zoom-in duration-500">
                    <p className="text-emerald-600 text-sm font-bold truncate px-2">✓ Request Sent!</p>
                  </div>
                ) : (
                  <form onSubmit={handleEnquirySubmit} className="space-y-5">
                    <div className="space-y-1.5 focus-within:space-y-2 transition-all">
                      <input
                        type="text"
                        required
                        value={enquiryInput}
                        onChange={(e) => setEnquiryInput(e.target.value)}
                        placeholder="Email or Phone"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 text-[11px] placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/40 transition-all outline-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 text-white text-[11px] font-bold py-3.5 rounded-lg hover:bg-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? "Sending Request..." : "Book a Free Enquiry"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Discover Bottom Link Section */}
      <div className="w-full flex-1 flex flex-col md:flex-row items-center justify-start lg:justify-between px-2 md:px-6 lg:px-12 gap-5 lg:gap-8 pt-4 pb-2" data-aos="fade-up" data-aos-delay="200">
        
        {/* left: Overlapping Circles */}
        <Link href="/travoxa-discovery" className="group flex items-center shrink-0 cursor-pointer self-start md:self-auto">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-[3px] border-white relative z-0 shadow-md">
            <Image src="/Destinations/Des1.jpeg" alt="Discover" fill className="object-cover" />
          </div>
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#111] flex items-center justify-center border-[3px] border-white relative z-10 -ml-4 shadow-md group-hover:bg-emerald-500 transition-colors duration-300">
            <FaArrowRight className="text-white text-base md:text-xl -rotate-45" />
          </div>
        </Link>
        
        {/* Divider 1 */}
        <div className="hidden md:block w-px h-10 bg-slate-200 shrink-0"></div>

        {/* Center Text */}
        <div className="hidden md:block max-w-[200px] lg:max-w-[240px] text-[11px] lg:text-xs text-slate-500 font-medium leading-relaxed">
          Elevate your journey with our modern itineraries and curated travel experiences.
        </div>
        
        {/* Divider 2 */}
        <div className="hidden lg:block h-px bg-slate-200 flex-1 min-w-[30px] max-w-[120px]"></div>
        
        {/* Right Main Text */}
        <div className="flex-1 max-w-full md:max-w-md lg:max-w-[360px]">
           <h2 className="text-lg md:text-xl lg:text-[22px] font-medium text-slate-800 leading-snug tracking-tight">
             Discover timeless places for every kind of traveler.
           </h2>
        </div>

      </div>

    </div>

  );
}
