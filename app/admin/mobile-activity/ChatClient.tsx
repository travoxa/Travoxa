'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    RiSendPlaneFill, 
    RiUserLine, 
    RiSmartphoneLine, 
    RiInformationLine,
    RiShieldCheckLine,
    RiChat3Line,
    RiRadioButtonLine,
    RiDeleteBinLine,
    RiSearchLine,
    RiTimeLine,
    RiMessage3Line
} from 'react-icons/ri';
import Pusher from 'pusher-js';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'admin';
    timestamp: string;
}

interface ChatSession {
    email: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    createdAt: string;
}

const ChatClient = () => {
    // List of active conversations
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
    
    // Active chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Fetch Chat Sessions (sidebar list)
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch('/api/admin/chat/users');
                const data = await res.json();
                if (data.success) {
                    setSessions(data.chats);
                    // Autofocus first session if none selected
                    if (data.chats.length > 0 && !activeSession) {
                        // We don't autofocus automatically to let admin choose
                    }
                }
            } catch (err) {
                console.error('Failed to fetch sessions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
        // Poll for new chats every 30 seconds
        const poll = setInterval(fetchSessions, 30000);
        return () => clearInterval(poll);
    }, [activeSession]);

    // 2. Load History when session changes
    useEffect(() => {
        if (!activeSession) return;

        const fetchHistory = async () => {
            try {
                const channel = `user-${activeSession.email}`;
                const res = await fetch(`/api/pusher/message?channel=${channel}`);
                const data = await res.json();
                if (data.success) {
                    setMessages(data.history || []);
                }
            } catch (err) {
                console.error('Failed to fetch history:', err);
            }
        };

        fetchHistory();
    }, [activeSession]);

    // 3. Pusher Setup for dynamic channel
    useEffect(() => {
        if (!activeSession) return;

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        });

        const currentChannel = `user-${activeSession.email}`;
        const channel = pusher.subscribe(currentChannel);
        
        pusher.connection.bind('connected', () => setConnected(true));
        pusher.connection.bind('disconnected', () => setConnected(false));

        channel.bind('new-message', (data: Message) => {
            setMessages((prev) => {
                if (prev.some(m => m.id === data.id)) return prev;
                return [...prev, data];
            });
            
            // Also update local session list last message
            setSessions(prev => prev.map(s => 
                s.email === activeSession.email 
                ? { ...s, lastMessage: data.text, timestamp: data.timestamp } 
                : s
            ));
        });

        return () => {
            channel.unbind_all();
            channel.unsubscribe();
            pusher.disconnect();
        };
    }, [activeSession]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || !activeSession) return;

        const channel = `user-${activeSession.email}`;
        const localMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'admin',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, localMsg]);

        setStatus('sending');
        try {
            const res = await fetch('/api/pusher/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: inputText,
                    sender: 'admin',
                    senderId: 'admin',
                    receiverId: activeSession.email,
                    channel: channel,
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
        <div className="flex flex-col h-[calc(100vh-280px)] min-h-[600px] space-y-4 font-sans">
            {/* Status Header */}
            <div className="flex items-center justify-between bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                        {activeSession ? `Chatting with ${activeSession.name}` : 'Select a conversation'}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                         onClick={() => { if (confirm("Clear local chat history?")) setMessages([]); }}
                         className="text-[10px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                    >
                        Clear View
                    </button>
                    <div className="h-4 w-[1px] bg-gray-100" />
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                        <RiShieldCheckLine size={14} className="text-green-500" />
                        SECURE SYNC
                    </div>
                </div>
            </div>

            <div className="flex gap-4 flex-1 min-h-0">
                {/* 1. Sidebar - User List */}
                <div className="w-80 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                        <div className="relative">
                            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search conversations..." 
                                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-black/5 outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {loading ? (
                            <div className="p-8 text-center animate-pulse space-y-3">
                                <div className="h-12 bg-gray-100 rounded-xl" />
                                <div className="h-12 bg-gray-100 rounded-xl" />
                                <div className="h-12 bg-gray-100 rounded-xl" />
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="p-8 text-center opacity-40 grayscale flex flex-col items-center gap-3">
                                <RiMessage3Line size={40} />
                                <p className="text-xs font-medium">No active chats yet</p>
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <button
                                    key={session.email}
                                    onClick={() => setActiveSession(session)}
                                    className={`w-full p-4 flex items-start gap-3 transition-all border-b border-gray-50 hover:bg-gray-50/50 ${
                                        activeSession?.email === session.email ? 'bg-black/5 !border-l-4 !border-l-black' : ''
                                    }`}
                                >
                                    <div className="h-10 w-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-black/10">
                                        {session.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <p className="text-sm font-bold text-gray-900 truncate">{session.name}</p>
                                            <span className="text-[9px] text-gray-400 font-bold">{session.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{session.lastMessage}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* 2. Chat Window */}
                <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden border-t-4 border-t-black">
                    {!activeSession ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6 opacity-30">
                            <div className="p-8 bg-gray-100 rounded-full">
                                <RiChat3Line size={64} className="text-gray-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Your Help Center</h3>
                                <p className="text-sm text-gray-500">Select a conversation from the sidebar to start replying</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Messages area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20 custom-scrollbar">
                                {messages.map((msg) => (
                                    <div 
                                        key={msg.id} 
                                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className="max-w-[80%] lg:max-w-[65%] space-y-1">
                                            <div className={`px-4 py-3 rounded-2xl text-sm transition-all ${
                                                msg.sender === 'admin' 
                                                ? 'bg-black text-white rounded-tr-none shadow-md' 
                                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                                            }`}>
                                                {msg.text}
                                            </div>
                                            <p className={`text-[9px] text-gray-400 uppercase font-black tracking-tighter px-1 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}>
                                                {msg.sender === 'admin' ? 'Support Admin' : activeSession.name} • {msg.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input area */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <form onSubmit={handleSend} className="flex gap-3 relative">
                                    <input 
                                        type="text" 
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder={`Reply to ${activeSession.name}...`}
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-black/5 transition-all"
                                        disabled={status === 'sending'}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!inputText.trim() || status === 'sending'}
                                        className="bg-black text-white px-5 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
                                    >
                                        <RiSendPlaneFill size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>

                {/* 3. Small Info Panel */}
                <div className="hidden xl:flex w-64 flex-col gap-4">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                       <div className="flex flex-col items-center text-center gap-3 py-2">
                           {activeSession ? (
                               <>
                                   <div className="h-16 w-16 bg-gray-900 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-black/10">
                                       {activeSession.name.charAt(0).toUpperCase()}
                                   </div>
                                   <div>
                                       <p className="font-bold text-gray-900">{activeSession.name}</p>
                                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{activeSession.email}</p>
                                   </div>
                               </>
                           ) : (
                               <div className="opacity-20 flex flex-col items-center gap-2">
                                   <RiUserLine size={48} />
                                   <p className="text-[10px] font-bold uppercase">No Active User</p>
                               </div>
                           )}
                       </div>
                       
                       <div className="pt-4 border-t border-gray-50 space-y-3">
                           <div className="flex items-center gap-2 text-gray-900 font-bold text-[10px] uppercase tracking-widest">
                               <RiInformationLine size={14} className="text-black" />
                               Quick Details
                           </div>
                           <div className="space-y-2">
                               <div className="flex justify-between text-[10px]">
                                   <span className="text-gray-400">Platform</span>
                                   <span className="font-bold">iOS / Android</span>
                               </div>
                               <div className="flex justify-between text-[10px]">
                                   <span className="text-gray-400">Status</span>
                                   <span className="text-green-500 font-bold uppercase">Connected</span>
                               </div>
                           </div>
                       </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatClient;
