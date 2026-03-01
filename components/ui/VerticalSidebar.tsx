"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    FiTag,
    FiX,
    FiChevronRight,
    FiTrash2
} from "react-icons/fi";
import { route } from "@/lib/route";

export default function VerticalSidebar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoverProgress, setHoverProgress] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [savedItems, setSavedItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Update CSS Variable for width to sync with Header
    useEffect(() => {
        const width = isExpanded ? '320px' : '44px';
        document.documentElement.style.setProperty('--sidebar-width', width);
        return () => {
            document.documentElement.style.setProperty('--sidebar-width', '0px');
        };
    }, [isExpanded]);

    // Outside Click Handling
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        }
        if (isExpanded) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isExpanded]);

    // Reset navigation loader when path changes
    useEffect(() => {
        setIsNavigating(false);
    }, [pathname]);

    // Fetch saved items when expanded
    useEffect(() => {
        if (isExpanded && session) {
            fetchSavedItems();
        }
    }, [isExpanded, session]);

    const fetchSavedItems = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/save");
            const data = await res.json();
            if (data.success) {
                setSavedItems(data.data);
            }
        } catch (error) {
            console.error("Error fetching saved items:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (itemId: string, itemType: string) => {
        try {
            const res = await fetch("/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ itemId, itemType }),
            });
            const data = await res.json();
            if (!data.saved) {
                setSavedItems(prev => prev.filter(item => !(item.itemId === itemId && item.itemType === itemType)));
            }
        } catch (error) {
            console.error("Error removing saved item:", error);
        }
    };

    const startTimer = () => {
        // Clear any pending close timer if we hover again
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }

        if (isExpanded) return;

        setIsHovering(true);
        setHoverProgress(0);
        const startTime = Date.now();
        const duration = 1000; // 1 second expansion trigger

        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            setHoverProgress(progress);

            if (progress >= 100) {
                if (timerRef.current) clearInterval(timerRef.current);
                setIsHovering(false);
                setHoverProgress(0);
                setIsExpanded(true);
            }
        }, 10);
    };

    const stopTimer = () => {
        // Narrow view logic
        setIsHovering(false);
        setHoverProgress(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }

        // Expanded view logic: start 2-second close delay
        if (isExpanded) {
            if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
            closeTimerRef.current = setTimeout(() => {
                setIsExpanded(false);
                closeTimerRef.current = null;
            }, 2000);
        }
    };

    const cancelClose = () => {
        if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }
    };

    if (!session) return null;

    return (
        <>
            <aside
                ref={sidebarRef}
                onMouseEnter={cancelClose}
                onMouseLeave={stopTimer}
                className={`sticky top-0 h-screen transition-all duration-500 ease-in-out bg-white border-l border-slate-100 z-[100] hidden lg:flex flex-col items-center py-6 ${isExpanded ? 'w-[320px]' : 'w-[44px]'}`}
            >
                {/* Header / Logo */}
                <div className={`w-full flex items-center mb-8 px-2 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                    <div
                        className="cursor-pointer flex items-center gap-3"
                        onClick={() => route('/')}
                    >
                        <Image
                            src="/icon.png"
                            alt="Travoxa"
                            width={28}
                            height={28}
                            className="object-contain"
                        />
                        {isExpanded && <span className="font-black text-slate-800 tracking-tighter text-xl">TRAVOXA</span>}
                    </div>
                    {isExpanded && (
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                        >
                            <FiX size={20} />
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className={`flex-1 w-full overflow-hidden ${isExpanded ? 'px-4' : 'px-1'}`}>
                    {!isExpanded ? (
                        /* Narrow Content (Icons Only) */
                        <nav className="flex flex-col gap-4 w-full items-center">
                            <div
                                onMouseEnter={startTimer}
                                onMouseLeave={stopTimer}
                                onClick={() => setIsExpanded(true)}
                                className={`relative flex items-center justify-center w-full aspect-square rounded-lg transition-all duration-300 cursor-pointer ${isHovering ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-500'}`}
                            >
                                {/* Circular Timer Border */}
                                {isHovering && !isExpanded && (
                                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="40%"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="text-emerald-500"
                                            strokeDasharray="100"
                                            strokeDashoffset={100 - hoverProgress}
                                            pathLength="100"
                                        />
                                    </svg>
                                )}
                                <FiTag size={18} />
                            </div>
                        </nav>
                    ) : (
                        /* Expanded Content (Saved Items List) */
                        <div className="h-full flex flex-col">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <FiTag className="text-emerald-500" /> Saved Collections
                            </h3>

                            {isLoading ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : savedItems.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                                    <p className="text-xs font-medium text-slate-500">Your collection is empty</p>
                                </div>
                            ) : (
                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide flex flex-col gap-2">
                                    {savedItems.map((item) => (
                                        <div
                                            key={item._id}
                                            className="group/item flex justify-between items-center bg-slate-50 rounded-md px-3 py-2 border border-slate-200 hover:border-emerald-300 hover:bg-white transition-all duration-200"
                                        >
                                            <Link
                                                href={item.itemLink || '#'}
                                                className="flex-1 min-w-0"
                                                onClick={() => {
                                                    setIsNavigating(true);
                                                    setIsExpanded(false);
                                                }}
                                            >
                                                <p className="text-[10px] font-bold text-slate-800 uppercase tracking-tight truncate group-hover/item:text-emerald-600 transition-colors">
                                                    {item.title || `${item.itemType} #${item.itemId.slice(-6)}`}
                                                </p>
                                                <p className="text-[8px] font-medium text-slate-400 uppercase tracking-widest">
                                                    {item.itemType}
                                                </p>
                                            </Link>
                                            <button
                                                onClick={() => handleRemove(item.itemId, item.itemType)}
                                                className="text-slate-300 hover:text-rose-500 ml-2 shrink-0 p-1 hover:bg-rose-50 rounded-full transition-colors"
                                            >
                                                <FiTrash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </aside>

            {/* Global Page Loader Overlay */}
            {
                isNavigating && (
                    <div className="fixed inset-0 z-[9999] bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center transition-all duration-300">
                        <div className="relative">
                            {/* Outer rotating ring */}
                            <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-emerald-500 animate-spin"></div>
                            {/* Inner static logo or icon placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/20"></div>
                            </div>
                        </div>
                        <p className="mt-4 text-slate-600 font-bold text-[10px] uppercase tracking-[0.2em] animate-pulse">
                            Loading your journey...
                        </p>
                    </div>
                )
            }
        </>
    );
}
