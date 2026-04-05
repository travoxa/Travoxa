"use client";

import React from 'react';
import { HiChevronRight } from "react-icons/hi2";

interface BookingFlowBadgeProps {
    themeColor?: 'emerald' | 'orange' | 'violet' | 'slate';
}

const BookingFlowBadge: React.FC<BookingFlowBadgeProps> = ({ themeColor = 'emerald' }) => {
    const colorMap = {
        emerald: 'text-emerald-400',
        orange: 'text-orange-400',
        violet: 'text-violet-400',
        slate: 'text-slate-400',
    };

    const activeColor = colorMap[themeColor] || 'text-emerald-400';

    const steps = [
        { label: "Select Package" },
        { label: "Send Enquiry" },
        { label: "Verify & Reserve" },
        { label: "Pay Full Amount" }
    ];

    return (
        <div className="w-full py-2 mb-10">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl transition-all duration-300 hover:bg-black group">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className="flex items-center gap-2.5">
                            <span className={`flex items-center justify-center w-6 h-6 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold text-white transition-colors group-hover:border-white/40`}>
                                {index + 1}
                            </span>
                            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-white whitespace-nowrap">
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <HiChevronRight className="text-white/20 shrink-0" size={16} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default BookingFlowBadge;
