"use client";

import React, { useState, useEffect } from "react";
import { HiX, HiDuplicate, HiCheck } from "react-icons/hi";
import {
    FaTwitter,
    FaFacebookF,
    FaWhatsapp,
    FaRedditAlien,
    FaEnvelope
} from "react-icons/fa";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
}

export default function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    useEffect(() => {
        // Ensure we have the full URL if only a path is provided
        if (typeof window !== "undefined") {
            const fullUrl = url.startsWith("http")
                ? url
                : `${window.location.origin}${url}`;
            setShareUrl(fullUrl);
        }
    }, [url]);

    if (!isOpen) return null;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    const shareOptions = [
        {
            name: "X (Twitter)",
            icon: <FaTwitter size={24} />,
            color: "bg-black text-white",
            link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`,
        },
        {
            name: "Facebook",
            icon: <FaFacebookF size={24} />,
            color: "bg-[#1877F2] text-white",
            link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: "WhatsApp",
            icon: <FaWhatsapp size={24} />,
            color: "bg-[#25D366] text-white",
            link: `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`,
        },
        {
            name: "Reddit",
            icon: <FaRedditAlien size={24} />,
            color: "bg-[#FF4500] text-white",
            link: `https://www.reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}`,
        },
        {
            name: "Email",
            icon: <FaEnvelope size={24} />,
            color: "bg-gray-600 text-white",
            link: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check this out: ${shareUrl}`)}`,
        },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                    <h2 className="text-2xl font-semibold text-slate-900">Share</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <HiX size={24} />
                    </button>
                </div>

                <div className="px-8 pb-10 space-y-8">
                    {/* Social Share Grid */}
                    <div>
                        <p className="text-sm font-medium text-slate-600 mb-5">Share this link via</p>
                        <div className="flex items-start gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {shareOptions.map((option) => (
                                <a
                                    key={option.name}
                                    href={option.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-3 group min-w-[72px] shrink-0"
                                >
                                    <div className={`w-14 h-14 ${option.color} rounded-[18px] flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm shrink-0`}>
                                        <div className="flex items-center justify-center size-6 flex-none">
                                            {option.icon}
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-semibold text-slate-600 tracking-tight group-hover:text-emerald-600 transition-colors">
                                        {option.name}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 w-full" />

                    {/* Link Copy Section */}
                    <div>
                        <p className="text-sm font-medium text-slate-600 mb-4">Page link</p>
                        <div className="relative group">
                            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 pr-14 text-sm text-slate-500 font-medium truncate">
                                {shareUrl}
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-slate-400 hover:text-emerald-600 transition-colors"
                                title="Copy to clipboard"
                            >
                                {copied ? <HiCheck size={22} className="text-emerald-500" /> : <HiDuplicate size={22} />}
                            </button>
                        </div>
                        {copied && (
                            <p className="text-[12px] text-emerald-600 mt-2 font-medium animate-in fade-in slide-in-from-top-1">
                                Link copied to clipboard!
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Background Click to Close */}
            <div className="absolute inset-0 -z-10" onClick={onClose} />
        </div>
    );
}
