"use client";

import React from 'react';
import { FiMapPin, FiClock, FiInstagram, FiImage } from 'react-icons/fi';

interface TimelineStepProps {
    step: any;
    index: number;
    isLast: boolean;
}

const TimelineStep: React.FC<TimelineStepProps> = ({ step, index, isLast }) => {
    const isEven = index % 2 === 0;

    return (
        <div className={`relative flex items-center justify-between mb-12 md:mb-24 w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            {/* Center Line & Dot */}
            <div className="absolute left-[20px] md:left-1/2 top-4 md:top-1/2 h-full w-[2px] bg-slate-100 -translate-x-1/2 z-0 hidden md:block" />
            <div className="absolute left-[20px] md:left-1/2 top-4 md:top-8 w-10 h-10 -translate-x-1/2 z-10 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-full border-4 border-emerald-500 shadow-lg flex items-center justify-center text-emerald-600 font-bold text-sm">
                    {index + 1}
                </div>
            </div>

            {/* Content Sidebar (Blank/Spacer on desktop) */}
            <div className="hidden md:block w-[42%]" />

            {/* Content Main */}
            <div 
                className={`w-full md:w-[42%] pl-12 md:pl-0 flex flex-col ${isEven ? 'md:items-start' : 'md:items-end md:text-right'}`}
                data-aos={isEven ? "fade-right" : "fade-left"}
            >
                <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 w-full hover:shadow-2xl transition-shadow duration-500">
                    {/* Meta */}
                    <div className={`flex flex-wrap items-center gap-4 mb-4 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase">
                            <FiMapPin size={14} />
                            {step.location}
                        </div>
                        {step.time && (
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                                <FiClock size={14} />
                                {step.time}
                            </div>
                        )}
                    </div>

                    <h4 className="text-xl font-bold text-slate-900 Mont mb-4 leading-tight">
                        {step.title || `Stop ${index + 1}: ${step.location}`}
                    </h4>
                    
                    <p className="text-slate-600 Inter leading-relaxed mb-6">
                        {step.description}
                    </p>

                    {/* Media */}
                    {(step.images?.length > 0 || step.igLink) && (
                        <div className={`grid gap-4 w-full ${step.images?.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                            {step.images?.map((img: string, i: number) => (
                                <div key={i} className="relative aspect-video rounded-2xl overflow-hidden group">
                                    <img 
                                        src={img} 
                                        alt={step.location}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                            {step.igLink && (
                                <a 
                                    href={step.igLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="col-span-full relative p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100 flex items-center justify-between group hover:from-pink-100 hover:to-purple-100 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white">
                                            <FiInstagram size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-slate-900 Mont uppercase tracking-wider">Instagram Reel</p>
                                            <p className="text-[10px] text-slate-500 truncate max-w-[150px] md:max-w-[250px]">{step.igLink}</p>
                                        </div>
                                    </div>
                                    <div className="text-pink-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                        VIEW <FiInstagram size={14} />
                                    </div>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Timeline: React.FC<{ steps: any[] }> = ({ steps }) => {
    if (!steps || steps.length === 0) return null;

    return (
        <div className="relative py-12">
            {/* The line for all viewports (on desktop it's centered, on mobile it's on the left) */}
            <div className="absolute left-[20px] md:left-1/2 top-4 bottom-4 w-[2px] bg-slate-100 md:-translate-x-1/2 z-0" />
            
            <div className="relative z-10 space-y-4">
                {steps.map((step, index) => (
                    <TimelineStep 
                        key={index} 
                        step={step} 
                        index={index} 
                        isLast={index === steps.length - 1} 
                    />
                ))}
            </div>
        </div>
    );
};

export default Timeline;
