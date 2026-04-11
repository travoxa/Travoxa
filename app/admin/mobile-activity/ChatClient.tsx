'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    RiSendPlaneFill, 
    RiUserLine, 
    RiSmartphoneLine, 
    RiInformationLine,
    RiShieldCheckLine,
    RiHistoryLine,
    RiChat3Line,
    RiRadioButtonLine,
    RiDeleteBinLine
} from 'react-icons/ri';
import Pusher from 'pusher-js';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'admin';
    timestamp: string;
}

const ChatClient = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
    const [connected, setConnected] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Pusher Setup
    useEffect(() => {
        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const channel = pusher.subscribe('travoxa-test-chat');
        
        pusher.connection.bind('connected', () => setConnected(true));
        pusher.connection.bind('disconnected', () => setConnected(false));

        channel.bind('new-message', (data: Message) => {
            setMessages((prev) => {
                // Prevent duplicate messages if sender is admin (already handled by local prediction or just received via broadcast)
                if (prev.some(m => m.id === data.id)) return prev;
                return [...prev, data];
            });
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim()) return;

        const localMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'admin',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Add locally first for instant feedback
        setMessages(prev => [...prev, localMsg]);

        setStatus('sending');
        try {
            const res = await fetch('/api/pusher/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputText,
                    sender: 'admin',
                    channel: 'travoxa-test-chat',
                    id: localMsg.id,
                    timestamp: localMsg.timestamp
                }),
            });

            if (res.ok) {
                setInputText('');
                setStatus('idle');
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Send error:', error);
            setStatus('error');
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-280px)] min-h-[500px] space-y-4 font-sans">
            {/* Connection Status Bar */}
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            {connected ? 'Live Sync Active' : 'Connecting to Pusher...'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => {
                            if (confirm("Clear local chat history?")) setMessages([]);
                        }}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                    >
                        <RiDeleteBinLine size={14} />
                        Clear History
                    </button>
                    <div className="h-4 w-[1px] bg-gray-100" />
                    <div className="flex items-center gap-4 text-[10px] text-gray-400">
                        <div className="flex items-center gap-1">
                            <RiShieldCheckLine size={14} className="text-green-500" />
                            SSL Encrypted
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* Chat Container */}
                <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-t-4 border-t-black">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30 py-20">
                                <div className="p-6 bg-gray-100 rounded-full">
                                    <RiChat3Line size={48} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">No active messages</p>
                                    <p className="text-xs text-gray-400">Waiting for interaction from mobile app...</p>
                                </div>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] md:max-w-[70%] space-y-1`}>
                                        <div className={`px-4 py-3 rounded-2xl text-sm transition-all ${
                                            msg.sender === 'admin' 
                                            ? 'bg-black text-white rounded-tr-none shadow-md' 
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        <p className={`text-[10px] text-gray-400 uppercase font-bold tracking-tight px-1 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                                            {msg.sender === 'admin' ? 'Admin' : 'Mobile User'} • {msg.timestamp}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-gray-50">
                        <form onSubmit={handleSend} className="flex gap-3 relative">
                            <input 
                                type="text" 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Send message to mobile..."
                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-black/5 transition-all"
                                disabled={status === 'sending'}
                            />
                            <button 
                                type="submit"
                                disabled={!inputText.trim() || status === 'sending'}
                                className="bg-black text-white p-3 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
                            >
                                <RiSendPlaneFill size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Info Panel */}
                <div className="lg:w-72 flex flex-col gap-4">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                        <div className="flex items-center gap-2 text-gray-900 font-bold text-xs uppercase tracking-widest">
                            <RiInformationLine size={16} className="text-black" />
                            Session Info
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Channel</span>
                                <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">travoxa-test-chat</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">Event</span>
                                <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">new-message</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50 space-y-3">
                            <p className="text-[11px] text-gray-600 leading-relaxed italic">
                                This bridge allows instant communication with the "Chat Test" screen on the Travoxa mobile app.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-900 p-6 rounded-2xl text-white shadow-xl space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <RiSmartphoneLine size={80} />
                        </div>
                        <h3 className="font-bold text-xs uppercase tracking-widest opacity-60">Mobile Target</h3>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center">
                                <RiSmartphoneLine size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Travoxa App</p>
                                <p className="text-[10px] opacity-60">Connected via Pusher JS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatClient;
