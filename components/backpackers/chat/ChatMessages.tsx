'use client';

import { useState } from 'react';

import type { GroupMessage } from '@/data/backpackers';

interface ChatMessagesProps {
  messages: GroupMessage[];
  onRefresh?: () => Promise<GroupMessage[]>;
}

export default function ChatMessages({ messages, onRefresh }: ChatMessagesProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">Live chat</p>
          <h2 className="text-2xl font-semibold">Crew check-ins</h2>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={handleRefresh}
            className="rounded-full border border-white/30 px-4 py-1 text-sm text-white/80 transition hover:bg-white/10"
          >
            {isRefreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2">
        {messages.length === 0 && (
          <p className="text-sm text-white/60">No conversations yet. Send the first update!</p>
        )}
        {messages.map((message) => (
          <article
            key={message.id}
            className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <header className="flex items-center justify-between text-sm">
              <span className="font-semibold">{message.senderName}</span>
              <span className="text-white/50">
                {new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </header>
            <p className="text-sm text-white/80">{message.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
