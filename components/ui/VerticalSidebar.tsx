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
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                            <FiTag className="text-emerald-500" /> Saved Collections
                        </h3>

                        {isLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : savedItems.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
                                    <FiTag size={24} />
                                </div>
                                <p className="text-xs font-medium text-slate-500">Your collection is empty</p>
                                <button
                                    onClick={() => { setIsExpanded(false); route('/travoxa-discovery'); }}
                                    className="mt-4 text-[10px] font-bold text-emerald-600 uppercase tracking-widest hover:underline"
                                >
                                    Start Exploring
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar scrollbar-hide flex flex-col gap-4 pb-4">
                                {savedItems.map((item) => (
                                    <div
                                        key={item._id}
                                        className="group relative bg-slate-50 rounded-2xl p-4 border border-transparent hover:border-emerald-100 hover:bg-white transition-all duration-300 shadow-sm"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                {item.itemType}
                                            </span>
                                            <button
                                                onClick={() => handleRemove(item.itemId, item.itemType)}
                                                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-3">
                                            {item.itemType.charAt(0).toUpperCase() + item.itemType.slice(1)} #{item.itemId.slice(-6)}
                                        </h4>
                                        <Link
                                            href={`/travoxa-discovery/${item.itemType === 'tour' ? 'tours' : item.itemType === 'attraction' ? 'attractions' : item.itemType}s/${item.itemId}`}
                                            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
                                        >
                                            Take a Look <FiChevronRight />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

        </aside>
    );
}
