"use client";

import React from 'react';

interface SpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: string;
    variant?: 'emerald' | 'white';
    className?: string;
    fullscreen?: boolean;
    text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
    size = 'md',
    color,
    variant = 'emerald',
    className = '',
    fullscreen = false,
    text
}) => {
    const sizeClasses = {
        xs: 'w-4 h-4 border-2',
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-4',
        lg: 'w-16 h-16 border-4',
        xl: 'w-24 h-24 border-8'
    };

    const variantClasses = {
        emerald: 'border-emerald-500',
        white: 'border-white'
    };

    const finalColor = color || variantClasses[variant];

    const spinner = (
        <div className="flex flex-col items-center justify-center">
            <div 
                className={`${sizeClasses[size]} ${finalColor} border-t-transparent rounded-full animate-spin ${className}`} 
            />
            {text && (
                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-800">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullscreen) {
        return (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white/90 backdrop-blur-sm">
                {spinner}
            </div>
        );
    }

    return spinner;
};

export default Spinner;
