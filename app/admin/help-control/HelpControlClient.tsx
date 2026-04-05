'use client'

import React, { useState, useEffect, useRef } from 'react'
import { db } from '@/lib/firebaseConfig'
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    setDoc, 
    updateDoc, 
    addDoc, 
    serverTimestamp,
    increment,
    where,
    getDocs,
    limit,
    Timestamp,
    writeBatch
} from 'firebase/firestore'
import { RiSearchLine, RiSendPlaneFill, RiUserFill, RiTimeLine, RiCheckDoubleLine } from 'react-icons/ri'
import { formatDistanceToNow } from 'date-fns'

interface Message {
    id: string
    text: string
    senderId: string
    createdAt: any
    isRead: boolean
}

interface ChatSession {
    id: string // userEmail
    lastMessage: string
    lastMessageAt: any
    unreadCountAdmin: number
    unreadCountUser: number
    isVisibleToUser: boolean
    status: 'active' | 'closed'
    userName?: string
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
    
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Subscribe to all chat sessions
    useEffect(() => {
        const q = query(collection(db, 'chats'), orderBy('lastMessageAt', 'desc'))
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sessionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ChatSession[]
            setSessions(sessionsData)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    // Subscribe to messages for selected session
    useEffect(() => {
        if (!selectedSession) {
            setMessages([])
            return
        }

        const q = query(
            collection(db, 'chats', selectedSession.id, 'messages'),
            orderBy('createdAt', 'asc')
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Message[]
            setMessages(messagesData)
            
            // Mark as read by admin when session is open
            if (selectedSession.unreadCountAdmin > 0) {
                updateDoc(doc(db, 'chats', selectedSession.id), {
                    unreadCountAdmin: 0
                })
            }
        })

        return () => unsubscribe()
    }, [selectedSession?.id])

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!inputText.trim() || !selectedSession) return

        const text = inputText.trim()
        setInputText('')

        try {
            const timestamp = Date.now()
            const batch = writeBatch(db)

            // 1. Add message
            const messageRef = doc(collection(db, 'chats', selectedSession.id, 'messages'))
            batch.set(messageRef, {
                text,
                senderId: 'admin',
                createdAt: timestamp,
                isRead: false
            })

            // 2. Update session
            const sessionRef = doc(db, 'chats', selectedSession.id)
            batch.update(sessionRef, {
                lastMessage: text,
                lastMessageAt: timestamp,
                unreadCountUser: increment(1),
                isVisibleToUser: true
            })

            await batch.commit()
        } catch (error) {
            console.error('Error sending message:', error)
            alert('Failed to send message')
        }
    }

    const searchUsers = async (query: string) => {
        if (query.length < 3) {
            setSearchResults([])
            return
        }

        setIsSearching(true)
        try {
            const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}`)
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

    const startNewChat = async (user: any) => {
        const email = user.email
        const sessionRef = doc(db, 'chats', email)
        
        // Check if session exists, if not create it
        const exists = sessions.find(s => s.id === email)
        if (!exists) {
            await setDoc(sessionRef, {
                lastMessage: 'Chat started by Admin',
                lastMessageAt: Date.now(),
                unreadCountAdmin: 0,
                unreadCountUser: 0,
                isVisibleToUser: false, // Will become true after first admin message
                status: 'active',
                userName: user.name
            })
        }
        
        setSelectedSession({
            id: email,
            lastMessage: '',
            lastMessageAt: Date.now(),
            unreadCountAdmin: 0,
            unreadCountUser: 0,
            isVisibleToUser: false,
            status: 'active',
            userName: user.name
        })
        setSearchQuery('')
        setSearchResults([])
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-200px)] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
            {/* Sidebar: Chat Sessions */}
            <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 Inter">Conversations</h2>
                    <div className="relative">
                        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search user email/phone..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 rounded-lg text-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                searchUsers(e.target.value)
                            }}
                        />
                        
                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                {searchResults.map(user => (
                                    <button 
                                        key={user.email}
                                        className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
                                        onClick={() => startNewChat(user)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-medium text-xs">
                                            {user.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">
                            <RiUserFill size={48} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No conversations yet</p>
                        </div>
                    ) : (
                        sessions.map(session => (
                            <button 
                                key={session.id}
                                className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 ${selectedSession?.id === session.id ? 'bg-emerald-50/50' : ''}`}
                                onClick={() => setSelectedSession(session)}
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold overflow-hidden">
                                        {session.userName?.[0] || session.id[0].toUpperCase()}
                                    </div>
                                    {session.unreadCountAdmin > 0 && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                            {session.unreadCountAdmin}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {session.userName || session.id.split('@')[0]}
                                        </p>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                            {session.lastMessageAt ? formatDistanceToNow(session.lastMessageAt) + ' ago' : ''}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{session.lastMessage}</p>
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
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                                    {selectedSession.userName?.[0] || selectedSession.id[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">{selectedSession.userName || 'Travoxa User'}</h3>
                                    <p className="text-xs text-gray-500">{selectedSession.id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedSession.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {selectedSession.status}
                                </span>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                            {messages.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <RiTimeLine size={32} className="mb-2 opacity-20" />
                                    <p className="text-sm italic">Send your first message to begin the chat</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isMe = msg.senderId === 'admin'
                                    return (
                                        <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[70%] group`}>
                                                {!isMe && <p className="text-[10px] text-gray-400 mb-1 ml-2">User</p>}
                                                <div className={`p-3 rounded-2xl shadow-sm ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                                    <div className={`flex items-center justify-end gap-1 mt-1 opacity-60`}>
                                                        <span className="text-[9px]">
                                                            {msg.createdAt ? (typeof msg.createdAt === 'number' ? new Date(msg.createdAt) : msg.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                                        </span>
                                                        {isMe && <RiCheckDoubleLine className={msg.isRead ? 'text-blue-300' : ''} size={12} />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-white">
                            <div className="flex items-center gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Type your response..."
                                    className="flex-1 px-4 py-3 bg-gray-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-0 rounded-xl text-sm transition-all"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                />
                                <button 
                                    type="submit"
                                    disabled={!inputText.trim()}
                                    className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${inputText.trim() ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700' : 'bg-gray-100 text-gray-400'}`}
                                >
                                    <RiSendPlaneFill size={22} />
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <MessageSquare size={48} className="opacity-10" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-600 mb-2">Help System Active</h3>
                        <p className="text-sm max-w-xs text-center">Select a conversation from the sidebar or search for a user to start a new chat session.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const MessageSquare = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
)

export default HelpControlClient
