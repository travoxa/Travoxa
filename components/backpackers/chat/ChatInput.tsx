'use client';

import { FormEvent, useState } from 'react';

import type { GroupMessage } from '@/data/backpackers';

interface ChatInputProps {
  groupId: string;
  onMessageSent?: (message: GroupMessage) => void;
}

export default function ChatInput({ groupId, onMessageSent }: ChatInputProps) {
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!message.trim()) return;
    setStatus('sending');

    try {
      const response = await fetch(`/api/groups/${groupId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: displayName.trim() ? displayName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'guest',
          senderName: displayName.trim() || 'Guest explorer',
          text: message.trim(),
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const createdMessage = await response.json();
      setMessage('');
      setStatus('success');
      if (createdMessage?.message && onMessageSent) {
        onMessageSent(createdMessage.message);
      }
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white">
      <p className="text-xs uppercase tracking-[0.3em] text-white/60">Drop a note</p>
      <h3 className="text-xl font-semibold">Sync up with the crew</h3>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-white/70">Name or handle</label>
          <input
            className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-white focus:outline-none"
            placeholder="Eg. Rhea / @rhea"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-white/70">Message</label>
          <textarea
            className="mt-2 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder-white/40 focus:border-white focus:outline-none"
            rows={4}
            placeholder="Share arrival plans, questions or energy checks."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {status === 'error' && (
          <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm text-rose-100">
            Could not send message.
          </p>
        )}
        {status === 'success' && (
          <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
            Message sent.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="ml-auto inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {status === 'sending' ? 'Sending…' : 'Send'}
        </button>
      </div>
    </form>
  );
}
