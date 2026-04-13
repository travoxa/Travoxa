'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { 
    RiChat3Line, 
    RiCloseLine, 
    RiSendPlane2Line, 
    RiCheckDoubleLine,
    RiUserLine,
    RiArrowDownSLine,
    RiAttachmentLine
} from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import Pusher from 'pusher-js';
import { CldUploadWidget } from 'next-cloudinary';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'admin';
    timestamp: string;
    imageUrl?: string;
    isRead?: boolean;
    status?: 'sending' | 'sent' | 'read';
}

export default function ChatWidget() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const userEmail = session?.user?.email;
    const channelName = userEmail ? `user-${userEmail}` : '';

    // Scroll to bottom - directly sets scrollTop on container (most reliable)
    const scrollToBottom = (smooth = true) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    };

    // Scroll on every new message (only when widget is open)
    useLayoutEffect(() => {
        if (!isOpen) return;
        // Small timeout to allow DOM to paint the new message bubble
        const id = setTimeout(() => scrollToBottom(), 80);
        return () => clearTimeout(id);
    }, [messages]);

    // When widget is first opened, scroll after animation completes (300ms)
    useEffect(() => {
        if (!isOpen) return;
        const id = setTimeout(() => scrollToBottom(), 320);
        return () => clearTimeout(id);
    }, [isOpen]);

    // Fetch History
    useEffect(() => {
        if (!channelName || !isOpen) return;

        const fetchHistory = async () => {
            try {
                const res = await fetch(`/api/pusher/message?channel=${channelName}`);
                const data = await res.json();
                if (data.success && data.history) {
                    setMessages(data.history);
                }
            } catch (error) {
                console.error('Failed to fetch chat history:', error);
            }
        };

        const markAsRead = async () => {
            try {
                await fetch('/api/admin/chat/read', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ channel: channelName, reader: 'user' }),
                });
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        };

        fetchHistory();
        markAsRead();
    }, [channelName, isOpen]);

    // Pusher Subscription
    useEffect(() => {
        if (!channelName || !session) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channel = pusher.subscribe(channelName);

        channel.bind('new-message', (data: Message) => {
            setMessages((prev) => {
                // Prevent duplicate messages if already added optimistically
                if (prev.some(m => m.id === data.id)) return prev;
                return [...prev, { ...data, status: 'read' }];
            });
        });

        channel.bind('messages-read', (data: { reader: string, channel: string }) => {
            if (data.reader === 'admin') {
                // Admin read user messages
                setMessages((prev) => prev.map(m => 
                    m.sender === 'user' ? { ...m, status: 'read', isRead: true } : m
                ));
            }
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [channelName, session]);

    const handleSend = async (e?: React.FormEvent, imageUrl?: string) => {
        e?.preventDefault();
        if ((!inputText.trim() && !imageUrl) || !userEmail) return;

        const messageText = inputText;
        if (!imageUrl) setInputText('');

        const localMsg: Message = {
            id: Date.now().toString(),
            text: messageText,
            imageUrl: imageUrl,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sending'
        };

        setMessages(prev => [...prev, localMsg]);

        try {
            const res = await fetch('/api/pusher/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageText,
                    imageUrl: imageUrl,
                    sender: 'user',
                    senderId: userEmail,
                    receiverId: 'admin',
                    channel: channelName,
                    id: localMsg.id,
                    timestamp: localMsg.timestamp
                }),
            });

            const data = await res.json();
            if (data.success) {
                setMessages(prev => prev.map(m => 
                    m.id === localMsg.id ? { ...m, status: 'sent' } : m
                ));
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    // Only show for logged-in users
    if (!session) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[9999] Inter">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        onAnimationComplete={() => scrollToBottom()}
                        className="absolute bottom-16 right-0 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-black p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                    T
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-semibold">Travoxa Support</h3>
                                    <p className="text-green-400 text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                        Always Online
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <RiCloseLine size={24} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/50">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <RiChat3Line className="text-gray-400" size={24} />
                                    </div>
                                    <p className="text-gray-500 text-sm">How can we help you today?</p>
                                    <p className="text-gray-400 text-xs mt-1">Send a message to start a conversation.</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div 
                                        key={msg.id} 
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                                            <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                                                msg.sender === 'user' 
                                                ? 'bg-black text-white rounded-tr-none' 
                                                : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
                                            }`}>
                                                {msg.imageUrl && (
                                                    <img 
                                                        src={msg.imageUrl} 
                                                        alt="Attachment" 
                                                        className="max-w-full rounded-lg mb-2 cursor-zoom-in"
                                                        onClick={() => window.open(msg.imageUrl, '_blank')}
                                                    />
                                                )}
                                                {msg.text && <span>{msg.text}</span>}
                                            </div>
                                            <div className="flex items-center gap-1 px-1">
                                                <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                                                {msg.sender === 'user' && (
                                                    <RiCheckDoubleLine 
                                                        size={14} 
                                                        className={(msg.status === 'read' || msg.isRead) ? 'text-blue-500' : 'text-gray-300'} 
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form onSubmit={(e) => handleSend(e)} className="relative flex items-center gap-2">
                                <CldUploadWidget
                                    uploadPreset="travoxa_tours"
                                    onSuccess={(result: any) => {
                                        if (result.event === 'success') {
                                            handleSend(undefined, result.info.secure_url);
                                        }
                                    }}
                                >
                                    {({ open }) => (
                                        <button
                                            type="button"
                                            onClick={() => open()}
                                            className="p-2 text-gray-400 hover:text-black transition-colors"
                                            title="Attach Image"
                                        >
                                            <RiAttachmentLine size={22} />
                                        </button>
                                    )}
                                </CldUploadWidget>

                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Type your message..."
                                        className="w-full bg-gray-100 border-none rounded-full py-3 px-5 pr-12 text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputText.trim()}
                                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                                            inputText.trim() ? 'bg-black text-white' : 'text-gray-400'
                                        }`}
                                    >
                                        <RiSendPlane2Line size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button — always stays at bottom-right corner */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
                    isOpen ? 'bg-white text-black border border-gray-100' : 'bg-black text-white'
                }`}
            >
                {isOpen ? <RiArrowDownSLine size={30} /> : <RiChat3Line size={28} />}
                
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                )}
            </motion.button>
        </div>
    );
}
