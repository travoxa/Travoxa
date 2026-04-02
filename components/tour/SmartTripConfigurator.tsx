'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    HiUser, HiUsers, HiUserGroup, HiHome, HiStar, 
    HiLocationMarker, HiCheckCircle, HiChevronRight, HiChevronDown, 
    HiCalendar, HiTrash, HiCurrencyRupee, HiPlus, HiMinus,
    HiTruck, HiTicket, HiBookOpen, HiSparkles
} from 'react-icons/hi';
import { MdRestaurant, MdHotel, MdCameraAlt, MdDirectionsBus, MdLocalFireDepartment, MdHiking, MdParagliding, MdLandscape, MdTempleHindu, MdFlight, MdStars } from "react-icons/md";
import Image from 'next/image';

interface SmartTripConfiguratorProps {
    tour: any; // Ideally typed, but following the existing project style
}

function HiXCircle({ className }: { className?: string }) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    )
}

export default function SmartTripConfigurator({ tour }: SmartTripConfiguratorProps) {
    const [currentStep, setCurrentStep] = useState(1);
    
    // Configurator State
    const [selections, setSelections] = useState({
        travelerType: 'solo', // solo, duo, family, group, custom
        groupDetails: {
            adults: 1,
            kids: 0,
            infants: 0,
            genderPreference: 'none', // male, female, none
            duoType: 'couple', // couple, friends_m, friends_f, friends_mixed
            groupType: 'mixed', // boys, girls, mixed, corporate
        },
        stayType: '', // dormitory, budget, standard, premium
        selectedPropertyId: '',
        meals: {
            breakfast: false,
            lunch: false,
            dinner: false,
            fullPlan: false,
        },
        sightseeing: 'none', // scooty, shared, private, none
        activities: [] as Array<{ id: string, name: string, price: number, qty: number }>,
        transport: {
            type: 'none', // rail, bus, flight, self
            assistance: 'normal', // normal, tatkal
            flexibility: 'exact', // exact, flexible, budget
            window: { start: '', end: '' },
        },
    });

    // Helper to calculate total travelers
    const totalTravelers = useMemo(() => {
        const { travelerType, groupDetails } = selections;
        if (travelerType === 'solo') return 1;
        if (travelerType === 'duo') return 2;
        return groupDetails.adults + groupDetails.kids + groupDetails.infants;
    }, [selections]);

    // DERIVED DATA / RECOMMENDATIONS
    const recommendedVehicle = useMemo(() => {
        const n = totalTravelers;
        const options = tour.configurator?.sightseeingOptions || [];
        
        if (options.length > 0) {
            // Find best fit or return first
            return options[0];
        }

        if (n <= 1) return { name: 'Rent Scooty', type: 'scooty', pricePerDay: 500 };
        if (n <= 4) return { name: '4 Seater Cab', type: 'private', pricePerDay: 2500 };
        return { name: 'Private Van', type: 'private', pricePerDay: 4500 };
    }, [totalTravelers, tour]);

    // PRICING CALCULATION
    const priceSummary = useMemo(() => {
        const basePrice = (tour.price || 0) * totalTravelers;
        const config = tour.configurator || {};
        const days = tour.durationDays ? parseInt(tour.durationDays) : 3;
        const nights = tour.durationNights ? parseInt(tour.durationNights) : 2;

        let stayUpgrade = 0;
        if (selections.stayType && config.stayOptions) {
            const selectedStay = config.stayOptions.find((s: any) => s.type === selections.stayType);
            if (selectedStay) {
                stayUpgrade = selectedStay.pricePerNight * totalTravelers * nights;
            }
        }

        let mealsPrice = 0;
        const mealPricing = config.mealPricing || { breakfast: 150, lunch: 200, dinner: 250, fullPlan: 500 };
        if (selections.meals.fullPlan) {
            mealsPrice = mealPricing.fullPlan * totalTravelers * days;
        } else {
            if (selections.meals.breakfast) mealsPrice += mealPricing.breakfast * totalTravelers * days;
            if (selections.meals.lunch) mealsPrice += mealPricing.lunch * totalTravelers * days;
            if (selections.meals.dinner) mealsPrice += mealPricing.dinner * totalTravelers * days;
        }

        let sightseeingPrice = 0;
        if (selections.sightseeing !== 'none' && config.sightseeingOptions) {
            const opt = config.sightseeingOptions.find((s: any) => s.type === selections.sightseeing);
            if (opt) {
                if (opt.type === 'shared') sightseeingPrice = opt.pricePerDay * totalTravelers;
                else sightseeingPrice = opt.pricePerDay * days;
            } else {
                // Fallback
                if (selections.sightseeing === 'scooty') sightseeingPrice = 500 * days;
                else if (selections.sightseeing === 'private') sightseeingPrice = 2500 * days;
            }
        }

        const activitiesPrice = selections.activities.reduce((acc, act) => acc + (act.price * act.qty), 0);

        let transportFee = 0;
        const transportAssistance = config.transportAssistance || { railNormal: 100, railTatkal: 500, bus: 150, flight: 200 };
        if (selections.transport.type !== 'none') {
            const feeType = `${selections.transport.type}${selections.transport.assistance === 'tatkal' ? 'Tatkal' : 'Normal'}` as any;
            // Simplified mapping
            const fee = selections.transport.type === 'rail' 
                ? (selections.transport.assistance === 'tatkal' ? transportAssistance.railTatkal : transportAssistance.railNormal)
                : (selections.transport.type === 'bus' ? transportAssistance.bus : transportAssistance.flight);
            transportFee = fee * totalTravelers;
        }

        const grandTotal = basePrice + stayUpgrade + mealsPrice + sightseeingPrice + activitiesPrice + transportFee;

        return {
            basePrice,
            stayUpgrade,
            mealsPrice,
            sightseeingPrice,
            activitiesPrice,
            transportFee,
            grandTotal,
            perPerson: Math.round(grandTotal / totalTravelers)
        };
    }, [selections, totalTravelers, tour]);

    // RENDER HELPERS
    const StepHeader = ({ num, title, description }: { num: number, title: string, description?: string }) => (
        <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${currentStep === num ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                {num}
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
        </div>
    );

    const CardOption = ({ id, label, icon, subtext, selected, onClick, badge }: any) => (
        <button
            onClick={onClick}
            className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all text-center group ${selected ? 'border-black bg-gray-50 shadow-md' : 'border-gray-100 hover:border-gray-300 bg-white'}`}
        >
            {badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    {badge}
                </span>
            )}
            <div className={`text-3xl mb-3 ${selected ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {icon}
            </div>
            <span className={`font-bold text-sm ${selected ? 'text-black' : 'text-gray-700'}`}>{label}</span>
            {subtext && <span className="text-[10px] text-gray-400 mt-1 uppercase font-medium">{subtext}</span>}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* WIZARD COLUMN */}
            <div className="lg:col-span-8 space-y-6">
                
                {/* STEP 1: TRAVELER TYPE */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <StepHeader num={1} title="Who's Travelling?" description="Tailor your trip for the perfect group size." />
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <CardOption 
                            label="Solo" icon={<HiUser />} subtext="1 Person" 
                            selected={selections.travelerType === 'solo'} 
                            onClick={() => setSelections({...selections, travelerType: 'solo'})}
                        />
                        <CardOption 
                            label="Duo / Couple" icon={<HiUsers />} subtext="2 People" 
                            selected={selections.travelerType === 'duo'} 
                            onClick={() => setSelections({...selections, travelerType: 'duo'})}
                        />
                        <CardOption 
                            label="Family" icon={<HiHome />} subtext="Kids Included" 
                            selected={selections.travelerType === 'family'} 
                            onClick={() => setSelections({...selections, travelerType: 'family'})}
                        />
                        <CardOption 
                            label="Group" icon={<HiUserGroup />} subtext="Friends / Corporate" 
                            selected={selections.travelerType === 'group'} 
                            onClick={() => setSelections({...selections, travelerType: 'group'})}
                        />
                        <CardOption 
                            label="Custom" icon={<HiSparkles />} subtext="Large Members" 
                            selected={selections.travelerType === 'custom'} 
                            onClick={() => setSelections({...selections, travelerType: 'custom'})}
                        />
                    </div>
                </div>

                {/* STEP 2: GROUP DETAILS (DYNAMIC) */}
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={selections.travelerType}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm"
                    >
                        <StepHeader num={2} title="Group Details" description="Help us arrange the best stay and safety options." />
                        
                        {selections.travelerType === 'solo' && (
                            <div className="flex flex-col gap-6">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Gender Preference (For safety-matching / Dorms)</p>
                                <div className="flex gap-4">
                                    {['Male', 'Female', 'Prefer not to say'].map((gen) => (
                                        <button 
                                            key={gen}
                                            onClick={() => setSelections({...selections, groupDetails: {...selections.groupDetails, genderPreference: gen}})}
                                            className={`px-6 py-3 rounded-xl border-2 font-bold text-sm transition-all ${selections.groupDetails.genderPreference === gen ? 'border-black bg-black text-white' : 'border-gray-100 bg-white text-gray-600'}`}
                                        >
                                            {gen}
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                                    <HiStar className="text-blue-500 mt-1" />
                                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                        Solo travelers benefit from gender-specific dormitory allocation and safety-based matching on group activities.
                                    </p>
                                </div>
                            </div>
                        )}

                        {(selections.travelerType === 'family' || selections.travelerType === 'group' || selections.travelerType === 'custom') && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <p className="font-bold text-gray-900">Adults</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">12+ Years</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => setSelections({...selections, groupDetails: {...selections.groupDetails, adults: Math.max(1, selections.groupDetails.adults - 1)}})}
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                        >
                                            <HiMinus />
                                        </button>
                                        <span className="font-bold text-lg min-w-[20px] text-center">{selections.groupDetails.adults}</span>
                                        <button 
                                            onClick={() => setSelections({...selections, groupDetails: {...selections.groupDetails, adults: selections.groupDetails.adults + 1}})}
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                        >
                                            <HiPlus />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <p className="font-bold text-gray-900">Children</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">5-12 Years</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => setSelections({...selections, groupDetails: {...selections.groupDetails, kids: Math.max(0, selections.groupDetails.kids - 1)}})}
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                        >
                                            <HiMinus />
                                        </button>
                                        <span className="font-bold text-lg min-w-[20px] text-center">{selections.groupDetails.kids}</span>
                                        <button 
                                            onClick={() => setSelections({...selections, groupDetails: {...selections.groupDetails, kids: selections.groupDetails.kids + 1}})}
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                        >
                                            <HiPlus />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div>
                                        <p className="font-bold text-gray-900">Infants</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Under 5</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button 
                                            onClick={() => setSelections({...selections, groupDetails: {...selections.groupDetails, infants: Math.max(0, selections.groupDetails.infants - 1)}})}
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                        >
                                            <HiMinus />
                                        </button>
                                        <span className="font-bold text-lg min-w-[20px] text-center">{selections.groupDetails.infants}</span>
                                        <button 
                                            onClick={() => setSelections({...selections, groupDetails: {...selections.groupDetails, infants: selections.groupDetails.infants + 1}})}
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                        >
                                            <HiPlus />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {selections.travelerType === 'duo' && (
                            <div className="flex flex-col gap-6">
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Travelling As</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        {id: 'couple', label: 'Couple ❤️'},
                                        {id: 'friends_m', label: '2 Male Friends 👬'},
                                        {id: 'friends_f', label: '2 Female Friends 👭'},
                                        {id: 'friends_x', label: 'Mixed Friends 🧑‍🤝‍🧑'},
                                    ].map((opt) => (
                                        <button 
                                            key={opt.id}
                                            onClick={() => setSelections({...selections, groupDetails: {...selections.groupDetails, duoType: opt.id as any}})}
                                            className={`p-4 rounded-xl border-2 font-bold text-sm transition-all text-center ${selections.groupDetails.duoType === opt.id ? 'border-black bg-black text-white' : 'border-gray-50 bg-gray-50 text-gray-600 hover:border-gray-200'}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* STEP 3: STAY SELECTION */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <StepHeader num={3} title="Choose Your Stay" description="Pick the comfort level that suits your vibe." />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <CardOption 
                            label="Dormitory" icon={<HiBookOpen />} subtext="Starting ₹599" 
                            badge="Budget 🎒"
                            selected={selections.stayType === 'dormitory'} 
                            onClick={() => setSelections({...selections, stayType: 'dormitory'})}
                        />
                        <CardOption 
                            label="Standard Hotel" icon={<HiHome />} subtext="Private Room" 
                            badge="Comfort ✨"
                            selected={selections.stayType === 'standard'} 
                            onClick={() => setSelections({...selections, stayType: 'standard'})}
                        />
                        <CardOption 
                            label="Premium Hotel" icon={<HiStar />} subtext="Best Views" 
                            badge="Luxury 💎"
                            selected={selections.stayType === 'premium'} 
                            onClick={() => setSelections({...selections, stayType: 'premium'})}
                        />
                    </div>
                </div>

                {/* STEP 4: PROPERTY SELECTION */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <StepHeader num={4} title="Select Property" description="Handpicked stays for the best experience." />
                    <div className="space-y-4">
                        {(tour.configurator?.stayOptions || []).length > 0 ? (
                            tour.configurator.stayOptions.map((hotel: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setSelections({...selections, selectedPropertyId: hotel.name, stayType: hotel.type});
                                    }}
                                    className={`w-full flex items-center p-4 rounded-2xl border-2 transition-all gap-4 text-left ${selections.selectedPropertyId === hotel.name ? 'border-black bg-gray-50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                                >
                                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative bg-gray-100">
                                        {hotel.image ? (
                                            <Image src={hotel.image} alt={hotel.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300"><HiHome size={32} /></div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-gray-900">{hotel.name}</h4>
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">₹{hotel.pricePerNight}/night</span>
                                        </div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">{hotel.type} • {hotel.description || 'Verified Stay'}</p>
                                    </div>
                                    {selections.selectedPropertyId === hotel.name && (
                                        <HiCheckCircle className="text-2xl text-black shrink-0" />
                                    )}
                                </button>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">No specific properties defined for this tour level. Default itinerary stay applies.</p>
                        )}
                    </div>
                </div>

                {/* STEP 5: MEALS */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <StepHeader num={5} title="Meals & Food Options" description="Don't worry about where to eat." />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button 
                            onClick={() => setSelections({...selections, meals: {...selections.meals, lunch: !selections.meals.lunch}})}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${selections.meals.lunch ? 'border-black bg-black text-white' : 'border-gray-50 bg-gray-50 text-gray-600'}`}
                        >
                            <p className="font-bold text-sm">Add Lunch</p>
                            <p className="text-[10px] opacity-60">₹200 / person</p>
                        </button>
                        <button 
                            onClick={() => setSelections({...selections, meals: {...selections.meals, dinner: !selections.meals.dinner}})}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${selections.meals.dinner ? 'border-black bg-black text-white' : 'border-gray-50 bg-gray-50 text-gray-600'}`}
                        >
                            <p className="font-bold text-sm">Add Dinner</p>
                            <p className="text-[10px] opacity-60">₹250 / person</p>
                        </button>
                    </div>
                    <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="flex items-center gap-2 mb-2">
                            <MdRestaurant className="text-orange-500" />
                            <p className="text-xs font-bold text-orange-900 uppercase">Chef's Choice</p>
                        </div>
                        <p className="text-xs text-orange-700 font-medium">Upgrade to <span className="font-bold underline">Full Meal Plan</span> for ₹499/day to inclusive of all 3 meals + evening snacks.</p>
                    </div>
                </div>

                {/* STEP 6: SIGHTSEEING */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <StepHeader num={6} title="Sightseeing & Local Travel" description="How would you like to explore?" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CardOption 
                            label="Rent Scooty" icon={<HiTruck />} subtext="₹500 / day" 
                            selected={selections.sightseeing === 'scooty'} 
                            onClick={() => setSelections({...selections, sightseeing: 'scooty'})}
                        />
                        <CardOption 
                            label="Shared Sightseeing" icon={<HiUsers />} subtext="₹799 / person" 
                            selected={selections.sightseeing === 'shared'} 
                            onClick={() => setSelections({...selections, sightseeing: 'shared'})}
                        />
                        <CardOption 
                            label="Private Cab" icon={<MdDirectionsBus />} subtext="₹2499 / day" 
                            selected={selections.sightseeing === 'private'} 
                            onClick={() => setSelections({...selections, sightseeing: 'private'})}
                        />
                        <CardOption 
                            label="No Sightseeing" icon={<HiXCircle className="text-red-400" />} subtext="Self Managed" 
                            selected={selections.sightseeing === 'none'} 
                            onClick={() => setSelections({...selections, sightseeing: 'none'})}
                        />
                    </div>
                    <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                                <HiStar />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-900">Recommended for your group</p>
                                <p className="text-xs text-gray-400 font-medium">{recommendedVehicle.name} (Suitable for {totalTravelers} people)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* STEP 7: ACTIVITIES */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <StepHeader num={7} title="Add Activities" description="Upsell your adventure." />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            ...(tour.relatedActivities || []).map((a: any) => ({ 
                                id: a._id || a.id, 
                                name: a.title || a.name, 
                                price: a.price || 0, 
                                icon: <MdHiking /> 
                            })),
                            ...(tour.configurator?.addOnActivities || []).map((a: any, i: number) => ({ 
                                id: `addon-${i}`, 
                                name: a.name, 
                                price: a.price, 
                                icon: <HiSparkles /> 
                            }))
                        ].map((act) => {
                            const selected = selections.activities.find(s => s.id === act.id);
                            return (
                                <div 
                                    key={act.id} 
                                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${selected ? 'border-black bg-gray-50' : 'border-gray-50 bg-white'}`}
                                >
                                    <div className="text-2xl text-gray-400">{act.icon}</div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">{act.name}</p>
                                        <p className="text-xs text-gray-400 font-bold uppercase">₹{act.price} / person</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => {
                                                const existing = [...selections.activities];
                                                const idx = existing.findIndex(s => s.id === act.id);
                                                if (idx > -1) {
                                                    if (existing[idx].qty > 1) existing[idx].qty -= 1;
                                                    else existing.splice(idx, 1);
                                                }
                                                setSelections({...selections, activities: existing});
                                            }}
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                        >
                                            <HiMinus />
                                        </button>
                                        <span className="font-bold text-sm min-w-[15px] text-center">{selected ? selected.qty : 0}</span>
                                        <button 
                                             onClick={() => {
                                                const existing = [...selections.activities];
                                                const idx = existing.findIndex(s => s.id === act.id);
                                                if (idx > -1) existing[idx].qty += 1;
                                                else existing.push({id: act.id, name: act.name, price: act.price, qty: 1});
                                                setSelections({...selections, activities: existing});
                                            }}
                                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                        >
                                            <HiPlus />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* STEP 8: TRANSPORT */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <StepHeader num={8} title="Need Help With Tickets?" description="Professional assistance for confirmed booking." />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <CardOption 
                            label="Railway" icon={<HiBookOpen />} subtext="Tatkal Support" 
                            selected={selections.transport.type === 'rail'} 
                            onClick={() => setSelections({...selections, transport: {...selections.transport, type: 'rail'}})}
                        />
                        <CardOption 
                            label="Bus" icon={<MdDirectionsBus />} subtext="Sleeper / AC" 
                            selected={selections.transport.type === 'bus'} 
                            onClick={() => setSelections({...selections, transport: {...selections.transport, type: 'bus'}})}
                        />
                        <CardOption 
                            label="Flight" icon={<MdFlight />} subtext="Best Fares" 
                            selected={selections.transport.type === 'flight'} 
                            onClick={() => setSelections({...selections, transport: {...selections.transport, type: 'flight'}})}
                        />
                        <CardOption 
                            label="I'll Book Myself" icon={<HiCheckCircle className="text-green-500" />} subtext="No charge" 
                            selected={selections.transport.type === 'none'} 
                            onClick={() => setSelections({...selections, transport: {...selections.transport, type: 'none'}})}
                        />
                    </div>
                    
                    {selections.transport.type !== 'none' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ticket Assistance Type</p>
                                    <div className="flex gap-4">
                                        <button 
                                             onClick={() => setSelections({...selections, transport: {...selections.transport, assistance: 'normal'}})}
                                            className={`px-4 py-3 rounded-xl border-2 font-bold text-xs transition-all ${selections.transport.assistance === 'normal' ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-600'}`}
                                        >
                                            Normal Assistance
                                        </button>
                                        <button 
                                            onClick={() => setSelections({...selections, transport: {...selections.transport, assistance: 'tatkal'}})}
                                            className={`px-4 py-3 rounded-xl border-2 font-bold text-xs transition-all ${selections.transport.assistance === 'tatkal' ? 'border-black bg-black text-white' : 'border-gray-200 bg-white text-gray-600'}`}
                                        >
                                            Tatkal / Premium
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Travel Window (Flexibility)</p>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-xs text-gray-600 font-medium">Preferred Window: <span className="font-bold underline">10 April – 15 April</span></p>
                                        <p className="text-[10px] text-gray-400 leading-relaxed italic">"We will try to secure the best available confirmed ticket within your selected travel window."</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* STEP 9: DYNAMIC ITINERARY PREVIEW */}
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                    <StepHeader num={9} title="Your Personalized Itinerary" description="See exactly where you'll stay and how you'll travel." />
                    
                    <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                        {tour.itinerary?.map((day: any, idx: number) => {
                            // Resolve Stay
                            let resolvedStay = day.stay;
                            if (day.stayLevel && day.stayLevel !== 'none') {
                                const levelToMatch = selections.stayType || 'standard';
                                const opt = tour.configurator?.stayOptions?.find((s: any) => s.type === levelToMatch);
                                if (opt) resolvedStay = opt.name;
                            }

                            // Resolve Vehicle
                            let resolvedVehicle = day.transfer;
                            if (day.vehicleType && day.vehicleType !== 'none') {
                                const typeToMatch = selections.sightseeing === 'none' ? 'shared' : selections.sightseeing;
                                const opt = tour.configurator?.sightseeingOptions?.find((v: any) => v.type === typeToMatch);
                                if (opt) resolvedVehicle = opt.name;
                            }

                            return (
                                <div key={idx} className="relative pl-12 group">
                                    <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center z-10 group-hover:border-black transition-colors">
                                        <span className="text-xs font-bold text-gray-900">{day.day}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-1">{day.title}</h4>
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{day.description}</p>
                                        
                                        <div className="flex flex-wrap gap-2">
                                            {(resolvedStay || day.stayLevel !== 'none') && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                                                    <MdHotel className="text-blue-500 text-sm" />
                                                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-tight">Stay: {resolvedStay || 'As Per Package'}</span>
                                                </div>
                                            )}
                                            {(resolvedVehicle || day.vehicleType !== 'none') && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-100">
                                                    <HiTruck className="text-purple-500 text-sm" />
                                                    <span className="text-[10px] font-bold text-purple-700 uppercase tracking-tight">Travel: {resolvedVehicle || 'As Per Package'}</span>
                                                </div>
                                            )}
                                            {day.meal && (
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg border border-green-100">
                                                    <MdRestaurant className="text-green-500 text-sm" />
                                                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-tight">{day.meal}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>

            {/* SUMMARY COLUMN - STICKY */}
            <div className="lg:col-span-4 sticky top-12 space-y-6">
                <div className="bg-black text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <HiStar className="text-yellow-400" /> Your Trip Summary
                    </h3>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-sm opacity-80">
                            <span>Base Package ({totalTravelers} Pax)</span>
                            <span className="font-bold">₹{priceSummary.basePrice.toLocaleString()}</span>
                        </div>
                        {priceSummary.stayUpgrade > 0 && (
                            <div className="flex justify-between items-center text-sm opacity-80">
                                <span>Stay Upgrade</span>
                                <span className="font-bold text-blue-300">+ ₹{priceSummary.stayUpgrade.toLocaleString()}</span>
                            </div>
                        )}
                        {priceSummary.mealsPrice > 0 && (
                            <div className="flex justify-between items-center text-sm opacity-80">
                                <span>Meals Add-on</span>
                                <span className="font-bold text-green-300">+ ₹{priceSummary.mealsPrice.toLocaleString()}</span>
                            </div>
                        )}
                        {priceSummary.sightseeingPrice > 0 && (
                            <div className="flex justify-between items-center text-sm opacity-80">
                                <span>Sightseeing / Vehicle</span>
                                <span className="font-bold text-purple-300">+ ₹{priceSummary.sightseeingPrice.toLocaleString()}</span>
                            </div>
                        )}
                        {priceSummary.activitiesPrice > 0 && (
                            <div className="flex justify-between items-center text-sm opacity-80">
                                <span>Activities ({selections.activities.length})</span>
                                <span className="font-bold text-orange-300">+ ₹{priceSummary.activitiesPrice.toLocaleString()}</span>
                            </div>
                        )}
                        {priceSummary.transportFee > 0 && (
                            <div className="flex justify-between items-center text-sm opacity-80">
                                <span>Ticket Assistance</span>
                                <span className="font-bold text-yellow-300">+ ₹{priceSummary.transportFee.toLocaleString()}</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/10 pt-6 mb-8">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-xs text-white/50 font-bold uppercase tracking-widest mb-1">Grand Total</p>
                                <p className="text-4xl font-bold">₹{priceSummary.grandTotal.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-white/50 font-bold uppercase mb-1">Per Person</p>
                                <p className="text-lg font-bold text-green-400">₹{priceSummary.perPerson.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-green-500/20">
                            Build My Trip
                        </button>
                        <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all border border-white/10">
                            Reserve for ₹999
                        </button>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-4 text-white/30">
                        <MdStars size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-center">Secure Payment & Instant Confirmation</span>
                    </div>
                </div>

                {/* Trust / FAQ Note */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0">
                            <HiUsers className="text-gray-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900 mb-1">Need expert advice?</p>
                            <p className="text-[10px] text-gray-500 font-medium mb-3">Our travel designers can help you refine this itinerary perfectly for your group.</p>
                            <button className="text-xs font-bold text-black border-b border-black">Talk to Expert</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
