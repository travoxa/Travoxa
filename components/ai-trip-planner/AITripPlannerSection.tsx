"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
    FiChevronLeft, 
    FiMapPin as MapPin, 
    FiArrowRight, 
    FiCheck, 
    FiSearch, 
    FiCompass, 
    FiX, 
    FiAlertTriangle 
} from 'react-icons/fi';
import { FaUniversity as Landmark } from 'react-icons/fa';
import { AiOutlineLoading3Quarters as Loader2 } from 'react-icons/ai';
import OrbView from './OrbView';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

const TRIP_TYPES = [
    'Hill Station',
    'Beach',
    'Weekend Getaway',
    'Budget Trip',
    'Adventure',
    'Pilgrimage'
];

interface Place {
    _id: string;
    name: string;
    category: string;
    description: string;
    tags: string[];
    image?: string;
    distance?: number;
    location: {
        coordinates: [number, number];
    };
}

const AITripPlannerSection = () => {
    const { data: session } = useSession();
    const [viewState, setViewState] = useState<'landing' | 'questionnaire' | 'processing' | 'results'>('landing');
    
    // Questionnaire State
    const [modalStep, setModalStep] = useState(1);
    const [selectedTripType, setSelectedTripType] = useState<string | null>(null);
    const [secondaryTripTypes, setSecondaryTripTypes] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{ name: string; lat: number; lon: number } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isAutoDetecting, setIsAutoDetecting] = useState(false);
    
    // Processing State
    const [processingMessage, setProcessingMessage] = useState('Analyzing preferences...');
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    
    // Results State
    const [recommendations, setRecommendations] = useState<Place[]>([]);

    const searchTimeout = useRef<any>(null);

    const resetFlow = () => {
        setViewState('landing');
        setModalStep(1);
        setSelectedTripType(null);
        setSecondaryTripTypes([]);
        setSelectedLocation(null);
        setSearchQuery('');
        setRecommendations([]);
        setCompletedSteps([]);
    };

    const handleNext = () => {
        if (modalStep === 1) {
            setModalStep(2);
        } else if (modalStep === 2) {
            setModalStep(3);
        } else {
            startGeneration();
        }
    };

    const toggleSecondaryType = (type: string) => {
        setSecondaryTripTypes(prev => 
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const searchLocation = (query: string) => {
        setSearchQuery(query);
        if (query.trim().length < 3) {
            setSearchResults([]);
            return;
        }

        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=en`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 400);
    };

    const autoDetectLocation = () => {
        setIsAutoDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    const name = data.address.city || data.address.town || data.address.village || data.address.state || 'Selected Location';
                    setSelectedLocation({ name, lat: latitude, lon: longitude });
                    setSearchQuery(name);
                    setSearchResults([]);
                } catch (error) {
                    console.error('Reverse geocode error:', error);
                } finally {
                    setIsAutoDetecting(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                setIsAutoDetecting(false);
            }
        );
    };

    const startGeneration = async () => {
        setViewState('processing');
        setCompletedSteps([]);
        setProcessingMessage('Analyzing preferences...');

        const steps = [
            "Scanning global destinations...",
            "Filtering by trip style...",
            "Enriching data from database...",
            "Calculating scoring & distance...",
            "Refining top results for you..."
        ];

        let stepIndex = 0;
        const interval = setInterval(() => {
            if (stepIndex < steps.length) {
                setProcessingMessage(steps[stepIndex]);
                if (stepIndex > 0) {
                    setCompletedSteps(prev => [...prev, steps[stepIndex - 1]]);
                }
                stepIndex++;
            }
        }, 1500);

        try {
            const preferences = {
                primaryType: selectedTripType,
                secondaryTypes: secondaryTripTypes,
                departure: selectedLocation
            };

            const response = await fetch('/api/ai-recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(preferences)
            });

            const data = await response.json();
            if (data.success) {
                clearInterval(interval);
                setRecommendations(data.data);
                
                // Save trip automatically
                if (session?.user?.email) {
                    await fetch('/api/trips', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            profile: {
                                ...preferences,
                                travel_style: selectedTripType,
                                origin_city: selectedLocation?.name,
                                recommendations: data.data.slice(0, 3).map((r: any) => r.name)
                            } 
                        })
                    });
                }
                
                setViewState('results');
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Generation error:', error);
            clearInterval(interval);
            alert('Failed to generate recommendations. Please try again.');
            setViewState('landing');
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto min-h-[600px] flex flex-col items-center">
            <AnimatePresence mode="wait">
                {viewState === 'landing' && (
                    <motion.div 
                        key="landing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full flex flex-col items-center pt-10"
                    >
                        <div className="text-center mb-10">
                            <h1 className="text-4xl md:text-5xl font-bold text-[#050a05] mb-4 leading-tight">
                                Let's explore deep using AI
                            </h1>
                            <p className="text-gray-500 text-lg">Your personalized discovery engine</p>
                        </div>

                        <div className="w-full h-[350px] relative mb-12">
                            <OrbView />
                        </div>

                        <button 
                            onClick={() => setViewState('questionnaire')}
                            className="bg-[#050a05] text-white px-10 py-5 rounded-full text-xl font-bold flex items-center gap-3 hover:scale-105 transition-transform shadow-xl"
                        >
                            Let's start
                            <FiArrowRight size={24} />
                        </button>
                    </motion.div>
                )}

                {viewState === 'questionnaire' && (
                    <motion.div 
                        key="questionnaire"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-2xl mt-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <button onClick={() => modalStep > 1 ? setModalStep(s => s - 1) : setViewState('landing')} className="p-2 hover:bg-gray-100 rounded-full">
                                <FiChevronLeft size={24} />
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-gray-400 mb-1">{modalStep} / 3</span>
                                <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#050a05] transition-all duration-300" style={{ width: `${(modalStep / 3) * 100}%` }} />
                                </div>
                            </div>
                            <button onClick={() => setViewState('landing')} className="p-2 hover:bg-gray-100 rounded-full">
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
                            <h2 className="text-3xl font-bold text-[#050a05] mb-2">
                                {modalStep === 1 ? "What kind of trip are you planning?" : 
                                 modalStep === 2 ? "Select your second priority items" :
                                 "Where are you traveling from?"}
                            </h2>
                            <p className="text-gray-400 mb-8">
                                {modalStep === 1 ? "Pick a style that fits your mood" : 
                                 modalStep === 2 ? "You can pick multiple options" :
                                 "Manual search or auto-detect location"}
                            </p>

                            {modalStep < 3 ? (
                                <div className="flex flex-wrap justify-center gap-3">
                                    {TRIP_TYPES.map(type => {
                                        const isSelected = modalStep === 1 ? selectedTripType === type : secondaryTripTypes.includes(type);
                                        const isDisabled = modalStep === 2 && selectedTripType === type;
                                        return (
                                            <button 
                                                key={type}
                                                disabled={isDisabled}
                                                onClick={() => modalStep === 1 ? setSelectedTripType(type) : toggleSecondaryType(type)}
                                                className={`px-6 py-3 rounded-full border-2 transition-all ${
                                                    isSelected 
                                                    ? "bg-[#050a05] border-[#050a05] text-white" 
                                                    : isDisabled 
                                                        ? "opacity-30 border-gray-200" 
                                                        : "border-gray-100 hover:border-gray-300 text-gray-700"
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="w-full space-y-4">
                                    <div className="relative">
                                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input 
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => searchLocation(e.target.value)}
                                            placeholder="Search city or place..."
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#050a05] transition-all"
                                        />
                                        {isSearching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-gray-400" size={20} />}
                                    </div>

                                    {searchResults.length > 0 && (
                                        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg max-h-48 overflow-y-auto">
                                            {searchResults.map((item, idx) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => {
                                                        setSelectedLocation({ name: item.display_name.split(',')[0], lat: parseFloat(item.lat), lon: parseFloat(item.lon) });
                                                        setSearchQuery(item.display_name.split(',')[0]);
                                                        setSearchResults([]);
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-50 flex items-center gap-3"
                                                >
                                                    <MapPin size={16} className="text-gray-400" />
                                                    <span className="text-sm text-gray-700 truncate">{item.display_name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <button 
                                        onClick={autoDetectLocation}
                                        disabled={isAutoDetecting}
                                        className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                                            isAutoDetecting ? "bg-[#050a05] text-white" : "bg-gray-50 hover:bg-gray-100 text-[#050a05]"
                                        }`}
                                    >
                                        {isAutoDetecting ? <Loader2 className="animate-spin" size={20} /> : <FiCompass size={20} />}
                                        <span className="font-bold">{isAutoDetecting ? "Detecting..." : "Use current location"}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Footer Button */}
                        <div className="mt-10">
                            <button 
                                onClick={handleNext}
                                disabled={
                                    (modalStep === 1 && !selectedTripType) || 
                                    (modalStep === 2 && secondaryTripTypes.length === 0) ||
                                    (modalStep === 3 && !selectedLocation)
                                }
                                className="w-full bg-[#050a05] text-white py-5 rounded-full text-lg font-bold disabled:opacity-20 transition-all shadow-xl"
                            >
                                {modalStep === 3 ? "Generate Plan" : "Next"}
                            </button>
                        </div>
                    </motion.div>
                )}

                {viewState === 'processing' && (
                    <motion.div 
                        key="processing"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full max-w-2xl flex flex-col items-center pt-20"
                    >
                        <Loader2 className="animate-spin text-[#050a05] mb-6" size={60} />
                        <h2 className="text-3xl font-bold text-[#050a05] mb-2">Generation in progress</h2>
                        <p className="text-gray-400 text-center mb-12">We're finding the best spots based on your preferences.</p>
                        
                        <div className="w-full max-w-md space-y-4">
                            {completedSteps.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-gray-300">
                                    <FiCheck size={18} className="text-[#47a82b]/50" />
                                    <span className="text-sm font-medium">{step}</span>
                                </div>
                            ))}
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[#050a05] animate-pulse" />
                                <span className="text-sm font-bold text-[#050a05]">{processingMessage}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {viewState === 'results' && (
                    <motion.div 
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full flex flex-col"
                    >
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <h2 className="text-4xl font-bold text-[#050a05]">Top Recommendations</h2>
                                <button onClick={resetFlow} className="text-gray-400 font-bold underline text-sm mt-2">New Search</button>
                            </div>
                        </div>

                        {/* Warning Banner */}
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 mb-8">
                            <FiAlertTriangle className="text-amber-600 shrink-0" size={20} />
                            <p className="text-sm text-amber-900">
                                AI-generated locations may be incorrect. You can contribute by suggesting edits to improve future results.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {recommendations.map((item, idx) => (
                                <div key={item._id || idx} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center opacity-20">
                                                <Landmark size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                            {item.category}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-[#050a05]">{item.name}</h3>
                                            {item.distance && (
                                                <span className="text-xs font-bold bg-[#050a05] text-white px-2 py-1 rounded-lg">
                                                    {Math.round(item.distance)}km
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                            {item.description || "Finding more details about this special place..."}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags?.slice(0, 3).map((tag, i) => (
                                                <span key={i} className="text-[10px] font-bold bg-gray-50 text-gray-500 px-2 py-1 rounded-full border border-gray-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AITripPlannerSection;
