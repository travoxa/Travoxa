'use client';

import { FormEvent, useState } from 'react';

interface JoinRequestButtonProps {
  groupId: string;
}

export default function JoinRequestButton({ groupId }: JoinRequestButtonProps) {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    setStatus('loading');

    const userId = handle.trim()
      ? handle.trim().replace(/@/g, '').replace(/\s+/g, '-').toLowerCase()
      : name.trim().replace(/\s+/g, '-').toLowerCase();

    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: `user_${userId}`,
          note,
          name,
        }),
      });

      if (!response.ok) throw new Error('Request failed');

      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={submitRequest} className="rounded-3xl border border-gray-200 bg-white p-6 text-black">
      <header className="mb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Join queue</p>
        <h2 className="text-2xl font-semibold">Send a quick pitch</h2>
        <p className="mt-1 text-sm text-gray-600">Hosts review every story before admitting explorers.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm text-gray-600">Full name</label>
          <input
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-black placeholder-gray-400 focus:border-gray-400 focus:outline-none"
            placeholder="Eg. Rhea Kapoor"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-600">Social handle (optional)</label>
          <input
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-black placeholder-gray-400 focus:border-gray-400 focus:outline-none"
            placeholder="@wanderlust.rhea"
            value={handle}
            onChange={(event) => setHandle(event.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Why should the crew pick you?</label>
          <textarea
            className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-black placeholder-gray-400 focus:border-gray-400 focus:outline-none"
            rows={4}
            placeholder="Share your travel vibe, experience or skills."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {status === 'success' && (
          <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700">
            Request sent. Hosts usually respond within 12 hours.
          </p>
        )}
        {status === 'error' && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            Something glitched. Try again.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="ml-auto inline-flex items-center justify-center rounded-2xl bg-gray-900 px-6 py-3 text-base font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {status === 'loading' ? 'Sending...' : status === 'success' ? 'Request sent' : 'Request to join'}
        </button>
      </div>
    </form>
  );
}
