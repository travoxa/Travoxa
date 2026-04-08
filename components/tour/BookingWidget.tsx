'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from "next/image";
import { HiCalendar, HiUserGroup, HiCurrencyRupee, HiDownload, HiSparkles, HiChevronDown } from "react-icons/hi";
import EnquireModal from './EnquireModal';

interface BookingWidgetProps {
    price: number;
    earlyBirdDiscount?: number;
    availabilityDate?: string;
    totalSlots?: number;
    bookedSlots?: number;
    bookingAmount?: number;
    brochureUrl?: string;
    availabilityBatches?: { startDate: string; endDate: string; active: boolean }[];
    pricing?: { people: number; hotelType: string; travelStyle?: string; rooms: number; packagePrice: number; pricePerPerson: number }[];
    tourId: string;
    tourTitle: string;
    userPhone?: string;
}

export default function BookingWidget({
    price,
    earlyBirdDiscount,
    availabilityDate,
    availabilityBatches,
    totalSlots,
    bookedSlots,
    bookingAmount,
    brochureUrl,
    pricing,
    tourId,
    tourTitle,
    userPhone
}: BookingWidgetProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<string>('');

    // Dynamic Pricing State
    const [selectedPeople, setSelectedPeople] = useState<number>(0);
    const [selectedHotel, setSelectedHotel] = useState<string>('');
    const [selectedRooms, setSelectedRooms] = useState<number>(0);
    const [selectedTravelStyle, setSelectedTravelStyle] = useState<string>('');
    const [calculatedPrice, setCalculatedPrice] = useState<number>(price);
    const [pricePerPerson, setPricePerPerson] = useState<number>(price);
    const [showPriceOptimizer, setShowPriceOptimizer] = useState(false);
    const [optimizationNotes, setOptimizationNotes] = useState('');

    // Determine what to show
    const showBatches = availabilityBatches && availabilityBatches.length > 0;
    const hasDynamicPricing = pricing && pricing.length > 0;

    // Auto-select first batch
    React.useEffect(() => {
        if (showBatches && availabilityBatches && availabilityBatches.length > 0) {
            const firstBatch = availabilityBatches[0];
            setSelectedBatch(`${firstBatch.startDate} to ${firstBatch.endDate}`);
        }
    }, [showBatches, availabilityBatches]);

    // Initialize Dynamic Pricing
    React.useEffect(() => {
        if (hasDynamicPricing && pricing) {
            // Default to the option with the LOWEST pricePerPerson (to match "Starting from" price)
            let cheapestOption = pricing[0];
            let minPrice = Number.MAX_VALUE;

            for (const p of pricing) {
                if (p.pricePerPerson < minPrice) {
                    minPrice = p.pricePerPerson;
                    cheapestOption = p;
                }
            }

            if (cheapestOption) {
                setSelectedPeople(cheapestOption.people);
                setSelectedHotel(cheapestOption.hotelType);
                setSelectedRooms(cheapestOption.rooms);
                setSelectedTravelStyle(cheapestOption.travelStyle || 'Full Private');
            }
        }
    }, [hasDynamicPricing, pricing]);

    // Update Price when selections change
    React.useEffect(() => {
        if (hasDynamicPricing && pricing) {
            const match = pricing.find(p =>
                p.people === selectedPeople &&
                p.hotelType === selectedHotel &&
                p.rooms === selectedRooms &&
                (p.travelStyle || 'Full Private') === selectedTravelStyle
            );

            if (match) {
                setCalculatedPrice(match.packagePrice);
                setPricePerPerson(match.pricePerPerson || Math.round(match.packagePrice / match.people));
            } else {
                // Fallback / Reset if invalid combination (though UI should prevent this)
                // Try to find a valid match for just people and hotel
                const partialMatch = pricing.find(p => p.people === selectedPeople && p.hotelType === selectedHotel);
                if (partialMatch) {
                    setSelectedRooms(partialMatch.rooms);
                    setSelectedTravelStyle(partialMatch.travelStyle || 'Full Private');
                    setCalculatedPrice(partialMatch.packagePrice);
                    setPricePerPerson(partialMatch.pricePerPerson || Math.round(partialMatch.packagePrice / partialMatch.people));
                }
            }
        } else {
            setCalculatedPrice(price);
            setPricePerPerson(price);
        }
    }, [selectedPeople, selectedHotel, selectedRooms, pricing, hasDynamicPricing, price]);


    // Derived Options for Dropdowns
    const peopleOptions = React.useMemo(() => {
        if (!hasDynamicPricing || !pricing) return [];
        return Array.from(new Set(pricing.map(p => p.people))).sort((a, b) => a - b);
    }, [pricing, hasDynamicPricing]);

    const hotelOptions = React.useMemo(() => {
        if (!hasDynamicPricing || !pricing) return [];
        return Array.from(new Set(pricing.filter(p => p.people === selectedPeople).map(p => p.hotelType)));
    }, [pricing, hasDynamicPricing, selectedPeople]);

    const roomOptions = React.useMemo(() => {
        if (!hasDynamicPricing || !pricing) return [];
        return Array.from(new Set(pricing.filter(p =>
            p.people === selectedPeople && p.hotelType === selectedHotel
        ).map(p => p.rooms))).sort((a, b) => a - b);
    }, [pricing, hasDynamicPricing, selectedPeople, selectedHotel]);
 
    const travelStyleOptions = React.useMemo(() => {
        if (!hasDynamicPricing || !pricing) return [];
        return Array.from(new Set(pricing.filter(p =>
            p.people === selectedPeople && p.hotelType === selectedHotel && p.rooms === selectedRooms
        ).map(p => p.travelStyle || 'Full Private')));
    }, [pricing, hasDynamicPricing, selectedPeople, selectedHotel, selectedRooms]);
 
    const currentPrice = hasDynamicPricing ? pricePerPerson : price;
 
    // Optimization Suggestions
    const optimizationOptions = React.useMemo(() => {
        if (!hasDynamicPricing || !pricing) return [];
        
        const suggestions = [];
        const currentStylePriority = selectedTravelStyle === 'Full Private' ? 3 : selectedTravelStyle === 'Mix' ? 2 : 1;
 
        // Suggest cheaper travel styles
        const otherStyles = pricing.filter(p => 
            p.people === selectedPeople && 
            p.hotelType === selectedHotel && 
            p.rooms === selectedRooms &&
            (p.travelStyle || 'Full Private') !== selectedTravelStyle
        );
 
        for (const s of otherStyles) {
            const stylePriority = (s.travelStyle || 'Full Private') === 'Full Private' ? 3 : (s.travelStyle || 'Full Private') === 'Mix' ? 2 : 1;
            if (stylePriority < currentStylePriority) {
                const saving = currentPrice - (earlyBirdDiscount ? Math.round(s.pricePerPerson * (1 - earlyBirdDiscount / 100)) : s.pricePerPerson);
                if (saving > 0) {
                    suggestions.push({
                        type: 'style',
                        label: `Switch to ${s.travelStyle}`,
                        saving,
                        target: s.travelStyle
                    });
                }
            }
        }
 
        return suggestions;
    }, [pricing, hasDynamicPricing, selectedPeople, selectedHotel, selectedRooms, selectedTravelStyle, currentPrice, earlyBirdDiscount]);


    return (
        <>
            <div className="sticky top-28 bg-white rounded-3xl border border-gray-200 p-6 flex flex-col max-h-[calc(100vh-130px)] overflow-y-auto custom-scrollbar shadow-sm">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Image src="/logo.png" alt="logo" width={100} height={100} />
                </div>

                <div className="mb-6">
                    <p className="text-gray-500 text-sm mb-1">{hasDynamicPricing ? 'Price Per Person' : 'Starting from'}</p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                        {earlyBirdDiscount && earlyBirdDiscount > 0 ? (
                            <>
                                <span className="text-3xl font-bold text-gray-900">
                                    ₹{Math.round(currentPrice * (1 - earlyBirdDiscount / 100))}
                                </span>
                                <span className="text-lg text-gray-400 line-through decoration-red-500">₹{currentPrice}</span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-gray-900">₹{currentPrice}</span>
                        )}
                        <span className="text-gray-400 text-sm">/ person</span>
                    </div>
                    {hasDynamicPricing && (
                        <p className="text-xs text-gray-500 mt-1">
                            Total Package: <span className="font-bold">₹{earlyBirdDiscount ? Math.round(calculatedPrice * (1 - earlyBirdDiscount / 100)) : calculatedPrice}</span> ({selectedPeople} Pax)
                        </p>
                    )}
                    {earlyBirdDiscount && earlyBirdDiscount > 0 ? (
                        <div className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mt-2 shadow-md">
                            {earlyBirdDiscount}% Early Bird Discount
                        </div>
                    ) : null}
                </div>

                <div className="space-y-4 mb-6">

                    {/* Dynamic Pricing Selectors */}
                    {hasDynamicPricing && (
                        <div className="space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-500 font-medium ml-1">People</label>
                                    <select
                                        value={selectedPeople}
                                        onChange={(e) => setSelectedPeople(Number(e.target.value))}
                                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-green-500"
                                    >
                                        {peopleOptions.map(p => <option key={p} value={p}>{p} Pax</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 font-medium ml-1">Hotel</label>
                                    <select
                                        value={selectedHotel}
                                        onChange={(e) => setSelectedHotel(e.target.value)}
                                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-green-500"
                                    >
                                        {hotelOptions.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-medium ml-1">Rooms</label>
                                <select
                                    value={selectedRooms}
                                    onChange={(e) => setSelectedRooms(Number(e.target.value))}
                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-green-500"
                                >
                                    {roomOptions.map(r => <option key={r} value={r}>{r} Rooms</option>)}
                                </select>
                            </div>
                            {travelStyleOptions.length > 1 && (
                                <div>
                                    <label className="text-xs text-gray-500 font-medium ml-1">Travel Style</label>
                                    <select
                                        value={selectedTravelStyle}
                                        onChange={(e) => setSelectedTravelStyle(e.target.value)}
                                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-green-500"
                                    >
                                        {travelStyleOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="border border-gray-200 rounded-xl p-3 flex items-start gap-3 hover:border-green-500 transition-colors">
                        <HiCalendar className="text-gray-400 text-xl mt-1" />
                        <div className="w-full">
                            <p className="text-xs text-gray-400 font-medium mb-1">Available Batches</p>
                            {showBatches && availabilityBatches ? (
                                <div className="space-y-2">
                                    <select
                                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-green-500"
                                        value={selectedBatch}
                                        onChange={(e) => setSelectedBatch(e.target.value)}
                                    >
                                        <option value="">Select a Batch</option>
                                        {availabilityBatches.map((batch, idx) => (
                                            <option key={idx} value={`${batch.startDate} to ${batch.endDate}`}>
                                                {batch.startDate} - {batch.endDate}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <p className="text-sm font-semibold text-gray-900">
                                    {availabilityDate || 'Choose Availability'}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center mt-1">
                        <button
                            onClick={() => {
                                setSelectedBatch('');
                                setIsModalOpen(true);
                            }}
                            className="text-[11px] font-bold text-gray-500 hover:text-green-600 transition-colors flex items-center gap-1.5 underline underline-offset-4"
                        >
                            Request a different date
                        </button>
                    </div>

                    {/* Group Info / Slots */}
                    {!!totalSlots && (
                        <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
                                <HiUserGroup />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Group Size</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {totalSlots} Slots
                                    </p>
                                    {bookedSlots !== undefined && (
                                        <span className="text-xs text-orange-600 font-medium">
                                            ({Number(totalSlots) - Number(bookedSlots || 0)} Left)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Booking Amount */}
                    {!!bookingAmount && (
                        <div className="border border-gray-200 rounded-xl p-3 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 text-sm">
                                <HiCurrencyRupee />
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 font-medium">Booking Amount</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    ₹{bookingAmount} <span className="text-gray-400 font-normal">to block seat</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3 mb-8">
                    <button
                        onClick={() => {
                            router.push(`/tour/${tourId}/book`);
                        }}
                        className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200 flex items-center justify-center gap-2"
                    >
                        Build My Trip <HiSparkles className="text-yellow-400" />
                    </button>
 
                    {/* Price Optimizer / Reduction Card */}
                    <div className="bg-green-50/30 rounded-2xl border border-green-100/50 overflow-hidden shadow-sm">
                        <button
                            onClick={() => setShowPriceOptimizer(!showPriceOptimizer)}
                            className="w-full px-4 py-3.5 flex items-center justify-between text-left transition-all hover:bg-green-50"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <HiSparkles size={14} />
                                </div>
                                <span className="text-[11px] font-bold text-green-800 uppercase tracking-widest leading-none">Want to reduce price?</span>
                            </div>
                            <span className={`text-green-600 transition-transform duration-300 ${showPriceOptimizer ? 'rotate-180' : ''}`}>
                                <HiChevronDown />
                            </span>
                        </button>
 
                        {showPriceOptimizer && (
                            <div className="px-4 pb-5 space-y-4 animate-in slide-in-from-top-4 duration-300">
                                {optimizationOptions.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider ml-1">Smart Suggestions</p>
                                        {optimizationOptions.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedTravelStyle(opt.target as string)}
                                                className="w-full p-2.5 bg-white border border-green-100 rounded-xl text-[10px] text-left flex justify-between items-center group hover:border-green-500 hover:shadow-sm transition-all"
                                            >
                                                <span className="font-bold text-gray-700">{opt.label}</span>
                                                <span className="bg-green-500 text-white px-2.5 py-1 rounded-full font-black shadow-sm">Save ₹{opt.saving}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
 
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between px-1">
                                        <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider">Custom Request</p>
                                        <span className="text-[9px] text-gray-400 font-medium">Add notes for reduction</span>
                                    </div>
                                    <textarea
                                        value={optimizationNotes}
                                        onChange={(e) => setOptimizationNotes(e.target.value)}
                                        placeholder="e.g. Remove lunch/dinner, switch to shared cab or economy stay..."
                                        className="w-full p-3 bg-white border border-green-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none h-20 placeholder:text-gray-300"
                                    />
                                    <button 
                                        onClick={() => {
                                            router.push(`/tour/${tourId}/book?notes=${encodeURIComponent(optimizationNotes)}`);
                                        }}
                                        className="w-full bg-green-600 text-white text-[11px] font-bold py-3 rounded-xl hover:bg-green-700 transition-all active:scale-95 shadow-md shadow-green-200 flex items-center justify-center gap-2 group"
                                    >
                                        Start Building with Reduction <HiSparkles className="text-yellow-300 group-hover:scale-125 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
 
                    {brochureUrl && (
                        <a
                            href={brochureUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-white text-gray-900 border border-gray-200 font-bold py-3 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                            <HiDownload className="text-lg" /> Download Brochure
                        </a>
                    )}
                </div>

                <div className="text-center">
                    <p className="text-xs text-gray-400 mb-2">Secure payment & instant confirmation</p>
                    <div className="flex justify-center gap-4 text-gray-300">
                        {/* Trust Badges Mock */}
                        <div className="w-8 h-8 rounded bg-gray-100" />
                        <div className="w-8 h-8 rounded bg-gray-100" />
                        <div className="w-8 h-8 rounded bg-gray-100" />
                    </div>
                </div>
            </div>

            <EnquireModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                tourId={tourId}
                tourTitle={tourTitle}
                availabilityDate={selectedBatch || availabilityDate}
                userPhone={userPhone}
                selectedPeople={hasDynamicPricing ? selectedPeople : undefined}
                selectedHotelType={hasDynamicPricing ? selectedHotel : undefined}
                selectedRooms={hasDynamicPricing ? selectedRooms : undefined}
                calculatedPrice={hasDynamicPricing ? calculatedPrice : undefined}
                initialNotes={optimizationNotes}
            />
        </>
    );
}
