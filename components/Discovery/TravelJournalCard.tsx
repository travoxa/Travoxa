"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { FiHeart, FiBookmark, FiShare2, FiPlay, FiMapPin } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { route } from '@/lib/route';

interface TravelJournalCardProps {
    journal: any;
    onLike?: () => void;
    onSave?: () => void;
}

const TravelJournalCard: React.FC<TravelJournalCardProps> = ({ journal, onLike, onSave }) => {
    const { data: session } = useSession();
    const [isLiked, setIsLiked] = useState(journal.likes?.includes(session?.user?.email));
    const [likesCount, setLikesCount] = useState(journal.likes?.length || 0);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!session) {
            alert("Please login to like journals");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/travel-journals/${journal._id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.user?.email}` // Note: backend identifyUser/authenticate uses either token or origin. 
                    // Need to check how web sends auth. Usually it's session based or token.
                }
            });
            const data = await res.json();
            if (data.success) {
                setIsLiked(!isLiked);
                setLikesCount(data.likes.length);
            }
        } catch (error) {
            console.error("Failed to like:", error);
        }
    };

    const handleCardClick = () => {
        route(`/travoxa-discovery/travel-journals/${journal._id}`);
    };

    // Get cover image: standalone IG thumbnail or first step image or fallback
    const coverImage = journal.igLink ? (journal.image || '/placeholder.jpg') : (journal.steps?.[0]?.images?.[0] || '/placeholder.jpg');

    return (
        <div 
            onClick={handleCardClick}
            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-slate-100 flex flex-col h-full"
        >
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
                <img 
                    src={coverImage} 
                    alt={journal.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Tags */}
                <div className="absolute top-4 left-4 flex gap-2">
                    {journal.tripType && (
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                            {journal.tripType}
                        </span>
                    )}
                    {journal.type === 'standalone_link' && (
                        <span className="px-3 py-1 bg-pink-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm flex items-center gap-1">
                            <FiPlay size={10} /> REEL
                        </span>
                    )}
                </div>

                {/* Quick Actions (Hover) */}
                <div className="absolute bottom-4 right-4 flex gap-2 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button 
                        onClick={handleLike}
                        className={`p-2.5 rounded-full backdrop-blur-md transition-colors ${isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'}`}
                    >
                        <FiHeart size={18} fill={isLiked ? "currentColor" : "none"} />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onSave?.(); }}
                        className="p-2.5 bg-white/80 backdrop-blur-md text-slate-700 rounded-full hover:bg-white transition-colors"
                    >
                        <FiBookmark size={18} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-200">
                        <img 
                            src={journal.author?.image || `https://ui-avatars.com/api/?name=${journal.author?.name}&background=random`} 
                            alt={journal.author?.name}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{journal.author?.name}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                        {new Date(journal.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 Mont mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {journal.title}
                </h3>
                
                <p className="text-sm text-slate-500 Inter line-clamp-2 mb-4 flex-1">
                    {journal.description}
                </p>

                {/* Footer Info */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-slate-400">
                            <FiHeart size={14} className={isLiked ? 'text-red-500 fill-red-500' : ''} />
                            <span className="text-xs font-semibold">{likesCount}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                            <FiMapPin size={14} />
                            <span className="text-xs font-semibold">{journal.steps?.length || 0} stops</span>
                        </div>
                    </div>
                    <div className="text-emerald-600 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                        Read Story <FiShare2 size={12} className="ml-1" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TravelJournalCard;
