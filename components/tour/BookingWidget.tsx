'use client';

import React, { useState } from 'react';
import Image from "next/image";
import { HiCalendar, HiUserGroup, HiCurrencyRupee, HiDownload } from "react-icons/hi";
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
    pricing?: { people: number; hotelType: string; rooms: number; packagePrice: number; pricePerPerson: number }[];
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<string>('');

    // Dynamic Pricing State
    const [selectedPeople, setSelectedPeople] = useState<number>(0);
    const [selectedHotel, setSelectedHotel] = useState<string>('');
    const [selectedRooms, setSelectedRooms] = useState<number>(0);
    const [calculatedPrice, setCalculatedPrice] = useState<number>(price);
    const [pricePerPerson, setPricePerPerson] = useState<number>(price);

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
            // Default to min people
            const minPeople = Math.min(...pricing.map(p => p.people));
            setSelectedPeople(minPeople);

            // Find options for min people
            const options = pricing.filter(p => p.people === minPeople);
            if (options.length > 0) {
                setSelectedHotel(options[0].hotelType); // Default first hotel type
                setSelectedRooms(options[0].rooms); // Default rooms for that
            }
        }
    }, [hasDynamicPricing, pricing]);

    // Update Price when selections change
    React.useEffect(() => {
        if (hasDynamicPricing && pricing) {
            const match = pricing.find(p =>
                p.people === selectedPeople &&
                p.hotelType === selectedHotel &&
                p.rooms === selectedRooms
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


    const currentPrice = hasDynamicPricing ? pricePerPerson : price;

    return (
        <>
            <div className="sticky top-28 bg-white rounded-3xl border border-gray-200 p-6 overflow-hidden">
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

                    {/* Group Info / Slots */}
                    {totalSlots && (
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
                    {bookingAmount && (
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
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                        Check Availability / Enquire
                    </button>
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
            />
        </>
    );
}
