"use client";

import { useState, useEffect } from "react";
import { FiTag } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
    itemId: string;
    itemType: 'tour' | 'attraction' | 'activity' | 'sightseeing' | 'stay' | 'rental' | 'food';
    isSmall?: boolean;
}

export default function SaveButton({ itemId, itemType, isSmall = false }: SaveButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check initial save status
    useEffect(() => {
        if (session?.user) {
            const checkStatus = async () => {
                try {
                    const res = await fetch(`/api/save?itemId=${itemId}&itemType=${itemType}`);
                    const data = await res.json();
                    if (data.saved !== undefined) {
                        setIsSaved(data.saved);
                    }
                } catch (error) {
                    console.error("Error checking save status:", error);
                }
            };
            checkStatus();
        }
    }, [itemId, itemType, session]);

    const handleToggleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            router.push("/login");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId, itemType }),
            });
            const data = await res.json();
            if (data.saved !== undefined) {
                setIsSaved(data.saved);
            }
        } catch (error) {
            console.error("Error toggling save:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const buttonSize = isSmall ? "text-sm" : "text-xl";
    const padding = isSmall ? "p-1.5" : "p-2.5";

    return (
        <button
            onClick={handleToggleSave}
            disabled={isLoading}
            className={`${padding} rounded-full transition-all duration-300 flex items-center justify-center
        ${isSaved
                    ? "bg-emerald-50 text-emerald-500 border border-emerald-100"
                    : "bg-white/80 backdrop-blur-sm text-slate-400 border border-white/50 hover:text-emerald-500 hover:border-emerald-200"
                }
        ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        shadow-sm hover:shadow-md
      `}
            title={isSaved ? "Unsave" : "Save"}
        >
            <FiTag className={`${buttonSize} ${isSaved ? 'fill-emerald-500' : ''} transition-all duration-300`} />
        </button>
    );
}
