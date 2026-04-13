'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
    RiSearchLine, 
    RiSendPlaneFill, 
    RiUserFill, 
    RiTimeLine, 
    RiCheckDoubleLine,
    RiChat3Line,
    RiDeleteBinLine,
    RiShieldCheckLine,
    RiMessage3Line,
    RiAddLine
} from 'react-icons/ri'
import { formatDistanceToNow } from 'date-fns'
import Pusher from 'pusher-js'

interface Message {
    id: string
    text: string
    sender: 'user' | 'admin'
    senderId: string
    timestamp: string
    isRead?: boolean
    imageUrl?: string
}

interface ChatSession {
    email: string
    name: string
    lastMessage: string
    timestamp: string
    createdAt: string
    unread?: boolean
    unreadCount?: number
}

const HelpControlClient = () => {
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputText, setInputText] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [loading, setLoading] = useState(true)
    const [connected, setConnected] = useState(false)
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error' | 'disconnected'>('connecting')
    const [lastPusherError, setLastPusherError] = useState<string | null>(null)
    
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const selectedSessionRef = useRef<ChatSession | null>(null)
    const pusherRef = useRef<Pusher | null>(null)

    // Update ref whenever selectedSession changes
    useEffect(() => {
        selectedSessionRef.current = selectedSession
    }, [selectedSession])

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // 1. Fetch Chat Sessions (sidebar list)
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch('/api/admin/chat/users')
                const data = await res.json()
                if (data.success) {
                    setSessions(data.chats)
                }
            } catch (err) {
                console.error('Failed to fetch sessions:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchSessions()
        const poll = setInterval(fetchSessions, 30000)
        return () => clearInterval(poll)
    }, [])

    // 2. Load History when session changes
    useEffect(() => {
        if (!selectedSession) {
            setMessages([])
            return
        }

        const fetchHistory = async () => {
            try {
                const channel = `user-${selectedSession.email}`
                const res = await fetch(`/api/pusher/message?channel=${channel}`)
                const data = await res.json()
                if (data.success) {
                    setMessages(data.history || [])
                    
                    // Mark as read if there are unread messages
                    if (selectedSession.unread) {
                        markAsRead(selectedSession.email)
                    }
                }
            } catch (err) {
                console.error('Failed to fetch history:', err)
            }
        }

        fetchHistory()
    }, [selectedSession?.email])

    // 3. Shared Pusher Connection & Global Notifications
    useEffect(() => {
        if (!pusherRef.current) {
            const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
            const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

            console.log('[Pusher] Initializing singleton connection...', { 
                key: pusherKey ? `${pusherKey.slice(0, 4)}...` : 'MISSING', 
                cluster: pusherCluster || 'MISSING' 
            });

            if (!pusherKey || !pusherCluster) {
                setConnectionStatus('error');
                setLastPusherError('Pusher credentials missing in environment');
                return;
            }

            pusherRef.current = new Pusher(pusherKey, {
                cluster: pusherCluster,
                forceTLS: true,
                enabledTransports: ['ws', 'wss'], // Force WebSockets
            })

            pusherRef.current.connection.bind('connecting', () => {
                setConnectionStatus('connecting');
            });

            pusherRef.current.connection.bind('connected', () => {
                console.log('[Pusher] Connected successfully.');
                setConnected(true);
                setConnectionStatus('connected');
                setLastPusherError(null);
            });

            pusherRef.current.connection.bind('error', (err: any) => {
                console.error('[Pusher] Connection error:', err);
                setConnectionStatus('error');
                setLastPusherError(err?.message || 'Connection error');
            });

            pusherRef.current.connection.bind('failed', () => {
                setConnectionStatus('error');
                setLastPusherError('Connection failed - check network');
            });

            pusherRef.current.connection.bind('disconnected', () => {
                console.log('[Pusher] Disconnected.');
                setConnected(false);
                setConnectionStatus('disconnected');
            });
        }

        const pusher = pusherRef.current;
        const globalChannel = pusher.subscribe('admin-notifications')

        globalChannel.bind('subscription_error', (status: any) => {
            console.error('[Pusher] Global Subscription Error:', status);
        });
        
        globalChannel.bind('new-message', (data: any) => {
            const currentSelected = selectedSessionRef.current
            
            // Normalize IDs for comparison
            const incomingId = (data.senderId || '').trim().toLowerCase()
            const currentId = (currentSelected?.email || '').trim().toLowerCase()
            const isCurrentlySelected = currentId !== '' && currentId === incomingId

            console.log(`[ChatDebug] Message from ${incomingId}. Active: ${currentId}. Match: ${isCurrentlySelected}`);

            // Update session list for ANY new message from users
            setSessions(prev => {
                const sessionExists = prev.some(s => s.email.trim().toLowerCase() === incomingId)

                if (sessionExists) {
                    return prev.map(s => {
                        if (s.email.trim().toLowerCase() === incomingId) {
                            return { 
                                ...s, 
                                lastMessage: data.imageUrl ? '📷 Photo' : data.text, 
                                timestamp: data.timestamp,
                                unread: isCurrentlySelected ? false : (data.sender === 'user' ? true : s.unread),
                                unreadCount: isCurrentlySelected ? 0 : (data.sender === 'user' ? (s.unreadCount || 0) + 1 : s.unreadCount)
                            }
                        }
                        return s
                    }).sort((a, b) => {
                        // Move most recent to top
                        if (a.email.trim().toLowerCase() === incomingId) return -1
                        if (b.email.trim().toLowerCase() === incomingId) return 1
                        return 0
                    })
                }
                
                // New user session
                if (data.sender === 'user') {
                    return [{
                        email: data.senderId,
                        name: data.senderName || data.senderId.split('@')[0],
                        lastMessage: data.imageUrl ? '📷 Photo' : data.text,
                        timestamp: data.timestamp,
                        createdAt: new Date().toISOString(),
                        unread: !isCurrentlySelected,
                        unreadCount: isCurrentlySelected ? 0 : 1
                    }, ...prev]
                }
                return prev
            })

            // IMPORTANT: If it's the active chat, update messages HERE too.
            if (isCurrentlySelected) {
                setMessages((prev) => {
                    if (prev.some(m => m.id === data.id)) return prev
                    return [...prev, data]
                })
                if (data.sender === 'user') {
                    markAsRead(incomingId)
                }
            }
        })

        return () => {
            console.log('[Pusher] Cleaning up global subscriptions...');
            globalChannel.unbind_all()
            globalChannel.unsubscribe()
        }
    }, [])

    // 4. Dynamic Subscription for Active Conversation
    useEffect(() => {
        if (!selectedSession?.email || !pusherRef.current) return

        const pusher = pusherRef.current;
        const activeChannelName = `user-${selectedSession.email}`
        console.log(`[Pusher] Subscribing to active session channel: ${activeChannelName}`);
        
        const activeChannel = pusher.subscribe(activeChannelName)
        
        activeChannel.bind('subscription_error', (status: any) => {
            console.error(`[Pusher] Subscription Error for ${activeChannelName}:`, status);
        });

        // Handle new messages for THE SELECTED SESSION
        activeChannel.bind('new-message', (data: any) => {
            setMessages((prev) => {
                if (prev.some(m => m.id === data.id)) return prev
                return [...prev, data]
            })
            
            if (data.sender === 'user') {
                markAsRead(selectedSession.email)
            }
        })

        // Handle read status updates
        activeChannel.bind('messages-read', (data: { reader: string, channel: string }) => {
            if (data.reader === 'user') {
                // User read admin messages
                setMessages(prev => prev.map(m => 
                    m.sender === 'admin' ? { ...m, isRead: true } : m
                ))
            }
        })

        return () => {
            console.log(`[Pusher] Unsubscribing from channel: ${activeChannelName}`);
            activeChannel.unbind_all()
            activeChannel.unsubscribe()
        }
    }, [selectedSession?.email])

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputText.trim() || !selectedSession) return

        const text = inputText.trim()
        setInputText('')

        const channel = `user-${selectedSession.email}`
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const localMsg: Message = {
            id: Date.now().toString(),
            text,
            sender: 'admin',
            senderId: 'admin',
            timestamp
        }

        setMessages(prev => [...prev, localMsg])

        try {
            const res = await fetch('/api/pusher/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    sender: 'admin',
                    senderId: 'admin',
                    receiverId: selectedSession.email,
                    channel: channel,
                    id: localMsg.id,
                    timestamp: localMsg.timestamp
                }),
            })
            if (!res.ok) throw new Error('Failed to send')
        } catch (error) {
            console.error('Error sending message:', error)
            alert('Failed to send message')
        }
    }

    const markAsRead = async (email: string) => {
        try {
            const channel = `user-${email}`
            await fetch('/api/admin/chat/read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channel, reader: 'admin' }),
            })
            setSessions(prev => prev.map(s => 
                s.email.trim().toLowerCase() === email.trim().toLowerCase() ? { ...s, unread: false, unreadCount: 0 } : s
            ))
        } catch (err) {
            console.error('Failed to mark as read:', err)
        }
    }

    const searchUsers = async (query: string) => {
        if (query.length < 3) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        try {
            const res = await fetch(`/api/admin/chat/search?query=${encodeURIComponent(query)}`)
            const data = await res.json()
            if (data.success) {
                setSearchResults(data.users)
            }
        } catch (error) {
            console.error('Search error:', error)
        } finally {
            setIsSearching(false)
        }
    }

    const startNewChat = (user: any) => {
        const existingSession = sessions.find(s => s.email.toLowerCase() === user.email.toLowerCase())
        if (existingSession) {
            setSelectedSession(existingSession)
        } else {
            setSelectedSession({
                email: user.email,
                name: user.name,
                lastMessage: 'New conversation',
                timestamp: 'Now',
                createdAt: new Date().toISOString(),
                unread: false
            })
        }
        setSearchQuery('')
        setSearchResults([])
    }

    const deleteChat = async (e: React.MouseEvent, session: ChatSession) => {
        e.stopPropagation()
        if (!confirm(`Are you sure you want to delete chat history for ${session.name}?`)) return

        try {
            const res = await fetch(`/api/admin/chat/delete?channel=user-${session.email}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                setSessions(prev => prev.filter(s => s.email !== session.email))
                if (selectedSession?.email === session.email) {
                    setSelectedSession(null)
                    setMessages([])
                }
            }
        } catch (err) {
            console.error('Delete failed:', err)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-280px)] min-h-[600px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xl font-sans">
            {/* Sidebar: Chat Sessions */}
            <div className="w-80 border-r border-gray-50 bg-gray-50/20 flex flex-col">
                <div className="p-4 border-b border-gray-50 bg-white">
                    <div className="relative">
                        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Find traveler..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-black/5 rounded-xl text-xs transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                searchUsers(e.target.value)
                            }}
                        />
                        
                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                                {searchResults.map(user => (
                                    <button 
                                        key={user.email}
                                        className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors"
                                        onClick={() => startNewChat(user)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">
                                            {user.name[0].toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                                            <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="px-4 py-3 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Conversations</span>
                        {connected && <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />}
                    </div>
                    {sessions.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 opacity-50">
                            <RiMessage3Line size={48} className="mx-auto mb-2" />
                            <p className="text-[11px] font-medium">No messages yet</p>
                        </div>
                    ) : (
                        sessions.map(session => (
                            <button 
                                key={session.email}
                                className={`w-full p-4 flex items-start gap-3 hover:bg-white transition-all border-b border-gray-50 group relative ${selectedSession?.email === session.email ? 'bg-white shadow-sm z-10' : ''}`}
                                onClick={() => setSelectedSession(session)}
                            >
                                {selectedSession?.email === session.email && <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />}
                                <div className="relative shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                                        {session.name[0].toUpperCase()}
                                    </div>
                                    {session.unread && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                                            <span className="text-[8px] text-white font-bold">{session.unreadCount}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <p className={`text-sm truncate ${session.unread ? 'font-black text-emerald-600' : 'font-bold text-gray-900'}`}>
                                            {session.name}
                                        </p>
                                        <span className="text-[9px] text-gray-400 whitespace-nowrap">
                                            {session.timestamp}
                                        </span>
                                    </div>
                                    <p className={`text-xs truncate ${session.unread ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                                        {session.lastMessage}
                                    </p>
                                </div>
                                <div className="hidden group-hover:block absolute right-2 top-1/2 -translate-y-1/2">
                                    <div onClick={(e) => deleteChat(e, session)} className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-all">
                                        <RiDeleteBinLine size={14} />
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Main Chat Window */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedSession ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                                    {selectedSession.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-900">{selectedSession.name}</h3>
                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{selectedSession.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className={`flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                                    connectionStatus === 'connected' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                                    connectionStatus === 'error' ? 'text-red-600 bg-red-50 border-red-100' :
                                    'text-amber-600 bg-amber-50 border-amber-100'
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${
                                        connectionStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
                                        connectionStatus === 'error' ? 'bg-red-500' :
                                        'bg-amber-500 animate-pulse'
                                    }`} />
                                    {connectionStatus === 'connected' ? 'SECURE CLOUD SYNC' : 
                                     connectionStatus === 'error' ? (lastPusherError || 'SYNC ERROR') : 
                                     'CONNECTING...'}
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30 custom-scrollbar">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-50">
                                    <RiTimeLine size={48} className="mb-2" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Beginning of conversation</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.sender === 'admin'
                                    return (
                                        <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className="max-w-[75%] lg:max-w-[60%]">
                                                <div className={`p-1 rounded-2xl shadow-sm transition-all ${isMe ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                                                    {msg.imageUrl && (
                                                        <a href={msg.imageUrl} target="_blank" rel="noopener noreferrer">
                                                            <img src={msg.imageUrl} alt="Attachment" className="max-h-64 object-cover rounded-xl mb-1 hover:opacity-90 transition-opacity" />
                                                        </a>
                                                    )}
                                                    {msg.text && <p className="text-sm leading-relaxed px-3 py-2">{msg.text}</p>}
                                                </div>
                                                <div className={`flex items-center gap-1.5 mt-1 px-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                                        {msg.timestamp}
                                                    </span>
                                                    {isMe && <RiCheckDoubleLine className={msg.isRead ? 'text-blue-500' : 'text-gray-300'} size={14} />}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-50">
                            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                                <input 
                                    type="text" 
                                    placeholder={`Reply to ${selectedSession.name.split(' ')[0]}...`}
                                    className="flex-1 px-5 py-3.5 bg-gray-100 border-transparent focus:bg-white focus:ring-4 focus:ring-black/5 rounded-2xl text-sm transition-all outline-none"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-lg ${inputText.trim() ? 'bg-black text-white hover:scale-105 active:scale-95' : 'bg-gray-100 text-gray-400 opacity-50'}`}
                                >
                                    <RiSendPlaneFill size={20} />
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shadow-inner">
                            <RiChat3Line size={48} className="opacity-20" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-black text-gray-800 uppercase tracking-tight">Help System Ready</h3>
                            <p className="text-xs font-medium text-gray-500 mt-1">Select a traveler from the sidebar to begin</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HelpControlClient
