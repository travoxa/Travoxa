'use client';

import React, { useState } from 'react';
import { HiX, HiUserGroup, HiCalendar, HiPhone, HiMail, HiUser } from 'react-icons/hi';
import { useSession } from 'next-auth/react';

interface EnquireModalProps {
    isOpen: boolean;
    onClose: () => void;
    tourId: string;
    tourTitle: string;
    availabilityDate?: string;
    userPhone?: string;
    selectedPeople?: number;
    selectedHotelType?: string;
    selectedRooms?: number;
    calculatedPrice?: number;
}

export default function EnquireModal({
    isOpen,
    onClose,
    tourId,
    tourTitle,
    availabilityDate,
    userPhone,
    selectedPeople,
    selectedHotelType
}: EnquireModalProps) {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        members: selectedPeople || 2,
        date: availabilityDate && availabilityDate !== 'Flexible' ? availabilityDate : '',
        phone: userPhone || ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/tours/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tourId,
                    members: formData.members,
                    date: formData.date || 'Flexible',
                    userDetails: {
                        // Name and Email will be inferred from session on backend
                        phone: formData.phone
                    }
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit request');
            }

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                // Optional: reset form or redirect
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <HiX size={20} />
                </button>

                {/* Header */}
                <div className="bg-gray-50 border-b border-gray-100 px-6 py-5">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">Enquire for {tourTitle}</h3>
                    <p className="text-sm text-gray-500 mt-1">Fill in the details to check availability</p>
                </div>

                <div className="p-6">
                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                ✓
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Request Sent!</h4>
                            <p className="text-gray-600">We have received your enquiry. You can track the status in your Dashboard.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                                    {error}
                                </div>
                            )}

                            {/* Trip Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">No. of Members</label>
                                    <div className="relative">
                                        <HiUserGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            required
                                            value={formData.members}
                                            onChange={e => setFormData({ ...formData, members: parseInt(e.target.value) })}
                                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Travel Date</label>
                                    <div className="relative">
                                        <HiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Flexible"
                                            value={formData.date}
                                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all outline-none font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100 my-2" />

                            {/* Contact Details */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                                        Phone Number <span className="font-normal normal-case text-gray-400">(Optional - for WhatsApp reply)</span>
                                    </label>
                                    <div className="relative">
                                        <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all outline-none text-sm"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-200 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending Request...' : 'Send Enquiry Request'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
