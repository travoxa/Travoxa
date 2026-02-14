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
    tourId,
    tourTitle,
    userPhone
}: BookingWidgetProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState<string>('');

    // Determine what to show
    const showBatches = availabilityBatches && availabilityBatches.length > 0;

    // Auto-select first batch
    React.useEffect(() => {
        if (showBatches && availabilityBatches && availabilityBatches.length > 0) {
            const firstBatch = availabilityBatches[0];
            setSelectedBatch(`${firstBatch.startDate} to ${firstBatch.endDate}`);
        }
    }, [showBatches, availabilityBatches]);

    return (
        <>
            <div className="sticky top-28 bg-white rounded-3xl border border-gray-200 p-6 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Image src="/logo.png" alt="logo" width={100} height={100} />
                </div>

                <div className="mb-6">
                    <p className="text-gray-500 text-sm mb-1">Starting from</p>
                    <div className="flex items-baseline gap-2 flex-wrap">
                        {earlyBirdDiscount && earlyBirdDiscount > 0 ? (
                            <>
                                <span className="text-3xl font-bold text-gray-900">
                                    ₹{Math.round(price * (1 - earlyBirdDiscount / 100))}
                                </span>
                                <span className="text-lg text-gray-400 line-through decoration-red-500">₹{price}</span>
                            </>
                        ) : (
                            <span className="text-3xl font-bold text-gray-900">₹{price}</span>
                        )}
                        <span className="text-gray-400 text-sm">/ person</span>
                    </div>
                    {earlyBirdDiscount && earlyBirdDiscount > 0 ? (
                        <div className="inline-block bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full mt-2 shadow-md">
                            {earlyBirdDiscount}% Early Bird Discount
                        </div>
                    ) : null}
                </div>

                <div className="space-y-4 mb-6">
                    <div className="border border-gray-200 rounded-xl p-3 flex items-start gap-3 hover:border-green-500 transition-colors">
                        <HiCalendar className="text-gray-400 text-xl mt-1" />
                        <div className="w-full">
                            <p className="text-xs text-gray-400 font-medium mb-1">Available Batches</p>
                            {showBatches ? (
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
            />
        </>
    );
}
