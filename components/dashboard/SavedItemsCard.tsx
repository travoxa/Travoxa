"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaRegTrashAlt, FaChevronRight } from "react-icons/fa";
import { FiTag } from "react-icons/fi";
import Image from "next/image";

interface SavedItem {
    _id: string;
    itemId: string;
    itemType: string;
    createdAt: string;
    // Item details will be fetched separately or populated
}

export default function SavedItemsCard() {
    const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSavedItems = async () => {
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
        fetchSavedItems();
    }, []);

    const handleRemove = async (id: string, itemId: string, itemType: string) => {
        try {
            const res = await fetch("/api/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId, itemType }),
            });
            const data = await res.json();
            if (!data.saved) {
                setSavedItems(prev => prev.filter(item => item._id !== id));
            }
        } catch (error) {
            console.error("Error removing saved item:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading your favorites...</p>
                </div>
            </div>
        );
    }

    if (savedItems.length === 0) {
        return (
            <div className="bg-white rounded-[32px] p-12 border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mb-6">
                    <FiTag size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No saved items yet</h3>
                <p className="text-gray-500 max-w-sm mb-8">
                    Explore our packages and click the tag icon to save your favorite experiences here.
                </p>
                <Link
                    href="/travoxa-discovery"
                    className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
                >
                    Explore Now
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedItems.map((item) => (
                    <div key={item._id} className="group relative bg-gray-50 rounded-2xl p-4 border border-transparent hover:border-emerald-200 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md mb-2 w-fit">
                                    {item.itemType}
                                </span>
                                <h4 className="font-bold text-slate-900 line-clamp-1">Item ID: {item.itemId}</h4>
                            </div>
                            <button
                                onClick={() => handleRemove(item._id, item.itemId, item.itemType)}
                                className="text-gray-400 hover:text-emerald-500 p-2 transition-colors"
                                title="Remove"
                            >
                                <FaRegTrashAlt size={14} />
                            </button>
                        </div>
                        <Link
                            href={`/travoxa-discovery/${item.itemType === 'tour' ? 'tours' : item.itemType === 'attraction' ? 'attractions' : item.itemType}s/${item.itemId}`}
                            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-500 transition-colors mt-4"
                        >
                            View Details <FaChevronRight size={10} />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
