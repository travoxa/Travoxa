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
    RiMessage3Line,
    RiAddLine,
    RiUserAddLine
} from 'react-icons/ri';
import Pusher from 'pusher-js';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'admin';
    timestamp: string;
    imageUrl?: string;
}

interface ChatSession {
    email: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    createdAt: string;
    unread?: boolean;
}

const ChatClient = () => {
    // List of active conversations
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
    
    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    
    // Active chat state
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Admin Presence Heartbeat
    useEffect(() => {
        const sendHeartbeat = () => {
            fetch('/api/pusher/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: 'online',
                    channel: 'admin-status',
                    sender: 'admin',
                    event: 'presence'
                }),
            }).catch(() => {});
        };

        sendHeartbeat();
        const interval = setInterval(sendHeartbeat, 20000);
        return () => clearInterval(interval);
    }, []);

    // 2. Fetch Chat Sessions (sidebar list)
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch('/api/admin/chat/users');
                const data = await res.json();
                if (data.success) {
                    setSessions(data.chats);
                }
            } catch (err) {
                console.error('Failed to fetch sessions:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
        const poll = setInterval(fetchSessions, 30000);
        return () => clearInterval(poll);
    }, []);

    // 2. Handle User Search
    useEffect(() => {
        const searchUsers = async () => {
            if (searchQuery.length < 2) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                const res = await fetch(`/api/admin/chat/search?query=${encodeURIComponent(searchQuery)}`);
                const data = await res.json();
                if (data.success) {
                    setSearchResults(data.users);
                }
            } catch (err) {
                console.error('Search failed:', err);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(searchUsers, 500);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // 3. Load History when session changes
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

    // 4. Pusher Setup
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
            
            setSessions(prev => {
                const sessionExists = prev.some(s => s.email === data.senderId || s.email === activeSession?.email);
                
                // Determine if we should mark as unread
                // (Only if it's from a user AND they aren't the currently active chat)
                const shouldMarkUnread = data.sender === 'user' && activeSession?.email !== data.senderId;

                if (sessionExists) {
                    return prev.map(s => {
                        if (s.email === (data.senderId === 'admin' ? activeSession?.email : data.senderId)) {
                            return { 
                                ...s, 
                                lastMessage: data.imageUrl ? '📷 Photo' : data.text, 
                                timestamp: data.timestamp,
                                unread: shouldMarkUnread ? true : s.unread
                            };
                        }
                        return s;
                    });
                }
                
                // If it's a new user session that wasn't in the list
                if (data.sender === 'user') {
                    return [{
                        email: data.senderId,
                        name: data.senderName || 'Anonymous',
                        lastMessage: data.imageUrl ? '📷 Photo' : data.text,
                        timestamp: data.timestamp,
                        createdAt: new Date().toISOString(),
                        unread: true
                    }, ...prev];
                }

                return prev;
            });
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
                // Ensure user is in sessions list
                if (!sessions.some(s => s.email === activeSession.email)) {
                    setSessions(prev => [{
                        ...activeSession,
                        lastMessage: localMsg.text,
                        timestamp: localMsg.timestamp,
                        createdAt: new Date().toISOString()
                    }, ...prev]);
                }
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error('Send error:', error);
            setStatus('error');
        }
    };

    const selectSession = (session: ChatSession) => {
        setActiveSession(session);
        setSessions(prev => prev.map(s => 
            s.email === session.email ? { ...s, unread: false } : s
        ));
    };

    const startChatWithUser = (user: any) => {
        const existingSession = sessions.find(s => s.email === user.email);
        if (existingSession) {
            selectSession(existingSession);
        } else {
            setActiveSession({
                email: user.email,
                name: user.name,
                lastMessage: 'New chat session',
                timestamp: 'Now',
                createdAt: new Date().toISOString(),
                unread: false
            });
        }
        setSearchQuery('');
        setSearchResults([]);
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
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-medium">
                        <RiShieldCheckLine size={14} className="text-green-500" />
                        SECURE SYNC Active
                    </div>
                </div>
            </div>

            <div className="flex gap-4 flex-1 min-h-0">
                {/* 1. Sidebar - User List & Search */}
                <div className="w-80 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/30 space-y-3">
                        <div className="relative">
                            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search all users..." 
                                className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-black/5 outline-none transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                        {/* Search Results Overlay */}
                        {searchQuery.length >= 2 && (
                            <div className="absolute inset-0 bg-white z-10 overflow-y-auto">
                                <div className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                                    Search Results {isSearching && '...'}
                                </div>
                                {searchResults.length === 0 && !isSearching ? (
                                    <div className="p-8 text-center text-xs text-gray-400">No users found</div>
                                ) : (
                                    searchResults.map((user) => (
                                        <button
                                            key={user.email}
                                            onClick={() => startChatWithUser(user)}
                                            className="w-full p-4 flex items-center gap-3 hover:bg-black/5 transition-all border-b border-gray-50"
                                        >
                                            <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs font-bold text-gray-900">{user.name}</p>
                                                <p className="text-[10px] text-gray-500">{user.email}</p>
                                            </div>
                                            <RiAddLine className="ml-auto text-gray-400" />
                                        </button>
                                    ))
                                )}
                            </div>
                        )}

                        <div className="p-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Active Conversations
                        </div>
                        
                        {loading ? (
                            <div className="p-4 space-y-4">
                                <div className="h-12 bg-gray-50 rounded-xl animate-pulse" />
                                <div className="h-12 bg-gray-50 rounded-xl animate-pulse" />
                            </div>
                        ) : sessions.length === 0 ? (
                            <div className="p-12 text-center opacity-30 grayscale flex flex-col items-center gap-3">
                                <RiMessage3Line size={40} />
                                <p className="text-xs font-medium">No chats yet</p>
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <button
                                    key={session.email}
                                    onClick={() => selectSession(session)}
                                    className={`w-full p-4 flex items-start gap-3 transition-all border-b border-gray-50 hover:bg-gray-50/50 relative ${
                                        activeSession?.email === session.email ? 'bg-black/5 !border-l-4 !border-l-black' : ''
                                    }`}
                                >
                                    <div className="h-10 w-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 relative">
                                        {session.name.charAt(0).toUpperCase()}
                                        {session.unread && (
                                            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <p className={`text-sm truncate ${session.unread ? 'font-black text-black' : 'font-bold text-gray-900'}`}>
                                                {session.name}
                                            </p>
                                            <span className={`text-[9px] font-bold ${session.unread ? 'text-red-500' : 'text-gray-400'}`}>
                                                {session.timestamp}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${session.unread ? 'text-black font-medium' : 'text-gray-500'}`}>
                                            {session.lastMessage}
                                        </p>
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
                                <h3 className="text-lg font-bold text-gray-800">Support Center</h3>
                                <p className="text-sm text-gray-500">Select a user to start or continue a conversation</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Messages area */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/20 custom-scrollbar">
                                {messages.length === 0 && (
                                    <div className="text-center py-20 opacity-20">
                                        <RiUserAddLine size={48} className="mx-auto mb-3" />
                                        <p className="text-sm font-medium">New Conversation with {activeSession.name}</p>
                                        <p className="text-xs italic">Type a message below to reach out</p>
                                    </div>
                                )}
                                {messages.map((msg) => (
                                    <div 
                                        key={msg.id} 
                                        className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className="max-w-[80%] lg:max-w-[65%] space-y-1">
                                            <div className={`p-1 rounded-2xl text-sm transition-all shadow-sm overflow-hidden ${
                                                msg.sender === 'admin' 
                                                ? 'bg-black text-white rounded-tr-none' 
                                                : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                                            }`}>
                                                {msg.imageUrl && (
                                                    <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                                                        <img 
                                                            src={msg.imageUrl} 
                                                            alt="Attachment" 
                                                            className="w-full max-h-60 object-cover rounded-xl hover:opacity-90 transition-opacity cursor-zoom-in"
                                                        />
                                                    </a>
                                                )}
                                                {msg.text && (
                                                    <div className="px-4 py-2">{msg.text}</div>
                                                )}
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
                                        className="bg-black text-white px-5 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-black/10"
                                    >
                                        <RiSendPlaneFill size={20} />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatClient;
