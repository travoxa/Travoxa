"use client";

import { useState, useEffect } from "react";
import { FiTag } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface SaveButtonProps {
    itemId: string;
    itemType: 'tour' | 'attraction' | 'activity' | 'sightseeing' | 'stay' | 'rental' | 'food';
    title?: string;
    itemLink?: string;
    isSmall?: boolean;
    activeColor?: string;
}

export default function SaveButton({
    itemId,
    itemType,
    title,
    itemLink,
    isSmall = false,
    activeColor = "bg-emerald-600"
}: SaveButtonProps) {
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
                body: JSON.stringify({ itemId, itemType, title, itemLink }),
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

    const iconSize = isSmall ? 14 : 18;

    return (
        <button
            onClick={handleToggleSave}
            disabled={isLoading}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm
                ${isSaved
                    ? `${activeColor} text-white`
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
                ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            title={isSaved ? "Unsave" : "Save"}
        >
            <FiTag
                size={iconSize}
                className={`${isSaved ? 'fill-white' : ''} transition-all duration-300`}
            />
        </button>
    );
}
