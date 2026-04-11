'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    RiSendPlaneFill, 
    RiUserLine, 
    RiSmartphoneLine, 
    RiInformationLine,
    RiShieldCheckLine,
    RiHistoryLine
} from 'react-icons/ri';
import Pusher from 'pusher-js';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'admin';
    timestamp: string;
}

export default function AdminChatPage() {
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
            setMessages((prev) => [...prev, data]);
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

        setStatus('sending');
        try {
            const res = await fetch('/api/pusher/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputText,
                    sender: 'admin',
                    channel: 'travoxa-test-chat'
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
        <div className="flex flex-col h-[calc(100vh-140px)] space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <RiSmartphoneLine className="text-green-600 h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Mobile Chat Bridge</h1>
                        <p className="text-xs text-gray-500 font-sans">Testing communication between Admin and Mobile App</p>
                    </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase transition-all ${connected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <div className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    {connected ? 'Live Sync' : 'Reconnecting...'}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 min-h-0">
                {/* Info Panel (Hidden on mobile) */}
                <div className="hidden md:flex flex-col gap-4">
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4 font-sans">
                        <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                            <RiInformationLine size={18} className="text-blue-500" />
                            How it works
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                            Messages sent here are broadcasted via Pusher to any mobile device currently on the "Chat Test" screen.
                        </p>
                        <div className="pt-2 border-t border-gray-100 space-y-3">
                            <div className="flex items-start gap-2">
                                <RiShieldCheckLine size={14} className="text-green-500 mt-0.5" />
                                <span className="text-[11px] text-gray-500">Secure AES TLS Encryption</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <RiHistoryLine size={14} className="text-gray-400 mt-0.5" />
                                <span className="text-[11px] text-gray-500">No logs stored on server (Real-time only)</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl text-white shadow-sm space-y-2">
                        <h3 className="font-bold text-sm">Active Channel</h3>
                        <p className="text-[11px] opacity-80 break-all font-mono">travoxa-test-chat</p>
                    </div>
                </div>

                {/* Chat Container */}
                <div className="md:col-span-3 flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-40">
                                <RiUserLine size={48} className="text-gray-300" />
                                <p className="text-sm font-sans italic text-gray-500">Waiting for messages from mobile...</p>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] space-y-1`}>
                                        <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm font-sans ${
                                            msg.sender === 'admin' 
                                            ? 'bg-black text-white rounded-tr-none' 
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                        }`}>
                                            {msg.text}
                                        </div>
                                        <p className={`text-[10px] text-gray-400 font-sans ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                                            {msg.sender === 'admin' ? 'Admin' : 'Mobile User'} • {msg.timestamp}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <input 
                                type="text" 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type a message to the mobile app..."
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all font-sans"
                                disabled={status === 'sending'}
                            />
                            <button 
                                type="submit"
                                disabled={!inputText.trim() || status === 'sending'}
                                className="bg-green-600 text-white p-2.5 rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-green-200"
                            >
                                <RiSendPlaneFill size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
